import {
    createQueuedElementSync,
    getLookupRoot,
    getRovingIndexForKey,
} from '../utils';

export default class MenuElement extends HTMLElement {
    public static searchDelay: number = 800;
    public static observedAttributes = ['id', 'popover'];

    private itemSync?: ReturnType<typeof createQueuedElementSync>;
    private search: string = '';
    private searchTimeout?: number;

    public connectedCallback(): void {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'menu');
        }

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '-1');
        }

        this.addEventListener('keydown', this.onKeyDown);
        this.addEventListener('click', this.onClick);
        this.addEventListener('mouseenter', this.onMouseEnter, true);

        this.itemSync ??= createQueuedElementSync(
            this,
            {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ['role', 'tabindex'],
            },
            () => this.syncItems()
        );

        this.itemSync.observe();
        this.itemSync.queue();

        this.syncDocumentListeners();
    }

    public disconnectedCallback(): void {
        this.removeEventListener('keydown', this.onKeyDown);
        this.removeEventListener('click', this.onClick);
        this.removeEventListener('mouseenter', this.onMouseEnter, true);

        this.removeDocumentListeners();
        this.itemSync?.disconnect();

        this.closeSelfAndDescendants();
        clearTimeout(this.searchTimeout);
    }

    public attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        if (oldValue === newValue) return;
        if (name !== 'id' && name !== 'popover') return;

        this.syncDocumentListeners();
    }

    private get horizontal(): boolean {
        return this.getAttribute('aria-orientation') === 'horizontal';
    }

    private syncDocumentListeners(): void {
        if (
            this.isConnected &&
            this.hasAttribute('popover') &&
            !this.getParentMenuTrigger()
        ) {
            this.ownerDocument.addEventListener('click', this.onDocumentClick);
            this.ownerDocument.addEventListener(
                'keydown',
                this.onDocumentKeyDown
            );
            return;
        }

        this.removeDocumentListeners();
    }

    private removeDocumentListeners(): void {
        this.ownerDocument.removeEventListener('click', this.onDocumentClick);
        this.ownerDocument.removeEventListener(
            'keydown',
            this.onDocumentKeyDown
        );
    }

    private onDocumentClick = (e: MouseEvent): void => {
        const trigger = this.getRootTriggerForEvent(e);
        if (!trigger) return;

        requestAnimationFrame(() => {
            if (!this.isActive()) return;

            if (e.detail === 0) {
                this.getEnabledItems()[0]?.focus();
            } else {
                this.focus({ preventScroll: true });
            }
        });
    };

    private onDocumentKeyDown = (e: KeyboardEvent): void => {
        const trigger = this.getRootTriggerForEvent(e);
        if (!trigger) return;
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        if (this.hidden) return;

        e.preventDefault();

        if (!this.isActive()) {
            this.showPopoverWithSource(trigger);
        }

        const items = this.getEnabledItems();
        if (e.key === 'ArrowDown') {
            items[0]?.focus();
        } else {
            items[items.length - 1]?.focus();
        }
    };

    private onKeyDown = (e: KeyboardEvent): void => {
        if (!this.isActive()) return;

        if (e.key === 'Tab') {
            this.closeMenuTree();
            return;
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            this.closeMenuTree();
            return;
        }

        const items = this.getEnabledItems();
        const activeItem = this.getActiveItem(items);
        const activeIndex = activeItem ? items.indexOf(activeItem) : -1;

        if (activeIndex === -1) {
            if (
                (!this.horizontal && e.key === 'ArrowDown') ||
                (this.horizontal && e.key === 'ArrowRight')
            ) {
                items[0]?.focus();
                e.preventDefault();
                return;
            }

            if (
                (!this.horizontal && e.key === 'ArrowUp') ||
                (this.horizontal && e.key === 'ArrowLeft')
            ) {
                items[items.length - 1]?.focus();
                e.preventDefault();
                return;
            }
        }

        const activeSubmenu = activeItem ? this.getSubmenu(activeItem) : null;
        if (activeItem && activeSubmenu) {
            if (
                (!this.horizontal && e.key === 'ArrowRight') ||
                (this.horizontal && e.key === 'ArrowDown') ||
                e.key === 'Enter' ||
                e.key === ' '
            ) {
                this.openSubmenu(activeItem);
                activeSubmenu.getItems()[0]?.focus();
                return;
            }

            if (this.horizontal && e.key === 'ArrowUp') {
                this.openSubmenu(activeItem);
                activeSubmenu.getItems().at(-1)?.focus();
                return;
            }
        }

        const parentMenuTrigger = this.getParentMenuTrigger();
        const parentMenu = parentMenuTrigger?.closest<MenuElement>('ui-menu');

        if (
            parentMenu &&
            e.key === (parentMenu.horizontal ? 'ArrowUp' : 'ArrowLeft')
        ) {
            this.closeSelfAndDescendants();
            parentMenuTrigger?.focus({ preventScroll: true });
            return;
        }

        const nextIndex = getRovingIndexForKey(e.key, {
            currentIndex: activeIndex,
            length: items.length,
            vertical: !this.horizontal,
        });

        if (nextIndex !== undefined) {
            items[nextIndex]?.focus();
            e.preventDefault();
            return;
        }

        this.handleTypeahead(e, items, activeItem);
    };

    private onClick = (e: MouseEvent): void => {
        const item = this.getItemForEvent(e);
        if (!item) return;

        const submenu = this.getSubmenu(item);
        if (submenu) {
            e.preventDefault();

            if (!submenu.isActive()) {
                this.openSubmenu(item);
                submenu.getItems()[0]?.focus();
            }

            return;
        }

        this.closeMenuTree();
    };

    private onMouseEnter = (e: MouseEvent): void => {
        if (!this.isActive()) return;

        const item = this.getItemForEvent(e);
        if (!item) return;

        item.focus();

        if (this.getSubmenu(item)) {
            this.openSubmenu(item);
            return;
        }

        this.closeSubmenus();
    };

    private isActive(): boolean {
        if (this.hidden) return false;

        return !this.hasAttribute('popover') || this.matches(':popover-open');
    }

    private syncItems(): void {
        this.getItems().forEach((item) => {
            if (item.getAttribute('tabindex') !== '-1') {
                item.setAttribute('tabindex', '-1');
            }
        });
    }

    private getItems(): HTMLElement[] {
        return Array.from(
            this.querySelectorAll<HTMLElement>('[role^=menuitem]')
        ).filter((item) => this.belongsToThisMenu(item));
    }

    private getEnabledItems(): HTMLElement[] {
        return this.getItems().filter((item) => this.isItemEnabled(item));
    }

    private isItemEnabled(item: HTMLElement): boolean {
        return (
            !item.hidden &&
            !item.hasAttribute('disabled') &&
            item.getAttribute('aria-disabled') !== 'true'
        );
    }

    private belongsToThisMenu(item: HTMLElement): boolean {
        return item.closest('ui-menu') === this;
    }

    private getActiveItem(items: HTMLElement[]): HTMLElement | undefined {
        const activeElement = getLookupRoot(this).activeElement;

        return items.find((item) => item === activeElement);
    }

    private getItemForEvent(event: Event): HTMLElement | null {
        const target = event.target;
        if (!(target instanceof Element)) return null;

        const item = target.closest<HTMLElement>('[role^=menuitem]');
        return item && this.belongsToThisMenu(item) && this.isItemEnabled(item)
            ? item
            : null;
    }

    private getRootTriggerForEvent(event: Event): HTMLElement | null {
        for (const candidate of event.composedPath()) {
            if (
                candidate instanceof HTMLElement &&
                !candidate.closest('ui-menu') &&
                candidate.getAttribute('popovertarget') === this.id
            ) {
                return candidate;
            }
        }

        return null;
    }

    private getTriggers(): HTMLElement[] {
        if (!this.id) return [];

        return Array.from(
            getLookupRoot(this).querySelectorAll<HTMLElement>(
                `[popovertarget="${CSS.escape(this.id)}"]`
            )
        );
    }

    private getParentMenuTrigger(): HTMLElement | null {
        return (
            this.getTriggers().find((trigger) => trigger.closest('ui-menu')) ||
            null
        );
    }

    private getParentMenu(): MenuElement | null {
        return (
            this.getParentMenuTrigger()?.closest<MenuElement>('ui-menu') || null
        );
    }

    private getSubmenu(item: HTMLElement): MenuElement | null {
        const id = item.getAttribute('popovertarget');
        if (!id) return null;

        return getLookupRoot(this).querySelector<MenuElement>(
            `ui-menu#${CSS.escape(id)}`
        );
    }

    private openSubmenu(item: HTMLElement) {
        const submenu = this.getSubmenu(item);
        if (!submenu) return;

        this.closeSubmenus();

        submenu.showPopoverWithSource(item);
    }

    private closeSubmenus() {
        this.getItems().forEach((item) =>
            this.getSubmenu(item)?.closeSelfAndDescendants()
        );
    }

    private closeSelfAndDescendants() {
        this.closeSubmenus();

        if (this.hasAttribute('popover') && this.matches(':popover-open')) {
            this.hidePopover();
        }
    }

    private closeMenuTree() {
        this.closeSelfAndDescendants();
        this.getParentMenu()?.closeMenuTree();
    }

    private handleTypeahead(
        e: KeyboardEvent,
        items: HTMLElement[],
        activeItem: HTMLElement | undefined
    ): void {
        if (e.key === ' ') return;
        if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        if (!items.length) return;

        e.preventDefault();

        const search = this.updateTypeaheadSearch(e.key);
        const startIndex = activeItem ? items.indexOf(activeItem) : -1;

        this.findTypeaheadMatch(items, search, startIndex)?.focus();
    }

    private updateTypeaheadSearch(key: string): string {
        this.search += key.toLowerCase();

        clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => {
            this.search = '';
        }, MenuElement.searchDelay);

        if (
            this.search.length > 1 &&
            this.search
                .split('')
                .every((character) => character === this.search[0])
        ) {
            return this.search[0];
        }

        return this.search;
    }

    private findTypeaheadMatch(
        items: HTMLElement[],
        search: string,
        startIndex: number
    ): HTMLElement | undefined {
        for (let offset = 1; offset <= items.length; offset += 1) {
            const index = (startIndex + offset + items.length) % items.length;
            const item = items[index];

            if (this.getItemLabel(item).startsWith(search)) {
                return item;
            }
        }

        return undefined;
    }

    private getItemLabel(item: HTMLElement): string {
        return (item.getAttribute('aria-label') || item.textContent || '')
            .trim()
            .toLowerCase();
    }

    private showPopoverWithSource(source: HTMLElement) {
        (
            this as HTMLElement & {
                showPopover?: (options?: { source?: HTMLElement }) => void;
            }
        ).showPopover?.({ source });
    }
}
