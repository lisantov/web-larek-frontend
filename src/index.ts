import './scss/styles.scss';
import { EventEmitter, IEvents } from './components/base/events';
import { Catalog } from './components/data/catalogData';
import { User } from './components/data/userData';
import { CartD } from './components/data/cartData';
import { EventsList, IProduct, TUserContactInfo, TUserOrderInfo } from './types';
import { Api } from './components/base/api';
import { AppApi } from './components/communication/appApi';
import { API_URL, settings } from './utils/constants';
import { Card } from './components/view/card';
import { CardsContainer } from './components/view/cardsContainer';
import { cloneTemplate } from './utils/utils';
import { Cart } from './components/view/cart';
import { Modal } from './components/common/Modal';
import { Form } from './components/common/FormComponent';
import { Success } from './components/view/success';
import { Page } from './components/view/page';

// ТЕМПЛЕЙТЫ
const catalogCardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cartCardTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const modalCardTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cartTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const events = new EventEmitter();
const api = new Api(API_URL, settings);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const catalogData = new Catalog(events);
const cartData = new CartD(events);
const userData = new User();
const appAPI = new AppApi(api);

const catalogView = new CardsContainer(document.querySelector('.gallery'));
const cartView = new Cart(cloneTemplate(cartTemplate), events);
const modalView = new Modal(document.getElementById('modal-container'), events);
const orderView = new Form<TUserOrderInfo>(cloneTemplate(orderTemplate), events);
const contactsView = new Form<TUserContactInfo>(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);
const page = new Page(document.querySelector('.page__wrapper'), events);

// Получаем наши товары и добавляем в данные каталога
appAPI.getProducts().then(data => {
    catalogData.products = data;
    events.emit('INIT-DATA:LOADED');
})
.catch(err => {
    console.error(err);
});

events.on('INIT-DATA:LOADED', () => {
    const cardsArray = catalogData.products.map((card) => {
        const cardInst = new Card(cloneTemplate(catalogCardTemplate), events);
        return cardInst.render(card);
    })

    catalogView.render({ content: cardsArray });
});

// ОТКРЫТИЕ КОРЗИНЫ
events.on(EventsList.CART_OPEN, () => {
    modalView.open({ content: cartView.render({}) });
});

// ВЫБОР ТОВАРА
events.on(EventsList.CARD_SELECT, (data: { card: Card }) => {
    catalogData.preview = data.card.id;
});

// ОТКРЫТИЕ МОДАЛКИ (БЛОКИРОВКА ПРОКРУТА)
events.on(EventsList.MODAL_OPEN, () => {
    page.lockContainer(true);
});

// ЗАКРЫТИЕ МОДАЛКИ (РАЗБЛОКИРОВКА ПРОКРУТА)
events.on(EventsList.MODAL_CLOSE, () => {
    page.lockContainer(false);
});

// ОТКРЫТИЕ ТОВАРА
events.on(EventsList.CARD_SELECTED, (data: { id: string }) => {
    const card = new Card(cloneTemplate(modalCardTemplate), events);
    card.setAddButtonState(cartData.getProduct(data.id) === undefined);
    modalView.open({ content: card.render(catalogData.getProduct(data.id)) });
});

// ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ
events.on(EventsList.CARD_ADD, (data: { card: Card }) => {
    data.card.setAddButtonState(false);
    cartData.addProduct(catalogData.getProduct(data.card.id));
});

// УДАЛЕНИЕ ТОВАРА В КОРЗИНУ
events.on(EventsList.CARD_DELETE, (data: { card: Card }) => {
    cartData.deleteProduct(data.card.id);
});

// ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ КОРЗИНЫ
events.on(EventsList.CART_CHANGED, (data: { products: IProduct[] }) => {
    page.render({ counter: cartData.products.length ? cartData.products.length : 0 });
    cartView.render({
        content: data.products.map((item, index) => { 
            return new Card(cloneTemplate(cartCardTemplate), events).render({
                ...item,
                itemIndex: index + 1
            }); 
        }),
        total: cartData.products.length
    })
    cartView.total = cartData.getTotalPrice();
});

// НАЧАЛО ОФОРМЛЕНИЕ ЗАКАЗА
events.on(EventsList.CART_ORDER, () => {
    userData.clearUserData();
    orderView.clearForm();
    modalView.render({ content: orderView.render({isValid: false, errors: ''}) });
});

// ЗАПОЛНЕНИЕ МЕТОДА ОПЛАТЫ
events.on(EventsList.ORDER_PAYMENT_INPUT, (data: {value: string}) => {
    userData.payment = data.value;
    events.emit(EventsList.ORDER_VALIDATION);
});

// ЗАПОЛНЕНИЕ МЕТОДА ОПЛАТЫ
events.on(EventsList.ORDER_ADDRESS_INPUT, (data: {value: string}) => {
    userData.address = data.value;
    events.emit(EventsList.ORDER_VALIDATION);
});

// ВАЛИДАЦИЯ ФОРМЫ ОПЛАТЫ
events.on(EventsList.ORDER_VALIDATION, () => {
    const validationData = userData.isOrderValid({ 
        payment: userData.user.payment,
        address: userData.user.address
    });
    if(validationData.isValid) {
        orderView.render({isValid: true, errors: ''});
    }
    else orderView.render({isValid: false, errors: validationData.errors});
})

// ПЕРЕХОД КО ВТОРОМУ ЭТАПУ ОФОРМЛЕНИЯ ЗАКАЗА
events.on(EventsList.ORDER_SUBMIT, () => {
    contactsView.clearForm();
    modalView.render({ content: contactsView.render({ isValid: false, errors: ''}) })
});

// ЗАПОЛНЕНИЕ EMAIL
events.on(EventsList.CONTACTS_EMAIL_INPUT, (data: {value: string}) => {
    userData.email = data.value;
    events.emit(EventsList.CONTACTS_VALIDATION);
});

// ЗАПОЛНЕНИЕ ТЕЛЕФОНА
events.on(EventsList.CONTACTS_PHONE_INPUT, (data: {value: string}) => {
    userData.phone = data.value;
    events.emit(EventsList.CONTACTS_VALIDATION);
});

// ВАЛИДАЦИЯ ФОРМЫ КОНТАКТОВ
events.on(EventsList.CONTACTS_VALIDATION, () => {
    const validationData = userData.isContactsValid({ 
        email: userData.user.email,
        phone: userData.user.phone
    });
    if(validationData.isValid) {
        contactsView.render({isValid: true, errors: ''});
    }
    else contactsView.render({isValid: false, errors: validationData.errors});
})

// САБМИТ ЗАКАЗА
events.on(EventsList.CONTACTS_SUBMIT, () => {
    const total = cartData.getTotalPrice();
    const id: string[] = [];
    cartData.products.forEach(el => {
        if(el.price !== null) id.push(el.id)
    });

    appAPI.postOrder({
        ...userData.user,
        total: total,
        items: id
    });
    
    cartData.products = [];
    modalView.render({ content: successView.render({ total: total }) });
})

// ЗАКРЫТИЕ ПОПАПА ОБ УСПЕШНОМ ЗАКАЗЕ
events.on(EventsList.SUCCESS_CLOSE, () => {
    modalView.close();
})