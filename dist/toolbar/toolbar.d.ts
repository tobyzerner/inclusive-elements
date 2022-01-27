export default class ToolbarElement extends HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    private onInitialFocus;
    private onKeyDown;
    private focusControlAtIndex;
    private get controls();
}
