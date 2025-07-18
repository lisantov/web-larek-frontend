import { EventsList } from "../../types";
import { IEvents } from "../base/events";
import { Component } from "../common/Component";

interface ISuccess {
    total: number;
};

export class Success extends Component<ISuccess> {
    protected closeButton: HTMLButtonElement;
    protected successText: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this.successText = this.container.querySelector('.order-success__description');
        this.closeButton = this.container.querySelector('.order-success__close');
        this.closeButton.addEventListener('click', () => {
            this.events.emit(EventsList.SUCCESS_CLOSE);
        })
    }

    set total(total: number) {
        this.successText.textContent = `Списано ${total} синапсов!`
    }
}