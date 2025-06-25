type Product = {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number
};

type ProductList = {
    total: number,
    items: Product[]
};

type OrderForm = {
    paymentMethod: "Онлайн" | "При получении",
    address: string,
    email: string,
    phone: string
};

interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
};

interface IView {
    render(data?: object): HTMLElement
};

interface IViewConstructor {
    new(container: HTMLElement, events?: IEventEmitter): IView;
};

interface ICartModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

interface IProduct {
    id: string;
    title: string;
};

interface ICatalogModel {
    items: IProduct[];
    setItems(items: IProduct[]): void;
    getItems(): IProduct[];
    getProduct(id: string): IProduct;
};

enum Events {
    PRODUCT_OPEN = 'product:changed', // Клик по карточке в каталоге
    CART_ADD = 'cart:addItem', // Добавление товара в коризну
    CART_REMOVE = 'cart:removeItem', // Удаление товара из корзины
    CART_CHANGE = 'cart:changed', // Изменение состава корзины
    CART_CLEAR = 'cart:clear', // Очистка корзины
    MODAL_OPEN = 'modal:open', // Открытие модального окна
    MODAL_CLOSE = 'modal:close', // Закрытие модального окна
    FORM_INIT = 'form:init', // Старт формы оформления заказа
    FORM_NEXT = 'form:next', // Переход на следующий этап оформления заказа
    FORM_SUBMIT = 'form:submit', // Отправка заказа
}