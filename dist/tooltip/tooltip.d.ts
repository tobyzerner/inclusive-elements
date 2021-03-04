declare class TooltipElement extends HTMLElement {
    static delay: number;
    static placement: string;
    static tooltipClass: string;
    private tooltip?;
    private timeout?;
    connectedCallback(): void;
    private get parent();
    private show;
    private hide;
    private afterDelay;
    private createTooltip;
}
export default TooltipElement;
