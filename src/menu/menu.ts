import { isFocusable } from 'tabbable';

export default class MenuElement extends HTMLElement {
    public static searchDelay: number = 800;

    private search: string = '';
    private searchTimeout?: number;

    public connectedCallback(): void {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'menu');
        }

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '-1');
        }

        this.items.forEach((el) => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '-1');
            }
        });

        this.addEventListener('keydown', this.onKeyDown);
    }

    public disconnectedCallback(): void {
        this.removeEventListener('keydown', this.onKeyDown);
    }

    private get items() {
        return Array.from(
            this.querySelectorAll<HTMLElement>('[role^=menuitem]')
        ).filter((item) => isFocusable(item));
    }

    private get horizontal(): boolean {
        return this.getAttribute('aria-orientation') === 'horizontal';
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (this.hidden) return;

        if (this.horizontal && e.key === 'ArrowLeft') {
            this.navigate(-1);
            e.preventDefault();
            return;
        }

        if (this.horizontal && e.key === 'ArrowRight') {
            this.navigate(1);
            e.preventDefault();
            return;
        }

        if (e.key === 'ArrowUp') {
            if (this.horizontal) {
                this.focusItemAtIndex(0);
            } else {
                this.navigate(-1);
            }
            e.preventDefault();
            return;
        }

        if (e.key === 'ArrowDown') {
            if (this.horizontal) {
                this.focusItemAtIndex(this.items.length - 1);
            } else {
                this.navigate(1);
            }
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

        this.items.some((el) => {
            if (
                el.textContent?.trim().toLowerCase().indexOf(this.search) === 0
            ) {
                el.focus();
                return true;
            }
            return false;
        });
    };

    private navigate(step: number) {
        const items = this.items;
        let index =
            (document.activeElement instanceof HTMLElement
                ? items.indexOf(document.activeElement)
                : -1) + step;
        if (index < 0) {
            index = items.length - 1;
        }
        if (index >= items.length) {
            index = 0;
        }
        this.focusItemAtIndex(index);
    }

    private focusItemAtIndex(index: number): void {
        this.items[index]?.focus();
    }
}
