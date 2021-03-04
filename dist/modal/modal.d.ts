declare class ModalElement extends HTMLElement {
    static attention: (el: Element) => void;
    static get observedAttributes(): string[];
    private trigger?;
    private inertCache;
    constructor();
    connectedCallback(): void;
    get open(): boolean;
    set open(val: boolean);
    close(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
export default ModalElement;
