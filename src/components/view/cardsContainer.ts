import { Component } from "../common/Component";

interface ICardsContainer {
    content: HTMLElement[];
};

export class CardsContainer extends Component<ICardsContainer> {
    protected _catalog: HTMLElement[];

    constructor(protected container: HTMLElement) {
        super(container);
    }

    set content(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}