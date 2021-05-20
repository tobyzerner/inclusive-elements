import { goodbye, hello } from 'hello-goodbye';
import placement from 'placement.js';

class TooltipElement extends HTMLElement {
    public static delay: number = 100;
    public static placement: string = 'top';
    public static tooltipClass: string = 'tooltip';

    private tooltip?: HTMLElement;
    private timeout?: number;
    private observer?: MutationObserver;

    private handleMouseEnter = this.afterDelay.bind(this, this.show);
    private handleFocus = this.show.bind(this);
    private handleMouseLeave = this.afterDelay.bind(this, this.hide);
    private handleBlur = this.hide.bind(this);
    private handleTouch = this.touched.bind(this);

    private wasTouched = false;

    public connectedCallback(): void {
        if (this.parent) {
            this.parent.tabIndex = this.parent.tabIndex || 0;
            this.parent.addEventListener('touchstart', this.handleTouch);
            this.parent.addEventListener('mouseenter', this.handleMouseEnter);
            this.parent.addEventListener('focus', this.handleFocus);

            this.parent.addEventListener('mouseleave', this.handleMouseLeave);
            this.parent.addEventListener('blur', this.handleBlur);
            this.parent.addEventListener('click', this.handleBlur);

            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'disabled') {
                        this.hide();
                    }
                });
            });

            this.observer.observe(this.parent, { attributes: true });
        }

        document.addEventListener('touchstart', this.handleBlur);
    }

    public disconnectedCallback(): void {
        this.hide();
        this.observer.disconnect();

        this.parent.removeEventListener('touchstart', this.handleTouch);
        this.parent.removeEventListener('mouseenter', this.handleMouseEnter);
        this.parent.removeEventListener('focus', this.handleFocus);

        this.parent.removeEventListener('mouseleave', this.handleMouseLeave);
        this.parent.removeEventListener('blur', this.handleBlur);
        this.parent.removeEventListener('click', this.handleBlur);

        document.removeEventListener('touchstart', this.handleBlur);
    }

    private get parent(): HTMLElement {
        return this.parentNode as HTMLElement;
    }

    private touched(e) {
        e.stopPropagation()

        this.show();
        this.wasTouched = true;
    }

    private show() {
        const tooltip = this.createTooltip();

        clearTimeout(this.timeout);

        tooltip.hidden = false;
        hello(tooltip);
        tooltip.innerHTML = this.innerHTML;

        placement(this.parent, tooltip, {
            placement: this.getAttribute('placement') as any || TooltipElement.placement,
        });
    }

    private hide() {
        if (this.wasTouched) {
            this.wasTouched = false;
            return;
        }
        clearTimeout(this.timeout);
        if (this.tooltip) {
            goodbye(this.tooltip, {
                finish: () => {
                    this.tooltip && (this.tooltip.hidden = true);
                }
            });
        }
    }

    private afterDelay(callback: Function) {
        clearTimeout(this.timeout);
        const delay = parseInt(this.getAttribute('delay') || '');
        this.timeout = window.setTimeout(callback.bind(this), isNaN(delay) ? TooltipElement.delay : delay);
    }

    private createTooltip() {
        if (! this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.className = this.getAttribute('tooltip-class') || TooltipElement.tooltipClass;
            this.tooltip.hidden = true;
            document.body.appendChild(this.tooltip);
        }

        return this.tooltip;
    }
}

export default TooltipElement;
