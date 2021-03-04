declare class PopupElement extends HTMLElement {
    static get observedAttributes(): string[];
    private overlay?;
    constructor();
    connectedCallback(): void;
    private get button();
    private get menu();
    get open(): boolean;
    set open(val: boolean);
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
export default PopupElement;
