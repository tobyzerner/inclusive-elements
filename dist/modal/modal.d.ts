export default class ModalElement extends HTMLElement {
    static attention: (el: Element) => void;
    static get observedAttributes(): string[];
    private trigger?;
    private focusTrap?;
    constructor();
    connectedCallback(): void;
    get open(): boolean;
    set open(val: boolean);
    close(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private wasOpened;
    private wasClosed;
    private focusContent;
    private get backdrop();
    private get content();
}
