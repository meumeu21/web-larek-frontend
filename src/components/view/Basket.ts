import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    submitButton: HTMLButtonElement;
    basketPrice: HTMLElement;
    headerBasketButton: HTMLButtonElement;  // кнопки в хэдере
    headerBasketCounter: HTMLElement;  // кнопки в хэдере
    renderHeaderBasketCounter(value: number): void;
    renderSumAllProducts(sumAll: number): void;
    render(): HTMLElement;
}

export class Basket implements IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    submitButton: HTMLButtonElement;
    basketPrice: HTMLElement;
    headerBasketButton: HTMLButtonElement;
    headerBasketCounter: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents){
        this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
        this.title = this.basket.querySelector('.modal__title');
        this.basketList = this.basket.querySelector('.basket__list');
        this.submitButton = this.basket.querySelector('.basket__button');
        this.basketPrice = this.basket.querySelector('.basket__price');
        this.headerBasketButton = document.querySelector('.header__basket');
        this.headerBasketCounter = document.querySelector('.header__basket-counter');

        this.submitButton.addEventListener('click', () => {
            this.events.emit('order:open')
        });
        this.headerBasketButton.addEventListener('click', () => {
            this.events.emit('basket:open')
        });

        this.items = []
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
            this.submitButton.removeAttribute('disabled');
        } else {
            // this.submitButton.setAttribute('disabled', 'true');
            this.submitButton.disabled = true;
            this.basketList.replaceChildren(createElement<HTMLParagraphElement>(
                'p', 
                { textContent: 'Корзина пуста' }
            ));
        }
    }

    renderHeaderBasketCounter(value: number) {
        this.headerBasketCounter.textContent = String(value);
    }

    renderSumAllProducts(sumAll: number) {
        this.basketPrice.textContent = String(sumAll + ' синапсов');
    }

    // рендер модального окна с названием Корзина
    render(): HTMLElement {
        this.title.textContent = 'Корзина';
        return this.basket;
    }
}