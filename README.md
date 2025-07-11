# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Описание
В проекте применен принцип MVP (Model-View-Presenter), который обеспечивает четкое разделение ответственностей между классами Model и View каждый класс выполняет свою определенную роль:

Model - работа с загрузкой данных по API, сохранение и работа с данными полученными от пользователя.

View - отображает интерфейс для взаимодействия с пользователем, отлавливает и сообщает о произошедших событиях.

EventEmitter выступает в роли Представителя (Presenter) - связывает модели данных с отображением интерфейсов при сработке какого нибудь события, управляя взаимодействием между ними.


Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание базовых классов

### Класс `Api` имеет следующие свойства и методы.

Методы:
- `handleResponse(response: Response): Promise<object>` - обработчик ответа сервера.
- `get(uri: string)` - принимает изменяющеюся часть url-адреса, возвращает ответ от сервера.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает изменяющеюся часть url-адреса, принимает данные в виде объекта для отправки на сервер, type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'.

### Класс `EventEmitter` - брокер событий, implements от IEvents и имеет следующие методы.

Класс EventEmitter реализует паттерн «Observer/Наблюдатель» и обеспечивает работу событий, его методы позволяют устанавливать и снимать слушатели событий, вызвать слушатели при возникновении события.

Методы:
- `on` - для подписки на событие.
- `off` - для отписки от события.
- `emit` - уведомления подписчиков о наступлении события соответственно.
- `onAll` - для подписки на все события.
- `offAll` - сброса всех подписчиков.
- `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`.

## Описание классов Model, которые позволяют хранить и обрабатывать данные с сервера и от пользователей.

### Класс `ApiModel` наследуется от класса `Api`, передаёт и получает данные от сервера.

Методы:
- `getListProductCard` - получаем массив объектов(карточек) с сервера.
- `postOrderLot` - получаем ответ от сервера по сделанному/отправленному заказу.

### Класс `BasketModel` хранит и работает с данными полученными от пользователя.

Методы:
- `getCounter` - возвращает количество товаров в корзине.
- `getSumAllProducts` - считает и возвращает сумму синапсов всех товаров в корзине.
- `setSelectedСard` - добавляет товар в корзину.
- `deleteCardToBasket` - удаляет товар из корзины.
- `clearBasketProducts` - очищает/удаляет все товары из корзины.

### Класс `DataModel` принимает и хранит данные продуктов полученные с сервера.

Метод:
- `setPreview` - получает данные карточки которую открыл пользователь.

### Класс `FormModel` хранит данные полученные от пользователя.

Методы:
- `setOrderAddress` - принимаем/сохраняет адрес пользователя.
- `validateOrder` - проверяет адрес пользователя / и способ оплаты.
- `setOrderData` - принимаем/сохраняет номер телефона/почту пользователя.
- `validateContacts` - проверяет номер телефона/почту пользователя.
- `getOrderLot` - возвращает объект данных пользователя с выбранными товарами.

## Классы View позволяют отображать элементы страницы с полученными данными, позволяют взаимодействовать с пользователем.

### Класс `Basket` управляет отображением корзины.

Методы:
- `renderHeaderBasketCounter` - сохраняет и устанавливает какое количество товаров находится в корзине.
- `renderSumAllProducts` - сохраняет и устанавливает сумму синапсов всех товаров в корзине.

### Класс `BasketItem` управляет отображением элементов(продуктов) в корзине.

Метод:
- `setPrice` - принимает цену продукта в числовом значении и возвращает в строчном.

### Класс `Card` управляет отображением карточки товара на веб странице.

Методы:
- `setText` - принимает два значения, первое HTMLElement, второе значение задаёт текстовое содержимое HTMLElement.
- `cardCategory` - принимает строчное значение и создаёт новый className для HTMLElement.
- `setPrice` - принимает цену продукта в числовом значении и возвращает в строчном.

### Класс `CardPreview` наследуется от класса `Card` и управляет отображением подробного описания карточки товара в превью, позволяет добавить карточку в корзину.

Метод:
- `notSale` - принимает данные о продукте, проверяет наличие цены продукта, при отсутствии цены ограничивает покупку.

### Класс `Order` управляет отображением содержимого модального окна и позволяет принять от пользователя метод оплаты и адрес.

Метод:
- `paymentSelection` - устанавливаем обводку вокруг выбранного метода оплаты.

### Класс `Contacts` управляет отображением содержимого модального окна и позволяет принять от пользователя номер телефона и Email.

### Класс `Modal` управляет отображением модальных окон.

Методы:
- open - отображает модальное окон.
- close - закрывает модальное окно.

### Класс `Success` управляет отображением удачного заказа в модальном окне.

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
