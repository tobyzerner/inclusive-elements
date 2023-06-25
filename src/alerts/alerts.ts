import { hello, goodbye, move } from 'hello-goodbye';

export type AlertOptions = {
    key?: string;
    duration?: number;
    animate?: boolean;
};

export default class AlertsElement extends HTMLElement {
    public static duration: number = 10000;

    private timeouts: WeakMap<HTMLElement, number> = new Map();
    private index: number = 0;

    constructor() {
        super();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) this.show(node);
                });
            });
        });

        observer.observe(this, { childList: true });
    }

    public connectedCallback(): void {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'status');
        }

        if (!this.hasAttribute('aria-live')) {
            this.setAttribute('aria-live', 'polite');
        }

        if (!this.hasAttribute('aria-relevant')) {
            this.setAttribute('aria-relevant', 'additions');
        }

        for (const child of this.children) {
            this.show(child as HTMLElement, { animate: false });
        }
    }

    public show(el: HTMLElement, options: AlertOptions = {}) {
        const key = options.key || el.dataset.key || String(this.index++);

        this.dismiss(key);

        el.dataset.key = key;

        if (!this.contains(el)) {
            if (options.animate === false) {
                this.append(el);
            } else {
                move(this.children, () => {
                    this.append(el);
                    hello(el);
                });
            }
        } else {
            hello(el);
        }

        const duration = Number(
            options.duration !== undefined
                ? options.duration
                : el.dataset.duration || AlertsElement.duration
        );

        if (duration > 0) {
            this.startTimeout(el, duration);

            el.addEventListener('mouseenter', this.clearTimeout.bind(this, el));
            el.addEventListener('focusin', this.clearTimeout.bind(this, el));

            el.addEventListener(
                'mouseleave',
                this.startTimeout.bind(this, el, duration)
            );
            el.addEventListener(
                'focusout',
                this.startTimeout.bind(this, el, duration)
            );
        }

        return key;
    }

    public dismiss(el: HTMLElement): void;
    public dismiss(key: string): void;
    public dismiss(elOrKey: HTMLElement | string): void {
        if (typeof elOrKey === 'string') {
            this.querySelectorAll<HTMLElement>(
                `[data-key="${elOrKey}"]`
            ).forEach((el) => {
                this.dismiss(el);
            });
            return;
        }

        move(this.children, () => {
            goodbye(elOrKey).then(() => this.removeChild(elOrKey));
        });

        this.clearTimeout(elOrKey);
    }

    public clear(): void {
        Array.from(this.children).forEach((child) => {
            this.dismiss(child as HTMLElement);
        });
    }

    public speak(message: string): void {
        const el = document.createElement('div');
        Object.assign(el.style, {
            clip: 'rect(0 0 0 0)',
            clipPath: 'inset(50%)',
            height: '1px',
            overflow: 'hidden',
            position: 'absolute',
            whiteSpace: 'nowrap',
            width: '1px',
        });
        el.textContent = message;
        this.show(el);
    }

    private startTimeout(el: HTMLElement, duration: number) {
        this.clearTimeout(el);
        this.timeouts.set(
            el,
            window.setTimeout(() => {
                this.dismiss(el);
            }, duration)
        );
    }

    private clearTimeout(el: HTMLElement) {
        if (this.timeouts.has(el)) {
            clearTimeout(this.timeouts.get(el));
        }
    }
}
