import { tabbable } from 'tabbable';
import { createQueuedElementSync, getRovingIndexForKey } from '../utils';

let idCounter = 0;

type SelectTabOptions = {
    focus?: boolean;
    emit?: boolean;
};

type TabPair = {
    tab: HTMLElement;
    panel: HTMLElement;
};

export default class TabsElement extends HTMLElement {
    private idPrefix = 'tabs' + ++idCounter;
    private structureSync?: ReturnType<typeof createQueuedElementSync>;
    private managedPanelTabindex: WeakSet<HTMLElement> = new WeakSet();

    public connectedCallback(): void {
        this.addEventListener('keydown', this.onKeyDown);
        this.addEventListener('click', this.onClick);

        if (!this.structureSync) {
            this.structureSync = createQueuedElementSync(
                this,
                {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    attributeFilter: ['role', 'aria-selected'],
                },
                () => this.syncStructure()
            );
        }

        this.structureSync.observe();
        this.structureSync.queue();
    }

    public disconnectedCallback(): void {
        this.removeEventListener('keydown', this.onKeyDown);
        this.removeEventListener('click', this.onClick);

        this.structureSync?.disconnect();
    }

    public selectTab(index: number, options: SelectTabOptions = {}): boolean {
        return this.applySelection(this.tabPairs(), index, options);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const pairs = this.tabPairs();
        if (!pairs.length) return;

        const nextIndex = getRovingIndexForKey(e.key, {
            currentIndex: this.getEventTabIndex(e.target, pairs),
            length: pairs.length,
            vertical: this.vertical,
        });

        if (nextIndex !== undefined) {
            this.applySelection(pairs, nextIndex, { focus: true });
            e.stopPropagation();
            e.preventDefault();
        }
    };

    private onClick = (e: MouseEvent) => {
        const pairs = this.tabPairs();
        this.applySelection(pairs, this.getEventTabIndex(e.target, pairs), {
            focus: true,
        });
    };

    private syncStructure(): void {
        const pairs = this.tabPairs();

        if (!pairs.length) return;

        this.applySelection(pairs, this.getSelectedIndex(pairs, 0), {
            emit: false,
        });
    }

    private get vertical(): boolean {
        return this.tablist?.getAttribute('aria-orientation') === 'vertical';
    }

    private get tablist(): HTMLElement | undefined {
        return Array.from(
            this.querySelectorAll<HTMLElement>('[role=tablist]')
        ).find((el) => el.closest('ui-tabs') === this);
    }

    private tabPairs(): TabPair[] {
        const tablist = this.tablist;

        if (!tablist) {
            return [];
        }

        const tabs = Array.from(
            tablist.querySelectorAll<HTMLElement>('[role=tab]')
        );

        const panels = Array.from(
            this.querySelectorAll<HTMLElement>('[role=tabpanel]')
        ).filter((el) => el.closest('ui-tabs') === this);

        tabs.forEach((tab, index) => {
            if (!tab.id) {
                tab.id = this.idPrefix + '_tab_' + index;
            }
        });

        panels.forEach((panel, index) => {
            if (!panel.id) {
                panel.id = this.idPrefix + '_panel_' + index;
            }
        });

        const pairs = tabs
            .slice(0, Math.min(tabs.length, panels.length))
            .map((tab, index) => ({ tab, panel: panels[index] }));

        pairs.forEach(({ tab, panel }) => {
            tab.setAttribute('aria-controls', panel.id);
            panel.setAttribute('aria-labelledby', tab.id);
        });

        return pairs;
    }

    private getSelectedIndex(pairs: TabPair[], fallback: number = -1): number {
        const index = pairs.findIndex(
            ({ tab }) => tab.getAttribute('aria-selected') === 'true'
        );

        return index === -1 ? fallback : index;
    }

    private getEventTabIndex(
        target: EventTarget | null,
        pairs: TabPair[]
    ): number {
        if (!(target instanceof Element)) return -1;

        const tab = target.closest<HTMLElement>('[role=tab]');
        return tab ? pairs.findIndex((pair) => pair.tab === tab) : -1;
    }

    private applySelection(
        pairs: TabPair[],
        index: number,
        options: SelectTabOptions = {}
    ): boolean {
        const { focus = false, emit = true } = options;

        if (index < 0 || index >= pairs.length) {
            return false;
        }

        const previousIndex = this.getSelectedIndex(pairs);

        pairs.forEach(({ tab, panel }, i) => {
            const selected = i === index;

            if (tab.getAttribute('aria-selected') !== String(selected)) {
                tab.setAttribute('aria-selected', String(selected));
            }

            if (selected) {
                tab.removeAttribute('tabindex');
                panel.hidden = false;

                if (focus) {
                    tab.focus();
                }
            } else {
                tab.setAttribute('tabindex', '-1');
                panel.hidden = true;
            }

            this.syncPanelTabindex(panel, selected);
        });

        if (emit && previousIndex !== index) {
            this.dispatchEvent(new Event('change'));
        }

        return previousIndex !== index;
    }

    private syncPanelTabindex(panel: HTMLElement, selected: boolean): void {
        const tabbableDescendants = tabbable(panel).filter((el) => el !== panel);

        if (
            selected &&
            !this.hasAuthorManagedTabindex(panel) &&
            tabbableDescendants.length === 0
        ) {
            panel.setAttribute('tabindex', '0');
            this.managedPanelTabindex.add(panel);
            return;
        }

        if (this.managedPanelTabindex.has(panel)) {
            panel.removeAttribute('tabindex');
            this.managedPanelTabindex.delete(panel);
        }
    }

    private hasAuthorManagedTabindex(panel: HTMLElement): boolean {
        return (
            panel.hasAttribute('tabindex') &&
            !this.managedPanelTabindex.has(panel)
        );
    }
}
