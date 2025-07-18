// ИНТЕРФЕЙС ТОВАРА
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
    price: number;
};

// ТИП ДЛЯ ОБНОВЛЕНИЯ ДАННЫХ КАРТОЧКИ ТОВАРА
export type TProductCard = IProduct & {
    itemIndex?: number;
};

// ИНТЕРФЕЙС СПИСКА ТОВАРОВ (Ответ сервера)
export interface IProductList {
    total: number;
    items: IProduct[];
};

// ТИП ДЛЯ МЕТОДА ОПЛАТЫ
export type TPaymentMethod = 'card' | 'cash' | '';

// ИНТЕРФЕЙС ДАННЫХ ПОЛЬЗОВАТЕЛЯ
export interface IUser {
    payment: TPaymentMethod;
    address: string;
    email: string;
    phone: string;
};

// ИНТЕРФЕЙС УПРАВЛЕНИЯ КАТАЛОГОМ
export interface IProductsData {
    products: IProduct[];
    preview: string | null;
    getProduct(id: string): IProduct | undefined;
};

// ИНТЕРФЕЙС УПРАВЛЕНИЯ ДАННЫМИ ПОЛЬЗОВАТЕЛЯ
export interface IUserData {
    setOrderInfo(data: TUserOrderInfo): void;
    setContactsInfo(data: TUserContactInfo): void;
    isOrderValid(data: Record<keyof TUserOrderInfo, string>): { isValid: boolean, errors: string };
    isContactsValid(data: Record<keyof TUserContactInfo, string>): { isValid: boolean, errors: string };
}

// ИНТЕРФЕЙС УПРАВЛЕНИЯ КОРЗИНОЙ
export interface IProductsCartData {
    products: IProduct[];
    addProduct(product: IProduct): void;
    deleteProduct(id: string): void;
    getProduct(id: string): IProduct | undefined;
    getTotalPrice(): number;
}

// КАРТОЧКА ТОВАРА В КАТАЛОГЕ
export type TProductCardInfo = Pick<IProduct,  'image' | 'title' | 'category' | 'price'>;

// ТОВАР В ПОПАПЕ
export type TProductModalInfo = Pick<IProduct, 'description' | 'image' | 'title' | 'category' | 'price'>;

// КАРТОЧКА ТОВАРА В КОРЗИНЕ
export type TProductCartInfo = Pick<IProduct, 'title' | 'price'>;

// ДАННЫЕ ПОЛЬЗОВАТЕЛЯ В ПЕРВОМ ШАГЕ ОФОРМЛЕНИЯ ЗАКАЗА
export type TUserOrderInfo = Pick<IUser, 'payment' | 'address'>;

// ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ВО ВТОРОМ ШАГЕ ОФОРМЛЕНИЯ ЗАКАЗА
export type TUserContactInfo = Pick<IUser, 'email' | 'phone'>;

// ОТВЕТ СЕРВЕРА ПРИ РАЗМЕЩЕНИИ ЗАКАЗА 
export type TOrderInfo = { id?: string, total?: number, error?: string};


export type ApiPostMethods = 'POST';

export interface IApi {
    baseUrl: string;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}


export enum EventsList {
    // ДАННЫЕ
    CATALOG_CHANGED = 'CATALOG:CHANGED', // Изменение массива товаров в каталоге
    CART_CHANGED = 'CART:CHANGED', // Изменение массива товаров в корзине
    CARD_SELECTED = 'CARD:SELECTED', // Изменение товара для попапа

    // ПРЕДСТАВЛЕНИЕ
    MODAL_OPEN = 'MODAL:OPEN', // Открытие модального окна
    MODAL_CLOSE = 'MODAL:CLOSE', // Закрытие модального окна
    CARD_SELECT = 'CARD:SELECT', // Выбор карточки в каталоге
    CARD_ADD = 'CARD:ADD', // Добавление товара в корзину
    CARD_DELETE = 'CARD:DELETE', // Удаление товара из корзины
    CART_OPEN = 'CART:OPEN', // Открытие попапа корзины
    CART_ORDER = 'CART:ORDER', // Оформление заказа в корзине
    CARD_INPUT = 'CARD:INPUT', // Изменение метода оплаты
    ORDER_PAYMENT_INPUT = 'ORDER-PAYMENT:INPUT', // Изменение метода оплаты
    ORDER_ADDRESS_INPUT = 'ORDER-ADDRESS:INPUT', // Изменение метода оплаты
    ORDER_VALIDATION = 'ORDER:VALIDATION', // Событие, для валидации формы заказа
    ORDER_SUBMIT = 'ORDER:SUBMIT', // Переход к следующему шагу оформления заказа
    CONTACTS_EMAIL_INPUT = 'CONTACTS-EMAIL:INPUT', // Изменение email
    CONTACTS_PHONE_INPUT = 'CONTACTS-PHONE:INPUT', // Изменение номера телефона
    CONTACTS_VALIDATION = 'CONTACTS:VALIDATION', // Событие, для валидации формы контактов
    CONTACTS_SUBMIT = 'CONTACTS:SUBMIT', // Отправка заказа
    SUCCESS_CLOSE = 'SUCCESS:CLOSE' // Закрытие попапа успешного заказа
}