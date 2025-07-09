import { ApiListResponse, Api } from "../base/api";
import { IOrderLot, IOrderResult, IProductItem } from "../../types";

export interface IApiModel {
    cdn: string;
    items: IProductItem[];
    getListProductCard: () => Promise<IProductItem[]>;  // получаем массив объектов (карточек) с сервера
    postOrderLot: (order: IOrderLot) => Promise<IOrderResult>;  // получаем ответ от сервера по сделанному заказу
}

export class ApiModel extends Api {
    cdn: string;
    items: IProductItem[];

    constructor(cdn: string, baseURL: string, options?: RequestInit) {
        super(baseURL, options);
        this.cdn = cdn;
    }

    // получаем массив объектов (карточек) с сервера
    getListProductCard(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    // получаем ответ от сервера по сделанному заказу
    postOrderLot(order: IOrderLot): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data);
    }
}