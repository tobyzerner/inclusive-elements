export default class MenuElement extends HTMLElement {
    static searchDelay: number;
    private search;
    private searchTimeout?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get items(): HTMLElement[];
    private onKeyDown;
    private navigate;
}
