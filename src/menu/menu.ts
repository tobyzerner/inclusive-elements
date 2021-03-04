class MenuElement extends HTMLElement {
    public static searchDelay: number = 800;

    private search: string = '';
    private searchTimeout?: number;

    public connectedCallback(): void {
        this.setAttribute('role', 'menu');

        // todo: mutation observer
        Array.from(this.focusableItems).forEach(el => {
            el.setAttribute('tabindex', '-1');
        });

        document.addEventListener('keydown', e => {
            if (this.hidden) return;
            if (e.key === 'ArrowUp') {
                this.navigate(-1);
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                this.navigate(1);
                e.preventDefault();
            } else {
                // Only respond to letter keys
                if (e.key.length > 1) return;

                // If the letter key is part of a key combo,
                // let it do whatever it was going to do
                if (e.ctrlKey || e.metaKey || e.altKey) return;

                e.preventDefault();

                this.search += e.key.toLowerCase();

                clearTimeout(this.searchTimeout);
                this.searchTimeout = window.setTimeout(() => {
                    this.search = '';
                }, MenuElement.searchDelay);

                this.focusableItems.some(el => {
                    if (el.textContent?.trim().toLowerCase().indexOf(this.search) === 0) {
                        el.focus();
                        return true;
                    }
                });
            }
        });
    }

    private navigate(step: number) {
        const items = this.focusableItems;
        let index = document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;
        index += step;
        if (index < 0) {
            index = items.length - 1;
        }
        if (index >= items.length) {
            index = 0;
        }
        if (items[index]) items[index].focus();
    }

    get focusableItems() {
        return Array.from(this.querySelectorAll<HTMLElement>('[role^=menuitem]'));
    }
}

export default MenuElement;
