import { EventsList } from "../../types";
import { IEvents } from "../base/events";
import { Component } from "./Component";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected events: IEvents;
    protected contentContainer: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this.contentContainer = this.container.querySelector('.modal__content');

        const closeButton = this.container.querySelector('.modal__close');
        closeButton.addEventListener('click', this.close.bind(this));

        this.container.addEventListener('click', (evt) => {
            if(evt.target === evt.currentTarget) {
                this.close();
            }
        })

        this.handleEsc = this.handleEsc.bind(this);
    }

    set content(content: HTMLElement) {
        this.contentContainer.replaceChildren(content);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEsc);
        this.events.emit(EventsList.MODAL_OPEN, this);
    }

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.handleEsc);
        this.events.emit(EventsList.MODAL_CLOSE, this);
    }

    handleEsc(evt: KeyboardEvent) {
        if(evt.key === 'Escape') {
            this.close();
        }
    }
}