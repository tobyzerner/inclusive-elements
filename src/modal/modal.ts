import { goodbye, hello } from 'hello-goodbye';

class ModalElement extends HTMLElement {
    public static attention: (el: Element) => void = el => el.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(1)' }
    ], 300);

    static get observedAttributes() {
        return ['open'];
    }

    private trigger?: HTMLElement;

    private inertCache: Map<Element, boolean> = new Map();

    public constructor() {
        super();

        let shadow = this.attachShadow({mode: 'open'});

        const template = document.createElement('template');
        template.innerHTML =
            '<div part="backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>' +
            '<div part="content" style="position: relative"><slot></slot></div>';
        shadow.appendChild(template.content.cloneNode(true));

        shadow.querySelector('[part=backdrop]')?.addEventListener('click', () => {
            if (this.hasAttribute('static')) {
                ModalElement.attention && ModalElement.attention(shadow.children[1]);
            } else {
                this.close();
            }
        });
    }

    public connectedCallback(): void {
        if (this.firstElementChild) {
            this.firstElementChild.setAttribute('role', 'dialog');
            this.firstElementChild.setAttribute('aria-modal', 'true');
            this.firstElementChild.setAttribute('tabindex', '-1');
        }

        this.addEventListener('keydown', e => {
            if (e.key === 'Escape' && ! this.hidden) {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            }
        });
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
        if (! this.open) return;

        const event = new Event('beforeclose', {
            cancelable: true
        });

        if (this.dispatchEvent(event)) {
            this.open = false;
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'open') {
            if (newValue !== null) {
                this.trigger = document.activeElement as HTMLElement;

                this.hidden = false;
                hello(this);

                const autofocus = this.querySelector<HTMLElement>('[autofocus]');
                if (autofocus) {
                    autofocus.focus();
                } else {
                    (this.firstElementChild as HTMLElement)?.focus();
                }

                Array.from(document.body.children).filter(el => el !== this).forEach(el => {
                    this.inertCache.set(el, (el as any).inert);
                    (el as any).inert = true;
                });

                this.dispatchEvent(new Event('open'));

            } else {
                this.inertCache.forEach((inert, el) => {
                    (el as any).inert = inert;
                });
                this.inertCache.clear();

                if (this.trigger) {
                    if (this.trigger.getAttribute('role') === 'menuitem') {
                        (this.trigger.parentElement?.previousElementSibling as HTMLElement)?.focus();
                    } else {
                        this.trigger.focus();
                    }
                }

                goodbye(this, {
                    finish: () => this.hidden = true
                });

                this.dispatchEvent(new Event('close'));

            }
        }
    }
}

export default ModalElement;
