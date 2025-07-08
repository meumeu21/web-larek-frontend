export interface IProductItem {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

export interface IOrderForm {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
    total?: string | number;
}

// заказ
export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderLot {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;