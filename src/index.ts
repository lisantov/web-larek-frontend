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

// ТЕМПЛЕЙТЫ
const CatalogCardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const CartCardTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const ModalCardTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const CartTemplate: HTMLTemplateElement = document.querySelector('#basket');
const OrderTemplate: HTMLTemplateElement = document.querySelector('#order');
const ContactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const SuccessTemplate: HTMLTemplateElement = document.querySelector('#success');

const pageWrapper = document.querySelector('.page__wrapper');

const events = new EventEmitter();
const api = new Api(API_URL, settings);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const CatalogData = new Catalog(events);
const CartData = new CartD(events);
const UserData = new User();
const AppAPI = new AppApi(api);

const CatalogView = new CardsContainer(document.querySelector('.gallery'));
const CartView = new Cart(cloneTemplate(CartTemplate), events);
const ModalView = new Modal(document.getElementById('modal-container'), events);
const OrderView = new Form<TUserOrderInfo>(cloneTemplate(OrderTemplate), events);
const ContactsView = new Form<TUserContactInfo>(cloneTemplate(ContactsTemplate), events);
const SuccessView = new Success(cloneTemplate(SuccessTemplate), events);

// Получаем наши товары и добавляем в данные каталога
AppAPI.getProducts().then(data => {
    CatalogData.products = data;
    events.emit('INIT-DATA:LOADED');
})
.catch(err => {
    console.error(err);
});

events.on('INIT-DATA:LOADED', () => {
    const cardsArray = CatalogData.products.map((card) => {
        const cardInst = new Card(cloneTemplate(CatalogCardTemplate), events);
        return cardInst.render(card);
    })

    CatalogView.render({ content: cardsArray });
});

// ОТКРЫТИЕ КОРЗИНЫ
events.on(EventsList.CART_OPEN, (data: { cart: Cart }) => {
    ModalView.render({ content: data.cart.render({}) });
    ModalView.open();
});

// ВЫБОР ТОВАРА
events.on(EventsList.CARD_SELECT, (data: { card: Card }) => {
    CatalogData.preview = data.card.id;
});

// ОТКРЫТИЕ МОДАЛКИ (БЛОКИРОВКА ПРОКРУТА)
events.on(EventsList.MODAL_OPEN, () => {
    pageWrapper.classList.add('page__wrapper_locked');
});

// ОТКРЫТИЕ МОДАЛКИ (БЛОКИРОВКА ПРОКРУТА)
events.on(EventsList.MODAL_CLOSE, () => {
    pageWrapper.classList.remove('page__wrapper_locked');
});

// ОТКРЫТИЕ ТОВАРА
events.on(EventsList.CARD_SELECTED, (data: { id: string }) => {
    const card = new Card(cloneTemplate(ModalCardTemplate), events);
    card.setAddButtonState(CartData.getProduct(data.id) === undefined);
    ModalView.render({ content: card.render(CatalogData.getProduct(data.id)) });
    ModalView.open();
});

// ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ
events.on(EventsList.CARD_ADD, (data: { card: Card }) => {
    data.card.setAddButtonState(false);
    CartData.addProduct(CatalogData.getProduct(data.card.id));
});

// УДАЛЕНИЕ ТОВАРА В КОРЗИНУ
events.on(EventsList.CARD_DELETE, (data: { card: Card }) => {
    CartData.deleteProduct(data.card.id);
});

// ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ КОРЗИНЫ
events.on(EventsList.CART_CHANGED, (data: { products: IProduct[] }) => {
    CartView.render({
        content: data.products.map((item, index) => { 
            return new Card(cloneTemplate(CartCardTemplate), events).render({
                ...item,
                itemIndex: index + 1
            }); 
        }),
        total: CartData.products.length
    })
    CartView.total = CartData.getTotalPrice();
});

// НАЧАЛО ОФОРМЛЕНИЕ ЗАКАЗА
events.on(EventsList.CART_ORDER, () => {
    UserData.clearUserData();
    OrderView.clearForm();
    ModalView.render({ content: OrderView.render({isValid: false, errors: ''}) });
});

// ЗАПОЛНЕНИЕ МЕТОДА ОПЛАТЫ
events.on(EventsList.ORDER_PAYMENT_INPUT, (data: {value: string}) => {
    UserData.payment = data.value;
    events.emit(EventsList.ORDER_VALIDATION);
});

// ЗАПОЛНЕНИЕ МЕТОДА ОПЛАТЫ
events.on(EventsList.ORDER_ADDRESS_INPUT, (data: {value: string}) => {
    UserData.address = data.value;
    events.emit(EventsList.ORDER_VALIDATION);
});

// ВАЛИДАЦИЯ ФОРМЫ ОПЛАТЫ
events.on(EventsList.ORDER_VALIDATION, () => {
    const validationData = UserData.isOrderValid({ 
        payment: UserData.user.payment,
        address: UserData.user.address
    });
    if(validationData.isValid) {
        OrderView.render({isValid: true, errors: ''});
    }
    else OrderView.render({isValid: false, errors: validationData.errors});
})

// ПЕРЕХОД КО ВТОРОМУ ЭТАПУ ОФОРМЛЕНИЯ ЗАКАЗА
events.on(EventsList.ORDER_SUBMIT, () => {
    ContactsView.clearForm();
    ModalView.render({ content: ContactsView.render({ isValid: false, errors: ''}) })
});

// ЗАПОЛНЕНИЕ EMAIL
events.on(EventsList.CONTACTS_EMAIL_INPUT, (data: {value: string}) => {
    UserData.email = data.value;
    events.emit(EventsList.CONTACTS_VALIDATION);
});

// ЗАПОЛНЕНИЕ ТЕЛЕФОНА
events.on(EventsList.CONTACTS_PHONE_INPUT, (data: {value: string}) => {
    UserData.phone = data.value;
    events.emit(EventsList.CONTACTS_VALIDATION);
});

// ВАЛИДАЦИЯ ФОРМЫ КОНТАКТОВ
events.on(EventsList.CONTACTS_VALIDATION, () => {
    const validationData = UserData.isContactsValid({ 
        email: UserData.user.email,
        phone: UserData.user.phone
    });
    if(validationData.isValid) {
        ContactsView.render({isValid: true, errors: ''});
    }
    else ContactsView.render({isValid: false, errors: validationData.errors});
})

// САБМИТ ЗАКАЗА
events.on(EventsList.CONTACTS_SUBMIT, () => {
    const total = CartData.getTotalPrice();
    AppAPI.postOrder(UserData.user, total, CartData.products);
    CartData.products = [];
    ModalView.render({ content: SuccessView.render({ total: total }) });
})

// ЗАКРЫТИЕ ПОПАПА ОБ УСПЕШНОМ ЗАКАЗЕ
events.on(EventsList.SUCCESS_CLOSE, () => {
    ModalView.close();
})