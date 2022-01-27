export default class TooltipElement extends HTMLElement {
    static delay: number;
    static placement: string;
    static tooltipClass: string;
    private parent?;
    private tooltip?;
    private timeout?;
    private observer?;
    private showing;
    private onMouseEnter;
    private onFocus;
    private onMouseLeave;
    private onBlur;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get disabled(): boolean;
    set disabled(val: boolean);
    private onKeyDown;
    private show;
    private hide;
    private afterDelay;
    private createTooltip;
}
