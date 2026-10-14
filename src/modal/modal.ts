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

    private focusTrap: FocusTrap;
    private focusTrapPaused: boolean = false;
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
            // This runs after a delay on every activate and unpause, so the trap
            // may be paused by then. If focus is already inside the modal (e.g.
            // returned there by an overlay that has just closed), leave it.
            initialFocus: () => {
                if (this.focusTrap.paused) return false;
                if (this.contains(document.activeElement)) return undefined;
                return (
                    this.querySelector<HTMLElement>('[autofocus]') || undefined
                );
            },
            // Content that is still loading may have nothing tabbable yet. The
            // content element is focusable itself, so trap focus there until it does.
            fallbackFocus: () => this.content ?? this,
        });

        this.addEventListener('keydown', (e) => {
            // Handled here rather than with focus-trap's escapeDeactivates, which
            // listens on document and so can't stop the event reaching the page.
            // The trap is paused while another trap is stacked on top of it
            // (e.g. a nested modal) or pauseFocusTrap() has been called; leave
            // Escape to whatever is on top. Content inside the modal can also
            // claim Escape by calling preventDefault().
            if (
                e.key === 'Escape' &&
                this.open &&
                !this.focusTrapPaused &&
                !this.focusTrap.paused &&
                !e.defaultPrevented
            ) {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            }
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

    /**
     * Temporarily stop trapping focus and handling Escape, so that another
     * overlay opened from within the modal (e.g. a lightbox mounted in
     * <body>) can manage focus itself.
     */
    public pauseFocusTrap() {
        this.focusTrapPaused = true;
        this.focusTrap.pause();
    }

    public resumeFocusTrap() {
        this.focusTrapPaused = false;
        this.focusTrap.unpause();
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

    private async wasOpened() {
        document.documentElement.style.overflow = 'hidden';

        this.hidden = false;

        hello(this);

        requestAnimationFrame(() => {
            if (!this.open) return;

            this.focusTrap.activate();

            // pause() is a no-op before activation, so apply it now. Otherwise
            // clear any pause left over from the last open (deactivate() doesn't).
            if (this.focusTrapPaused) {
                this.focusTrap.pause();
            } else {
                this.focusTrap.unpause();
            }
        });

        this.dispatchEvent(new Event('open'));
    }

    private wasClosed() {
        document.documentElement.style.overflow = '';

        this.focusTrap.deactivate();
        this.focusTrapPaused = false;

        goodbye(this).then(() => (this.hidden = true));

        this.dispatchEvent(new Event('close'));
    }

    private get backdrop(): HTMLElement | undefined {
        return this.shadowRoot?.firstElementChild as HTMLElement;
    }

    private get content(): HTMLElement | undefined {
        return this.firstElementChild as HTMLElement;
    }
}
