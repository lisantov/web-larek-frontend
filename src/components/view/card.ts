import { IEvents } from "../base/events";
import { IProduct, EventsList, TProductCard } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { Component } from "../common/Component";

export class Card extends Component<TProductCard> {
    protected events: IEvents;
    protected cardId: string;

    protected cardCategory?: HTMLElement;
    protected cardTitle?: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected cardPrice?: HTMLElement;
    protected cardText?: HTMLElement;
    protected cardItemIndex?: HTMLElement;
    protected cardButton?: HTMLButtonElement;
    protected cardDeleteButton?: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.cardCategory = this.container.querySelector('.card__category');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardImage = this.container.querySelector('.card__image');
        this.cardPrice = this.container.querySelector('.card__price');
        this.cardText = this.container.querySelector('.card__text');
        this.cardItemIndex = this.container.querySelector('.basket__item-index');
        this.cardButton = this.container.querySelector('.button');
        this.cardDeleteButton = this.container.querySelector('.basket__item-delete');
        
        if(this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () => {
                this.events.emit(EventsList.CARD_SELECT, { card: this });
            });
        }
        else if(this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.events.emit(EventsList.CARD_ADD, { card: this });
            });
        }
        else if(this.cardDeleteButton) {
            this.cardDeleteButton.addEventListener('click', () => {
                this.events.emit(EventsList.CARD_DELETE, { card: this });
            });
        }
    }

    set category(category: string) {
        if(this.cardCategory) {
            this.cardCategory.textContent = category
            switch (category) {
                case 'софт-скил':
                    this.cardCategory.classList.add('card__category_soft');
                    break;
                case 'хард-скил':
                    this.cardCategory.classList.add('card__category_hard');
                    break;
                case 'дополнительное':
                    this.cardCategory.classList.add('card__category_additional');
                    break;
                case 'другое':
                    this.cardCategory.classList.add('card__category_other');
                    break;
                case 'кнопка':
                    this.cardCategory.classList.add('card__category_button');
                    break;
            }
        }
    }

    set title(title: string) {
        if(this.cardTitle) this.cardTitle.textContent = title;
    }

    set image(image: string) {
        if(this.cardImage) this.cardImage.src = `${CDN_URL}${image}`;
    }

    set price(price: number) {
        if(this.cardPrice) this.cardPrice.textContent = price !== null ? price.toString() + ' синапсов' : 'Бесценно';
    }

    set description(description: string) {
        if(this.cardText) this.cardText.textContent = description;
    }

    set itemIndex(index: number) {
        if(this.cardItemIndex) this.cardItemIndex.textContent = index.toString();
    }

    set id(id: string) {
        this.cardId = id;
    }

    get id() {
        return this.cardId;
    }

    setAddButtonState(state: boolean) {
        this.cardButton.disabled = !state;
        if(!state) this.cardButton.textContent = 'Уже в корзине';
        else this.cardButton.textContent = 'В корзину';
    }

    deleteCard(): void {
        this.container.remove();
        this.container = null;
    }
}