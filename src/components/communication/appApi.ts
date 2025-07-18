import { IProduct, IProductList, IApi, IUser, TOrderInfo } from "../../types";

export class AppApi {
    private _baseApi: IApi

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    getProducts(): Promise<IProduct[]> {
        return this._baseApi.get<IProductList>('/product/').then(data => data.items);
    }

    getProduct(id: string): Promise<IProduct> {
        return this._baseApi.get<IProduct>(`/product/${id}`).then(data => data);
    }

    postOrder(userData: IUser, total: number, items: IProduct[]): Promise<TOrderInfo> {
        let id: string[] = [];
        items.forEach(el => {
            if(el.price !== null) id.push(el.id)
        });
        return this._baseApi.post<TOrderInfo>('/order', {
            ...userData,
            total: total,
            items: id
        }, 'POST');
    }
}