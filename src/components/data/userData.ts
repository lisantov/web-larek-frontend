import { IUserData, IUser, TUserOrderInfo, TUserContactInfo, TPaymentMethod } from "../../types";
import { IEvents } from "../base/events";

export class User implements IUserData {
    protected _user: IUser;

    constructor() {
        this._user = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
    }

    isPaymentMethod(method: string): method is TPaymentMethod {
        return method === '' || method === 'card' || method === 'cash';
    }

    set payment(method: string) {
        if(this.isPaymentMethod(method)) this._user.payment = method;
    }

    set address(address: string) {
        this._user.address = address;
    }

    setOrderInfo(data: TUserOrderInfo) {
        this._user.payment = data.payment;
        this._user.address = data.address;        
    }

    set email(email: string) {
        this._user.email = email;
    }

    set phone(phone: string) {
        this._user.phone = phone;
    }

    setContactsInfo(data: TUserContactInfo): void {
        this._user.email = data.email;
        this._user.phone = data.phone;
    }

    clearUserData() {
        this._user = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
    }

    isOrderValid(data: Record<keyof TUserOrderInfo, string>): { isValid: boolean, errors: string } {
        let isValid = true;
        let errors = '';
        if(data.payment === '') {
            isValid = false;
            errors = 'Необходимо указать метод оплаты';
        } 
        if(data.address === '') {
            isValid = false;
            errors = 'Необходимо указать адрес';            
        }
        return {isValid: isValid, errors: errors};
    }

    isContactsValid(data: Record<keyof TUserContactInfo, string>): { isValid: boolean, errors: string } {
        let isValid = true;
        let errors = '';
        if(data.email === '') {
            isValid = false;
            errors = 'Необходимо указать email';
        } 
        if(data.phone === '') {
            isValid = false;
            errors = 'Необходимо указать телефон';            
        }
        return {isValid: isValid, errors: errors};
    }

    get user() {
        return this._user;
    }
};