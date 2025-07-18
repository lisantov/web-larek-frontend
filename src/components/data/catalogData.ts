import { IProductsData, IProduct, EventsList } from "../../types";
import { IEvents } from "../base/events";

export class Catalog implements IProductsData {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
    }

    set products(products: IProduct[]) {
        this._products = products;
        this.events.emit(EventsList.CATALOG_CHANGED, { products: this._products });
    }

    get products() {
        return this._products;
    }

    getProduct(id: string): IProduct | undefined {
        const considence = this._products.filter(el => el.id === id);
        return considence[0] ? considence[0] : undefined;
    }

    set preview(id: string) {
        if(!id) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(id);
        if(selectedProduct) {
            this._preview = id;
            this.events.emit(EventsList.CARD_SELECTED, { id: this._preview });
        }
    }

    get preview() {
        return this._preview;
    }
};