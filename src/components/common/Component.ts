export abstract class Component<T> {
    constructor(protected readonly containter: HTMLElement) {

    }

    render(data?: Partial<T>) {
        Object.assign(this as object, data ?? {});
        return this.containter;
    }
}