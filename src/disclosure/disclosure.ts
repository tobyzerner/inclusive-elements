import { cancel, goodbye, hello } from 'hello-goodbye';
import { shouldOpenInNewTab } from '../utils';

export default class DisclosureElement extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    public connectedCallback(): void {
        this.content.hidden = !this.open;

        this.button.setAttribute('aria-expanded', String(this.open));

        this.button.addEventListener('click', this.onButtonClick);
    }

    public disconnectedCallback(): void {
        cancel(this.content);

        this.button.removeAttribute('aria-expanded');
        this.button.removeEventListener('click', this.onButtonClick);
    }

    private onButtonClick = (e: MouseEvent) => {
        if (!shouldOpenInNewTab(e) && !this.disabled) {
            this.open = !this.open;
            e.preventDefault();
        }
    };

    get open() {
        return this.hasAttribute('open');
    }

    set open(val) {
        if (val) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    public attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ): void {
        if (name !== 'open') return;

        if (newValue !== null) {
            this.wasOpened();
        } else {
            this.wasClosed();
        }
    }

    private wasOpened() {
        if (this.content.hidden) {
            this.content.hidden = false;
            hello(this.content);
        }

        this.button.setAttribute('aria-expanded', 'true');

        this.dispatchEvent(new Event('toggle'));
    }

    private wasClosed() {
        if (!this.content.hidden) {
            goodbye(this.content).then(() => (this.content.hidden = true));
        }

        this.button.setAttribute('aria-expanded', 'false');

        this.dispatchEvent(new Event('toggle'));
    }

    private get button(): HTMLElement {
        return this.querySelector('button, [role=button]')!;
    }

    private get content(): HTMLElement {
        return this.children[1] as HTMLElement;
    }
}
