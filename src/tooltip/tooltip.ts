import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { goodbye, hello } from 'hello-goodbye';

export default class TooltipElement extends HTMLElement {
    public static delay: number = 100;
    public static placement: string = 'top';
    public static tooltipClass: string = 'tooltip';

    private parent?: HTMLElement;
    private tooltip?: HTMLElement;
    private timeout?: number;
    private disabledObserver?: MutationObserver;
    private showing: boolean = false;
    private cleanup?: () => void;
    private prevInnerHTML?: string;
    private tabPressed: boolean = false;

    private onMouseEnter = this.afterDelay.bind(this, this.show);
    private onFocus = () => {
        if (this.tabPressed) this.show();
    };
    private onMouseLeave = this.afterDelay.bind(this, this.hide);
    private onBlur = this.hide.bind(this);

    public connectedCallback(): void {
        this.parent = this.parentNode as HTMLElement;

        if (this.parent) {
            this.parent.addEventListener('mouseenter', this.onMouseEnter);
            this.parent.addEventListener('focus', this.onFocus);
            this.parent.addEventListener('mouseleave', this.onMouseLeave);
            this.parent.addEventListener('blur', this.onBlur);
            this.parent.addEventListener('click', this.onBlur);

            this.disabledObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'disabled') {
                        this.hide();
                    }
                });
            });

            this.disabledObserver.observe(this.parent, { attributes: true });
        }

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('scroll', this.onBlur);
    }

    public disconnectedCallback(): void {
        this.cleanup?.();

        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = undefined;
        }

        if (this.parent) {
            this.parent.removeEventListener('mouseenter', this.onMouseEnter);
            this.parent.removeEventListener('focus', this.onFocus);
            this.parent.removeEventListener('mouseleave', this.onMouseLeave);
            this.parent.removeEventListener('blur', this.onBlur);
            this.parent.removeEventListener('click', this.onBlur);
            this.parent = undefined;
        }

        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('scroll', this.onBlur);

        this.disabledObserver?.disconnect();
        clearTimeout(this.timeout);
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Tab') this.tabPressed = true;
        if (e.key === 'Escape') {
            this.hide();
        }
    };

    private onKeyUp = (e: KeyboardEvent): void => {
        if (e.key === 'Tab') this.tabPressed = false;
    };

    public show() {
        if (this.disabled) return;

        const tooltip = this.createTooltip();

        clearTimeout(this.timeout);

        if (!this.showing) {
            tooltip.hidden = false;
            hello(tooltip);
            this.showing = true;
        }

        if (this.innerHTML !== this.prevInnerHTML) {
            this.prevInnerHTML = tooltip.innerHTML = this.innerHTML;
        }

        tooltip.style.position = 'absolute';

        this.cleanup?.();
        this.cleanup = autoUpdate(this.parent!, tooltip, () =>
            computePosition(this.parent!, tooltip, {
                placement:
                    (this.getAttribute('placement') as any) ||
                    TooltipElement.placement,
                middleware: [shift(), flip()],
            }).then(({ x, y, placement }) => {
                Object.assign(tooltip.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
                tooltip.dataset.placement = placement;
            })
        );

        this.dispatchEvent(new Event('open'));
    }

    public hide() {
        clearTimeout(this.timeout);

        this.cleanup?.();

        if (this.showing) {
            this.showing = false;

            goodbye(this.tooltip!).then(() => {
                if (this.tooltip) this.tooltip.hidden = true;
            });

            this.dispatchEvent(new Event('close'));
        }
    }

    private afterDelay(callback: Function) {
        clearTimeout(this.timeout);
        const delay = parseInt(this.getAttribute('delay') || '');
        this.timeout = window.setTimeout(
            callback.bind(this),
            isNaN(delay) ? TooltipElement.delay : delay
        );
    }

    private createTooltip() {
        if (!this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.hidden = true;

            this.tooltip.addEventListener('mouseenter', this.show.bind(this));
            this.tooltip.addEventListener(
                'mouseleave',
                this.afterDelay.bind(this, this.hide)
            );

            document.body.appendChild(this.tooltip);
        }

        this.tooltip.className =
            this.getAttribute('tooltip-class') || TooltipElement.tooltipClass;

        return this.tooltip;
    }
}
