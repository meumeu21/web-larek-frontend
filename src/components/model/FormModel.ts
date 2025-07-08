import { IEvents } from "../base/events";
import { FormErrors } from "../../types";

export interface IFormModel {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
    setOrderAddress(field: string, value: string): void;  // принимаем значение строки "address"
    validateAddress(): boolean;  // валидация данных строки "address"
    setOrderEmailPhone(field: string, value: string): void;  // принимаем значение данных строк "Email" и "Телефон"
    validateEmailPhone(): boolean;  // валидация данных строк "Email" и "Телефон"
    getOrderLot(): object;
}

export class FormModel implements IFormModel {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.total = 0;
        this.items = [];
    }

    // принимаем значение строки "address"
    setOrderAddress(field: string, value: string) {
        if (field === 'address') {
            this.address = value;
        }

        if (this.validateAddress()) {
            this.events.emit('order:ready', this.getOrderLot);
        }
    }

    // валидация данных строки "address"
    validateAddress(): boolean {
        const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
        const errors: typeof this.formErrors = {};

        if (!this.address) {
            errors.address = 'Необходимо указать адрес'
        } else if (!regexp.test(this.address)) {
            errors.address = 'Укажите настоящий адрес'
        } else if (!this.payment) {
            errors.payment = 'Выберите способ оплаты'
        }

        this.formErrors = errors;
        this.events.emit('formErrors:address', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // принимаем значение данных строк "Email" и "Телефон"
    setOrderEmailPhone(field: string, value: string) {
        if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        }

        if (this.validateEmailPhone()) {
            this.events.emit('order:ready', this.getOrderLot());
        }
    }

    // валидация данных строк "Email" и "Телефон"
    validateEmailPhone() {
        const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
        const errors: typeof this.formErrors = {};

        if (!this.email) {
            errors.email = 'Необходимо указать email'
        } else if (!regexpEmail.test(this.email)) {
            errors.email = 'Некорректный адрес электронной почты'
        }

        if (this.phone.startsWith('8')) {
            this.phone = '+7' + this.phone.slice(1);
        }

        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон'
        } else if (!regexpPhone.test(this.phone)) {
            errors.phone = 'Некорректный формат номера телефона'
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getOrderLot(): object {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.items,
        }
    }
}