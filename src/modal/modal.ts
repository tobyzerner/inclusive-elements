import { createFocusTrap, FocusTrap } from 'focus-trap';
import { goodbye, hello } from 'hello-goodbye';

export default class ModalElement extends HTMLElement {
    public static attention: (el: Element) => void = (el) =>
        el.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' },
            ],
            300
        );

    static get observedAttributes() {
        return ['open'];
    }

    private focusTrap?: FocusTrap;
    private connected: boolean = false;

    public constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <div part="backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>
            <div part="content" style="z-index: 1"><slot></slot></div>
        `;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this.backdrop!.addEventListener('click', () => {
            if (this.hasAttribute('static')) {
                ModalElement.attention?.(shadow.children[1]);
            } else {
                this.close();
            }
        });

        this.focusTrap = createFocusTrap(this, {
            escapeDeactivates: false,
            allowOutsideClick: true,
            preventScroll: true,
        });
    }

    public connectedCallback(): void {
        this.connected = true;

        if (!this.content?.hasAttribute('role')) {
            this.content?.setAttribute('role', 'dialog');
        }

        if (!this.content?.hasAttribute('aria-modal')) {
            this.content?.setAttribute('aria-modal', 'true');
        }

        if (!this.content?.hasAttribute('tabindex')) {
            this.content?.setAttribute('tabindex', '-1');
        }

        this.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.open) {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            }
        });

        if (this.open) {
            this.wasOpened();
        }
    }

    public disconnectedCallback(): void {
        this.connected = false;
    }

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

    public close() {
        if (!this.open) return;

        const event = new Event('beforeclose', { cancelable: true });

        if (this.dispatchEvent(event)) {
            this.open = false;
        }
    }

    public attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ): void {
        if (name !== 'open' || !this.connected) return;

        if (newValue !== null) {
            this.wasOpened();
        } else {
            this.wasClosed();
        }
    }

    private wasOpened() {
        this.hidden = false;
        hello(this);

        this.focusTrap?.activate();

        this.querySelector<HTMLElement>('[autofocus]')?.focus();

        this.dispatchEvent(new Event('open'));
    }

    private wasClosed() {
        this.focusTrap?.deactivate();

        goodbye(this, {
            finish: () => (this.hidden = true),
        });

        this.dispatchEvent(new Event('close'));
    }

    private get backdrop(): HTMLElement | undefined {
        return this.shadowRoot?.firstElementChild as HTMLElement;
    }

    private get content(): HTMLElement | undefined {
        return this.firstElementChild as HTMLElement;
    }
}
