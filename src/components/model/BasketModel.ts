import { IProductItem } from "../../types";

export interface IBasketModel {
    basketProducts: IProductItem[];
    getProductsCount: () => number;  // количество всех товаров корзины
    getSumAllProducts: () => number;  // сумма всех товаров корзины
    addCardToBasket(data: IProductItem): void;  // добавить карточку товара в корзину
    removeCardFromBasket(item: IProductItem): void;  // удалить карточку товара из корзины
    clearBasketProducts(): void;  // очистка корзины
}

export class BasketModel implements IBasketModel {
    protected _basketProducts: IProductItem[];

    constructor() {
        this._basketProducts = [];
    }

    set basketProducts(data: IProductItem[]) {
        this._basketProducts = data;
    }

    get basketProducts() {
        return this._basketProducts;
    }

    getProductsCount() {
        return this.basketProducts.length;
    }

    getSumAllProducts() {
        let sumAll = 0;
        this.basketProducts.forEach(item => {
            sumAll = sumAll + item.price;
        });
        return sumAll;
    }

    // добавить карточку товара в корзину
    addCardToBasket(data: IProductItem): void {
        this._basketProducts.push(data);
    }

    // удалить карточку товара из корзины
    removeCardFromBasket(item: IProductItem) {
        const index = this._basketProducts.indexOf(item);
        if (index >= 0) {
            this._basketProducts.splice(index, 1);
        }
    }

    // очистка корзины
    clearBasketProducts() {
        this.basketProducts = [];
    }
}