import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/model/ApiModel';
import { BasketModel } from './components/model/BasketModel';
import { DataModel } from './components/model/DataModel';
import { FormModel } from './components/model/FormModel';
import { Basket } from './components/view/Basket';
import { BasketItem } from './components/view/BasketItem';
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { Contacts } from './components/view/FormContacts';
import { Order } from './components/view/FormOrder';
import { Modal } from './components/view/Modal';
import { Success } from './components/view/Success';

import { ensureElement } from './utils/utils';
import { IOrderForm, IProductItem } from './types';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const events = new EventEmitter();

const apiModel = new ApiModel(CDN_URL, API_URL);
const basketModel = new BasketModel();
const dataModel = new DataModel(events);
const formModel = new FormModel(events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);



// События
// Отображение карточек на странице (в галерее)
events.on('productCards:receive', () => {
    dataModel.productCards.forEach(item => {
        const card = new Card(
            cardCatalogTemplate,
            events,
            { onClick: () => events.emit('card:select', item) },
        );
        ensureElement<HTMLElement>('.gallery').append(card.render(item));
    });
});

// Получение данных (IProductItem) выбранной карточки товарав
events.on('card:select', (item: IProductItem) => { dataModel.setModalOpen(item) });

// Открытие модального окна выбранной карточки товара
events.on('modalCard:open', (item: IProductItem) => {
    const cardPreview = new CardPreview(cardPreviewTemplate, events)
    modal.content = cardPreview.render(item);
    modal.render();
});

// Добавление карточки товара в корзину
events.on('card:addBasket', () => {
    basketModel.addCardToBasket(dataModel.selectedCard);
    basket.renderHeaderBasketCounter(basketModel.getProductsCount());
    modal.close();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
    basket.renderSumAllProducts(basketModel.getSumAllProducts());

    // Заполнение индекса товаров в модальном окне корзины
    let i = 0;
    basket.items = basketModel.basketProducts.map((item) => {
        const basketItem = new BasketItem(
            cardBasketTemplate,
            events,
            { onClick: () => events.emit('basket:basketItemRemove', item) }
        );
        i = i + 1;
        return basketItem.render(item, i);
    });

    modal.content = basket.render();
    modal.render();
});

// Удаление товара из корзины (в модальном окне корзины)
events.on('basket:basketItemRemove', (item: IProductItem) => {
    basketModel.removeCardFromBasket(item);
    basket.renderHeaderBasketCounter(basketModel.getProductsCount());
    basket.renderSumAllProducts(basketModel.getSumAllProducts());

    // Заполнение индекса товаров в модальном окне корзины
    let i = 0;
    basket.items = basketModel.basketProducts.map((item) => {
        const basketItem = new BasketItem(
            cardBasketTemplate,
            events,
            { onClick: () => events.emit('basket:basketItemRemove', item) }
        );
        i = i + 1;
        return basketItem.render(item, i);
    })
});

// Открытие модального окна с способом оплаты и адресом доставки
events.on('order:open', () => {
    modal.content = order.render();
    modal.render();
    formModel.items = basketModel.basketProducts.map(item => item.id);
});

// Передача способа оплаты (онлайн или при получении)
events.on('order:paymentSelection', 
    (button: HTMLButtonElement) => { formModel.payment = button.name}
);

// Отслеживание изменений в поле ввода адреса доставки
events.on('order:changeAddress', 
    (data: { fieldName: string, fieldValue: string }) => {
        formModel.setOrderAddress(data.fieldName, data.fieldValue);
    }
);

// Валидация формы в полях ввода адреса доставки и способа оплаты
events.on('formErrors:address',
    (errors: Partial<IOrderForm>) => {
        const { address, payment } = errors;
        order.valid = !address && !payment;
        order.formErrors.textContent = Object.values({ address, payment })
            .filter(i => !!i).join('; ');
    }
);

// Открытие модального окна с почтой и телефоном
events.on('contacts:open', () => {
    formModel.total = basketModel.getSumAllProducts();
    modal.content = contacts.render();
    modal.render();
});

// Отслеживание изменений в полях почты и телефона
events.on('contacts:changeInput', 
    (data: { fieldName: string, fieldValue: string }) => {
        formModel.setOrderEmailPhone(data.fieldName, data.fieldValue);
    }
);

// Валидация формы в полях ввода почты и телефона
events.on('formErrors:change', 
    (errors: Partial<IOrderForm>) => {
        const { email, phone } = errors;
        contacts.valid = !email && !phone;
        contacts.formErrors.textContent = Object.values({ email, phone })
            .filter(i => !!i).join('; ');
    }
);

// Открытие модального окна успешного оформленного заказа
events.on('success:open', () => {
    apiModel.postOrderLot(formModel.getOrderLot())
        .then((data) => {
            // Ответ сервера
            console.log(data);
            const success = new Success(successTemplate, events);
            modal.content = success.render(basketModel.getSumAllProducts());
            // Очистка корзины
            basketModel.clearBasketProducts();
            // Отображение количества товаров в корзине в header
            basket.renderHeaderBasketCounter(basketModel.getProductsCount());
            modal.render();
        })
        .catch(error => console.log(error));
});

// Закрытие модального окна успешного оформленного заказа
events.on('success:close', () => modal.close());

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
    modal.locked = true;
});

// Разблокировка прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
    modal.locked = false;
});

// Получение данных с сервера
apiModel.getListProductCard()
    .then(function (data: IProductItem[]) {
        dataModel.productCards = data;
    })
    .catch(error => console.log(error));