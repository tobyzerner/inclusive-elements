import { place } from 'placement.js';
import { goodbye, hello } from 'hello-goodbye';

class PopupElement extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    private overlay?: HTMLElement;

    public constructor() {
        super();

        let shadow = this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML =
            '<div part="backdrop" hidden style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>' +
            '<slot></slot>';
        shadow.appendChild(template.content.cloneNode(true));
        (this.shadowRoot!.firstElementChild as HTMLElement).onclick = () => this.open = false;
    }

    public connectedCallback(): void {
        this.button.setAttribute('aria-haspopup', 'true');
        this.button.setAttribute('aria-expanded', 'false');

        this.button.addEventListener('click', () => {
            this.open = true;
        });

        this.button.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.open = true;
            }
        });

        this.addEventListener('keydown', e => {
            if (e.key === 'Escape' && ! this.menu.hidden) {
                e.preventDefault();
                e.stopPropagation();
                this.open = false;
            }

            else if (e.key === 'Tab' && ! this.menu.hidden) {
                this.open = false;
            }
        });

        this.menu.addEventListener('click', e => {
            const target = e.target instanceof Element ? e.target : null;
            if (target?.getAttribute('role')?.startsWith('menuitem') || target?.closest('[role^=menuitem]')) {
                this.open = false;
            }
        });

        this.open = false;
    }

    private get button(): HTMLElement {
        return this.querySelector('button, [role=button]') as HTMLElement;
    }

    private get menu(): HTMLElement {
        return this.children[1] as HTMLElement;
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

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'open') {
            if (newValue !== null) {
                if (! this.menu.hidden) return;

                this.menu.hidden = false;
                hello(this.menu);

                this.menu.style.zIndex = '10000';
                this.button.setAttribute('aria-expanded', 'true');

                place(this.button, this.menu, {
                    placement: this.getAttribute('placement') as any
                });

                const backdrop = this.shadowRoot!.firstElementChild! as HTMLElement;
                backdrop.hidden = false;
                backdrop.style.zIndex = '9999';
                hello(backdrop);

            } else {
                if (! this.menu.hidden) {
                    this.button.focus();
                    this.button.setAttribute('aria-expanded', 'false');

                    const backdrop = this.shadowRoot!.firstElementChild! as HTMLElement;
                    goodbye(backdrop, {
                        finish: () => backdrop.hidden = true
                    });

                    goodbye(this.menu, {
                        finish: () => this.menu.hidden = true
                    });
                }

            }
        }
    }
}

export default PopupElement;
