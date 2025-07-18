import { EventsList } from "../../types";
import { IEvents } from "../base/events";
import { Component } from "../common/Component";

interface IPage {
    counter: number;
};

export class Page extends Component<IPage> {
    protected events: IEvents;
    protected cartCounter: HTMLElement;
    protected cartButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this.cartCounter = document.querySelector('.header__basket-counter');
        this.cartButton = document.querySelector('.header__basket');
        this.cartButton.addEventListener('click', () => {
            this.events.emit(EventsList.CART_OPEN);
        })
    }

    lockContainer(state: boolean) {
        if(state) this.container.classList.add('page__wrapper_locked');
        else this.container.classList.remove('page__wrapper_locked');
    }

    set counter(counter: number) {
        this.cartCounter.textContent = counter.toString();
    }
}