import { Component } from "./Component";
import { IEvents } from "../base/events";

interface IForm {
    isValid: boolean;
    errors: string;
}

export class Form<T> extends Component<IForm> {
    protected events: IEvents;
    protected optionButtons: NodeListOf<HTMLButtonElement>
    protected submitButton: HTMLButtonElement;
    protected errorText: HTMLElement;

    constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container);

        this.events = events;

        this.submitButton = this.container.querySelector('button[type=submit]');
        this.errorText = this.container.querySelector('.form__errors');
        this.optionButtons = this.container.querySelectorAll<HTMLButtonElement>('.button_alt');

        this.container.addEventListener('click', (evt: Event) => {
            if(evt.target instanceof HTMLButtonElement 
            && this.isButtonIsOption(evt.target)) {
                this.optionButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                evt.target.classList.add('button_alt-active');
                const field = 'payment' as keyof T;
                const value = evt.target.name;
                this.onInputChange(field, value.toString());
            }
        });

        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target .value;
            this.onInputChange(field, value);
        })

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name.toUpperCase()}:SUBMIT`);
        })
    }

    clearForm() {
        this.container.reset();
        if(this.optionButtons) this.optionButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    }

    protected isButtonIsOption(button: HTMLButtonElement) {
        let isOption = false;
        this.optionButtons.forEach(el => {
            if(el == button) isOption = true;
        })
        return isOption;
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(
            `${this.container.name.toUpperCase()}-${field.toString().toUpperCase()}:INPUT`,
            {
                field: field, 
                value: value
            }
        );
    }

    set isValid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }

    set errors(errors: string[]) {
        this.errorText.textContent = errors.toString();
    }

    render(data: Partial<T> & IForm) {
        const { isValid, errors, ...inputs} = data;
        super.render({isValid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}