import { IEvents } from "../base/events";

export interface IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    submitButton: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
}

export class Contacts implements IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    submitButton: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this.formContacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
        this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
        this.submitButton = this.formContacts.querySelector('.button');
        this.formErrors = this.formContacts.querySelector('.form__errors');

        this.inputAll.forEach(item => {
            item.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const fieldName = target.name;
                const fieldValue = target.value;
                this.events.emit('contacts:changeInput', { fieldName, fieldValue });
            });
        });

        this.formContacts.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('success:open');
        })
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    render(): HTMLElement {
        return this.formContacts;
    }
}