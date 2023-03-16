import DisclosureElement from '../disclosure/disclosure';

export default class AccordionElement extends HTMLElement {
    public connectedCallback(): void {
        this.addEventListener('open', this.onOpen, { capture: true });
    }

    public disconnectedCallback(): void {
        this.removeEventListener('open', this.onOpen, { capture: true });
    }

    private onOpen = (e: Event) => {
        this.querySelectorAll<DisclosureElement>(
            ':scope > ui-disclosure'
        ).forEach((el) => {
            el.open = el === e.target;
            if (this.required) {
                el.toggleAttribute('disabled', el === e.target);
            }
        });
    };

    get required() {
        return this.hasAttribute('required');
    }
}
