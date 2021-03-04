import { hello, goodbye, move } from 'hello-goodbye';

type AlertOptions = {
    key?: string,
    duration?: number,
}

class AlertsElement extends HTMLElement {
    public static duration: number = 5000;

    private timeouts: WeakMap<HTMLElement, number> = new Map();

    private index: number = 0;

    public connectedCallback(): void {
        this.setAttribute('role', 'status');
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-relevant', 'additions');
    }

    public show(el: HTMLElement, options: AlertOptions = {}) {
        const key = options.key || String(this.index++);

        this.dismiss(key);

        el.dataset.key = key;

        move(this.children, () => {
            this.append(el);
            hello(el);
        });

        const duration = typeof options.duration !== 'undefined' ? Number(options.duration) : AlertsElement.duration;

        if (duration > 0) {
            this.startTimeout(el, duration);

            el.addEventListener('mouseenter', this.clearTimeout.bind(this, el));
            el.addEventListener('focusin', this.clearTimeout.bind(this, el));

            el.addEventListener('mouseleave', this.startTimeout.bind(this, el, duration));
            el.addEventListener('focusout', this.startTimeout.bind(this, el, duration));
        }

        return key;
    }

    public dismiss(elOrKey: HTMLElement | string): void {
        if (typeof elOrKey === 'string') {
            const existing = this.querySelector<HTMLElement>(`[data-key="${elOrKey}"]`);
            existing && this.dismiss(existing);
            return;
        }

        move(this.children, () => {
            goodbye(elOrKey, {
                finish: () => this.removeChild(elOrKey)
            });
        });

        this.clearTimeout(elOrKey);
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
            width: '1px'
        });
        el.textContent = message;
        this.show(el);
    }

    private startTimeout(el: HTMLElement, duration: number) {
        this.clearTimeout(el);
        this.timeouts.set(el, window.setTimeout(() => {
            this.dismiss(el);
        }, duration));
    }

    private clearTimeout(el: HTMLElement) {
        if (this.timeouts.has(el)) {
            clearTimeout(this.timeouts.get(el));
        }
    }
}

export default AlertsElement;
