import { IProduct, IProductList, IApi, IUser, TOrderInfo, TOrder } from "../../types";

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

    postOrder(order: TOrder): Promise<TOrderInfo> {
        return this._baseApi.post<TOrderInfo>('/order', order, 'POST');
    }
}