import { goodbye, hello } from 'hello-goodbye';
import { place } from 'placement.js';

class TooltipElement extends HTMLElement {
    public static delay: number = 100;
    public static placement: string = 'top';
    public static tooltipClass: string = 'tooltip';

    private tooltip?: HTMLElement;
    private timeout?: number;
    private observer?: MutationObserver;

    public connectedCallback(): void {
        if (this.parent) {
            this.parent.addEventListener('mouseenter', this.afterDelay.bind(this, this.show));
            this.parent.addEventListener('focus', this.show.bind(this));

            this.parent.addEventListener('mouseleave', this.afterDelay.bind(this, this.hide));
            this.parent.addEventListener('blur', this.hide.bind(this));
            this.parent.addEventListener('click', this.hide.bind(this));

            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'disabled') {
                        this.hide();
                    }
                });
            });

            this.observer.observe(this.parent, { attributes: true });
        }
    }

    public disconnectedCallback(): void {
        this.hide();
        this.observer.disconnect();
    }

    private get parent(): HTMLElement {
        return this.parentNode as HTMLElement;
    }

    private show() {
        const tooltip = this.createTooltip();

        clearTimeout(this.timeout);

        tooltip.hidden = false;
        hello(tooltip);
        tooltip.innerHTML = this.innerHTML;

        place(this.parent, tooltip, {
            placement: this.getAttribute('placement') as any || TooltipElement.placement
        });
    }

    private hide() {
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
