export default class MenuElement extends HTMLElement {
    static searchDelay: number;
    private search;
    private searchTimeout?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private get items();
    private onKeyDown;
    private navigate;
}
