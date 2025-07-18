import { IProductsCartData, IProduct, EventsList } from "../../types";
import { IEvents } from "../base/events";

export class CartD implements IProductsCartData {
    protected _products: IProduct[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._products = [];
    }

    set products(products: IProduct[]) {
        this._products = products;
        this.events.emit(EventsList.CART_CHANGED, { products: this._products });
    }

    get products() {
        return this._products;
    }

    addProduct(product: IProduct): void {
        this._products.push(product);
        this.events.emit(EventsList.CART_CHANGED, { products: this._products });
    }

    deleteProduct(id: string): void {
        this._products = this._products.filter(product => product.id !== id);
        this.events.emit(EventsList.CART_CHANGED, { products: this._products });
    }

    getProduct(id: string): IProduct | undefined {
        const considence = this._products.filter(el => el.id === id);
        return considence[0] ? considence[0] : undefined;
    }

    getTotalPrice(): number {
        let sum: number = 0;
        this._products.forEach(product => sum += product.price);
        return sum;
    }
};