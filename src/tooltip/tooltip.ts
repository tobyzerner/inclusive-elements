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

    private onMouseEnter = this.afterDelay.bind(this, this.show);
    private onFocus = this.show.bind(this);
    private onMouseLeave = this.afterDelay.bind(this, this.hide);
    private onBlur = this.hide.bind(this);
    private onPointerUp = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') this.hide();
        else this.show();
    };

    public connectedCallback(): void {
        this.parent = this.parentNode as HTMLElement;

        if (this.parent) {
            this.parent.addEventListener('mouseenter', this.onMouseEnter);
            this.parent.addEventListener('focus', this.onFocus);
            this.parent.addEventListener('mouseleave', this.onMouseLeave);
            this.parent.addEventListener('blur', this.onBlur);
            this.parent.addEventListener('pointerup', this.onPointerUp);

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
        document.addEventListener('scroll', this.onBlur);
    }

    public disconnectedCallback(): void {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = undefined;
        }

        if (this.parent) {
            this.parent.removeEventListener('mouseenter', this.onMouseEnter);
            this.parent.removeEventListener('focus', this.onFocus);
            this.parent.removeEventListener('mouseleave', this.onMouseLeave);
            this.parent.removeEventListener('blur', this.onBlur);
            this.parent.removeEventListener('pointerup', this.onPointerUp);
            this.parent = undefined;
        }

        document.removeEventListener('keydown', this.onKeyDown);
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
        if (e.key === 'Escape') {
            this.hide();
        }
    };

    private show() {
        if (this.disabled) return;

        const tooltip = this.createTooltip();

        clearTimeout(this.timeout);

        if (!this.showing) {
            tooltip.hidden = false;
            hello(tooltip);
            this.showing = true;
        }

        if (tooltip.innerHTML !== this.innerHTML) {
            tooltip.innerHTML = this.innerHTML;
        }

        tooltip.style.position = 'absolute';

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
    }

    private hide() {
        clearTimeout(this.timeout);

        this.cleanup?.();

        if (this.showing) {
            this.showing = false;

            goodbye(this.tooltip!).then(() => {
                if (this.tooltip) this.tooltip.hidden = true;
            });
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
            this.tooltip.className =
                this.getAttribute('tooltip-class') ||
                TooltipElement.tooltipClass;
            this.tooltip.hidden = true;

            this.tooltip.addEventListener('mouseenter', this.show.bind(this));
            this.tooltip.addEventListener(
                'mouseleave',
                this.afterDelay.bind(this, this.hide)
            );

            document.body.appendChild(this.tooltip);
        }

        return this.tooltip;
    }
}
