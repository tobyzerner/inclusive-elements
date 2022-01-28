import { isFocusable } from 'tabbable';

export default class MenuElement extends HTMLElement {
    public static searchDelay: number = 800;

    private search: string = '';
    private searchTimeout?: number;

    public connectedCallback(): void {
        if (! this.hasAttribute('role')) {
            this.setAttribute('role', 'menu');
        }

        if (! this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '-1');
        }

        this.items.forEach(el => {
            if (! el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '-1');
            }
        });

        this.addEventListener('keydown', this.onKeyDown);
    }

    public disconnectedCallback(): void {
        this.removeEventListener('keydown', this.onKeyDown);
    }

    private get items() {
        return Array.from(this.querySelectorAll<HTMLElement>('[role^=menuitem]'))
            .filter(item => isFocusable(item));
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (this.hidden) return;

        if (e.key === 'ArrowUp') {
            this.navigate(-1);
            e.preventDefault();
            return;
        }

        if (e.key === 'ArrowDown') {
            this.navigate(1);
            e.preventDefault();
            return;
        }

        // Search with letter keys that aren't part of a combo.
        if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;

        this.search += e.key.toLowerCase();
        e.preventDefault();

        clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => {
            this.search = '';
        }, MenuElement.searchDelay);

        this.items.some(el => {
            if (el.textContent?.trim().toLowerCase().indexOf(this.search) === 0) {
                el.focus();
                return true;
            }
        });
    }

    private navigate(step: number) {
        const items = this.items;
        let index = (document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1) + step;
        if (index < 0) {
            index = items.length - 1;
        }
        if (index >= items.length) {
            index = 0;
        }
        items[index]?.focus();
    }
}
