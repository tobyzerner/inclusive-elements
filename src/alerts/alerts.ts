import { leave, enter, move, cancel } from 'transition-kit';

export type AlertPoliteness = 'polite' | 'assertive';

export type AlertOptions = {
    key?: string;
    duration?: number;
    politeness?: AlertPoliteness;
};

export default class AlertsElement extends HTMLElement {
    public static duration: number = 10000;
    public static politeness: AlertPoliteness = 'polite';

    private timeouts: WeakMap<HTMLElement, number> = new WeakMap();
    private index: number = 0;

    public connectedCallback(): void {
        this.addEventListener('focusin', this.pauseOnInteraction);
        this.addEventListener('focusout', this.resumeOnInteraction);
        this.addEventListener('mouseover', this.pauseOnInteraction);
        this.addEventListener('mouseout', this.resumeOnInteraction);

        for (const alert of this.getAlerts()) {
            alert.remove();
            this.show(alert);
        }
    }

    public disconnectedCallback(): void {
        this.removeEventListener('focusin', this.pauseOnInteraction);
        this.removeEventListener('focusout', this.resumeOnInteraction);
        this.removeEventListener('mouseover', this.pauseOnInteraction);
        this.removeEventListener('mouseout', this.resumeOnInteraction);

        this.getAlerts().forEach((alert) => this.clearTimeout(alert));
    }

    public show(el: HTMLElement, options: AlertOptions = {}) {
        const key = options.key || el.dataset.key || String(this.index++);

        el.dataset.key = key;
        this.syncAlertPoliteness(el, options.politeness);

        if (options.duration !== undefined) {
            el.dataset.duration = String(options.duration);
        }

        const alerts = this.getAlerts().filter((alert) => alert !== el);

        void move(alerts, () => {
            alerts
                .filter((alert) => alert.dataset.key === key)
                .forEach((alert) => this.leaveAlert(alert));

            cancel(el);
            this.append(el);
            void enter(el);
        });

        this.startTimeout(el);

        return key;
    }

    public dismiss(el: HTMLElement): void;
    public dismiss(key: string): void;
    public dismiss(elOrKey: HTMLElement | string): void {
        (typeof elOrKey === 'string'
            ? this.getAlerts().filter((alert) => alert.dataset.key === elOrKey)
            : [elOrKey]
        ).forEach((alert) => this.dismissAlert(alert));
    }

    public clear(): void {
        this.getAlerts().forEach((alert) => this.dismissAlert(alert));
    }

    public speak(message: string, options: AlertOptions = {}): void {
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
        this.show(el, options);
    }

    private dismissAlert(el: HTMLElement) {
        void move(
            this.getAlerts().filter((alert) => alert !== el),
            () => this.leaveAlert(el)
        );
    }

    private leaveAlert(el: HTMLElement) {
        this.clearTimeout(el);
        void leave(el).then((complete: boolean) => {
            if (complete && el.parentElement === this) {
                el.remove();
            }
        });
    }

    private startTimeout(el: HTMLElement) {
        this.clearTimeout(el);

        const duration = Number(el.dataset.duration || AlertsElement.duration);

        if (duration > 0) {
            this.timeouts.set(
                el,
                window.setTimeout(() => this.dismiss(el), duration)
            );
        }
    }

    private clearTimeout(el: HTMLElement) {
        const timeout = this.timeouts.get(el);
        if (timeout !== undefined) {
            clearTimeout(timeout);
            this.timeouts.delete(el);
        }
    }

    private pauseOnInteraction = (event: FocusEvent | MouseEvent): void => {
        this.handleInteraction(event, (alert) => this.clearTimeout(alert));
    };

    private resumeOnInteraction = (event: FocusEvent | MouseEvent): void => {
        this.handleInteraction(event, (alert) => this.startTimeout(alert));
    };

    private handleInteraction(
        event: FocusEvent | MouseEvent,
        action: (alert: HTMLElement) => void
    ): void {
        const alert = this.getAlertFromTarget(event.target);
        if (!alert) return;

        if (
            event.relatedTarget instanceof Node &&
            alert.contains(event.relatedTarget)
        )
            return;

        action(alert);
    }

    private getAlerts(): HTMLElement[] {
        return Array.from(this.children, (child) => child as HTMLElement);
    }

    private syncAlertPoliteness(
        el: HTMLElement,
        politeness: AlertPoliteness | undefined
    ): void {
        const resolvedPoliteness =
            politeness ||
            this.getAuthoredPoliteness(el) ||
            AlertsElement.politeness;

        if (resolvedPoliteness === 'assertive') {
            el.setAttribute('role', 'alert');
            el.setAttribute('aria-live', 'assertive');
            return;
        }

        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', 'polite');
    }

    private getAuthoredPoliteness(
        el: HTMLElement
    ): AlertPoliteness | undefined {
        if (
            el.getAttribute('role') === 'alert' ||
            el.getAttribute('aria-live') === 'assertive'
        ) {
            return 'assertive';
        }

        if (
            el.getAttribute('role') === 'status' ||
            el.getAttribute('aria-live') === 'polite'
        ) {
            return 'polite';
        }

        return undefined;
    }

    private getAlertFromTarget(target: EventTarget | null): HTMLElement | null {
        if (!(target instanceof Node)) return null;

        return (
            Array.from(this.children).find(
                (child): child is HTMLElement =>
                    child instanceof HTMLElement && child.contains(target)
            ) || null
        );
    }
}
