export default class ModalElement extends HTMLElement {
    static attention: (el: Element) => void;
    static get observedAttributes(): string[];
    private focusTrap?;
    private connected;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    get open(): boolean;
    set open(val: boolean);
    close(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private wasOpened;
    private wasClosed;
    private get backdrop();
    private get content();
}
