import { Card } from "./Card";
import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
    text: HTMLElement;
    buttonToCart: HTMLButtonElement;
    render(data: IProductItem): HTMLElement;
}

export class CardPreview extends Card implements ICard {
    text: HTMLElement;
    buttonToCart: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        super(template, events, actions);
        this.text = this._cardElement.querySelector('.card__text');
        this.buttonToCart = this._cardElement.querySelector('.card__button');
        
        this.buttonToCart.addEventListener('click', () => {
            this.events.emit('card:addBasket')
        });
    }

    isNotForSale(data: IProductItem) {
        if (data.price) {
            return 'Купить';
        } else {
            // this.buttonToCart.setAttribute('disabled', 'true')
            this.buttonToCart.disabled = true;
            return 'Не продаётся';
        }
    }

    render(data: IProductItem): HTMLElement {
        // this._cardCategory.textContent = data.category;
        this.cardCategory = data.category;
        this._cardTitle.textContent = data.title;
        this._cardImage.src = data.image;
        this._cardImage.alt = this._cardTitle.textContent;
        this._cardPrice.textContent = this.setPrice(data.price);

        this.text.textContent = data.description;
        this.buttonToCart.textContent = this.isNotForSale(data);

        return this._cardElement;
    }
}