export default class PopupElement extends HTMLElement {
    cleanup?: () => void;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    get open(): boolean;
    set open(val: boolean);
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private wasOpened;
    private wasClosed;
    private get backdrop();
    private get button();
    private get content();
}
