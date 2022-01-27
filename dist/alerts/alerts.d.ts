export declare type AlertOptions = {
    key?: string;
    duration?: number;
};
export default class AlertsElement extends HTMLElement {
    static duration: number;
    private timeouts;
    private index;
    connectedCallback(): void;
    show(el: HTMLElement, options?: AlertOptions): string;
    dismiss(el: HTMLElement): void;
    dismiss(key: string): void;
    clear(): void;
    speak(message: string): void;
    private startTimeout;
    private clearTimeout;
}
