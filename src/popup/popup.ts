import {
    autoUpdate,
    computePosition,
    flip,
    shift,
    size,
} from '@floating-ui/dom';
import { cancel, goodbye, hello } from 'hello-goodbye';
import { focusable } from 'tabbable';
import { shouldOpenInNewTab } from '../utils';

export default class PopupElement extends HTMLElement {
    cleanup?: () => void;

    static get observedAttributes() {
        return ['open'];
    }

    public constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <div part="backdrop" hidden style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>
            <slot></slot>
        `;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this.backdrop.onclick = () => (this.open = false);
    }

    public connectedCallback(): void {
        this.backdrop.hidden = true;
        this.content.hidden = true;
        this.open = false;

        this.button.setAttribute('aria-expanded', 'false');

        // Wait a tick before checking to see if the content is a menu, to give
        // the Menu element time to be constructed and set the role.
        setTimeout(() => {
            if (this.content.getAttribute('role') === 'menu') {
                this.button.setAttribute('aria-haspopup', 'true');
            }
        });

        this.button.addEventListener('click', this.onButtonClick);
        this.button.addEventListener('keydown', this.onButtonKeyDown);

        this.addEventListener('keydown', this.onKeyDown);
        this.addEventListener('focusout', this.onFocusOut);

        this.content.addEventListener('click', this.onContentClick);
    }

    public disconnectedCallback(): void {
        cancel(this.backdrop);
        cancel(this.content);

        this.button.removeAttribute('aria-expanded');
        this.button.removeAttribute('aria-haspopup');
        this.button.removeEventListener('click', this.onButtonClick);
        this.button.removeEventListener('keydown', this.onButtonKeyDown);

        this.removeEventListener('keydown', this.onKeyDown);
        this.removeEventListener('focusout', this.onFocusOut);

        this.content.removeEventListener('click', this.onContentClick);
    }

    private onButtonClick = (e: MouseEvent) => {
        if (!shouldOpenInNewTab(e) && !this.disabled) {
            this.open = !this.open;
            e.preventDefault();
        }
    };

    private onButtonKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' && !this.disabled) {
            e.preventDefault();
            this.open = true;
            focusable(this.content)[0]?.focus();
        }
    };

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.open) {
            e.preventDefault();
            e.stopPropagation();
            this.open = false;
            this.button.focus();
        }
    };

    private onFocusOut = (e: FocusEvent) => {
        if (
            !(e.relatedTarget instanceof Node) ||
            !this.contains(e.relatedTarget)
        ) {
            this.open = false;
        }
    };

    private onContentClick = (e: MouseEvent) => {
        if (!(e.target instanceof Element)) return;

        if (e.target.closest('[role=menuitem], [role=menuitemradio]')) {
            this.open = false;
            this.button.focus();
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
        if (!this.content.hidden) return;

        this.content.hidden = false;
        this.backdrop.hidden = false;

        hello(this.content);
        hello(this.backdrop);

        this.button.setAttribute('aria-expanded', 'true');

        this.content.style.position = 'absolute';

        this.cleanup = autoUpdate(
            this.button,
            this.content,
            () => {
                computePosition(this.button, this.content, {
                    placement:
                        (this.getAttribute('placement') as any) || 'bottom',
                    middleware: [
                        shift(),
                        flip(),
                        size({
                            apply: ({ availableWidth, availableHeight }) => {
                                Object.assign(this.content.style, {
                                    maxWidth: '',
                                    maxHeight: '',
                                });

                                const computed = getComputedStyle(this.content);

                                // TODO: subtract margins

                                if (
                                    computed.maxWidth === 'none' ||
                                    availableWidth < parseInt(computed.maxWidth)
                                ) {
                                    this.content.style.maxWidth = `${availableWidth}px`;
                                }

                                if (
                                    computed.maxHeight === 'none' ||
                                    availableHeight <
                                        parseInt(computed.maxHeight)
                                ) {
                                    this.content.style.maxHeight = `${availableHeight}px`;
                                }
                            },
                        }),
                    ],
                }).then(({ x, y, placement }) => {
                    Object.assign(this.content.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                    this.content.dataset.placement = placement;
                });
            },
            { ancestorScroll: false }
        );

        const autofocus =
            this.content.querySelector<HTMLElement>('[autofocus]');
        if (autofocus) {
            autofocus.focus();
        } else {
            this.content.focus();
        }

        this.dispatchEvent(new Event('open'));
    }

    private wasClosed() {
        if (this.content.hidden) return;

        this.button.setAttribute('aria-expanded', 'false');

        this.cleanup?.();

        goodbye(this.backdrop, {
            finish: () => (this.backdrop.hidden = true),
        });

        goodbye(this.content, {
            finish: () => (this.content.hidden = true),
        });

        this.dispatchEvent(new Event('close'));
    }

    private get backdrop(): HTMLElement {
        return this.shadowRoot?.firstElementChild as HTMLElement;
    }

    private get button(): HTMLElement {
        return this.querySelector('button, [role=button]')!;
    }

    private get content(): HTMLElement {
        return this.children[1] as HTMLElement;
    }
}
