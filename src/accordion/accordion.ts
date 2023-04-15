import DisclosureElement from '../disclosure/disclosure';

export default class AccordionElement extends HTMLElement {
    public connectedCallback(): void {
        this.addEventListener('toggle', this.onToggle, { capture: true });
    }

    public disconnectedCallback(): void {
        this.removeEventListener('toggle', this.onToggle, { capture: true });
    }

    private onToggle = (e: Event) => {
        const target = e.target as DisclosureElement | HTMLDetailsElement;
        if (!target.open) return;
        this.querySelectorAll<DisclosureElement | HTMLDetailsElement>(
            ':scope > :is(ui-disclosure, details)'
        ).forEach((el) => {
            el.toggleAttribute('open', el === target);
            if (this.required) {
                el.toggleAttribute('disabled', el === target);
            }
        });
    };

    get required() {
        return this.hasAttribute('required');
    }
}
