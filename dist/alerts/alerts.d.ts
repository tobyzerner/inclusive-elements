declare type AlertOptions = {
    key?: string;
    duration?: number;
};
declare class AlertsElement extends HTMLElement {
    static duration: number;
    private timeouts;
    private index;
    connectedCallback(): void;
    show(el: HTMLElement, options?: AlertOptions): string;
    dismiss(elOrKey: HTMLElement | string): void;
    speak(message: string): void;
    private startTimeout;
    private clearTimeout;
}
export default AlertsElement;
