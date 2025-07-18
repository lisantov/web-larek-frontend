import { EventsList } from "../../types";
import { createElement } from "../../utils/utils";
import { Component } from "../common/Component";
import { IEvents } from "../base/events";

interface ICart {
    content: HTMLElement[];
    total: number;
};

export class Cart extends Component<ICart> {
    protected events: IEvents;
    protected submitButton: HTMLButtonElement;
    protected itemsContainer: HTMLUListElement;
    protected totalPrice: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;

        this.itemsContainer = this.container.querySelector('.basket__list');
        this.totalPrice = this.container.querySelector('.basket__price');
        this.submitButton = this.container.querySelector('.basket__button');

        this.submitButton.addEventListener('click', () => {
            this.events.emit(EventsList.CART_ORDER, { cart: this });
        })

        this.setSumbitButtonState(false);
        this.itemsContainer.replaceChildren(
            createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста'})
        );
    }

    setSumbitButtonState(isEnabled: boolean) {
        this.submitButton.disabled = !isEnabled;
    }

    set total(price: number) {
        this.totalPrice.textContent = price.toString() + ' синапсов';
        this.setSumbitButtonState(price > 0);
    }

    set content(items: HTMLElement[]) {
        if(items.length) {
            this.itemsContainer.replaceChildren(...items);
        }
        else {
            this.itemsContainer.replaceChildren(
                createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста'})
            );
        }
    }
}