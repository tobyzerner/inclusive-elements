declare class MenuElement extends HTMLElement {
    static searchDelay: number;
    private search;
    private searchTimeout?;
    connectedCallback(): void;
    private navigate;
    get focusableItems(): HTMLElement[];
}
export default MenuElement;
