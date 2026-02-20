let idCounter = 0;

type SelectTabOptions = {
    focus?: boolean;
    emit?: boolean;
};

export default class TabsElement extends HTMLElement {
    private idPrefix = 'tabs' + ++idCounter;

    public connectedCallback(): void {
        this.tablist.addEventListener('keydown', this.onKeyDown);
        this.tablist.addEventListener('click', this.onClick);

        this.selectTab(this.initialTabIndex, { emit: false });

        this.tabs.forEach((tab, i) => {
            const panel = this.tabpanels[i];
            const tabId = tab.getAttribute('id') || this.idPrefix + '_tab_' + i;
            const panelId =
                panel.getAttribute('id') || this.idPrefix + '_panel_' + i;

            tab.setAttribute('id', tabId);
            tab.setAttribute('aria-controls', panelId);

            panel.setAttribute('id', panelId);
            panel.setAttribute('aria-labelledby', tabId);
            panel.setAttribute('tabindex', '0');
        });
    }

    public disconnectedCallback(): void {
        this.tablist.removeEventListener('keydown', this.onKeyDown);
        this.tablist.removeEventListener('click', this.onClick);
    }

    public selectTab(index: number, options: SelectTabOptions = {}): boolean {
        const { focus = false, emit = true } = options;
        const tabs = this.tabs;
        const panels = this.tabpanels;
        const tabCount = tabs.length;

        if (index < 0 || index >= tabCount) {
            return false;
        }

        const previousIndex = tabs.findIndex(
            (tab) => tab.getAttribute('aria-selected') === 'true'
        );

        tabs.forEach((tab, i) => {
            if (i === index) {
                tab.setAttribute('aria-selected', 'true');
                tab.removeAttribute('tabindex');
                panels[i].hidden = false;
                if (focus) tab.focus();
            } else {
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
                panels[i].hidden = true;
            }
        });

        if (emit && previousIndex !== index) {
            this.dispatchEvent(new Event('change'));
        }

        return previousIndex !== index;
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const tabs = this.tabs;
        if (tabs.length === 0) return;

        let index = tabs.indexOf(e.target as HTMLElement);
        if (index === -1) {
            index = tabs.findIndex(
                (tab) => tab.getAttribute('aria-selected') === 'true'
            );
            if (index === -1) {
                index = 0;
            }
        }

        const vertical =
            this.tablist.getAttribute('aria-orientation') === 'vertical';
        let nextIndex: number | undefined;

        switch (e.key) {
            case vertical ? 'ArrowUp' : 'ArrowLeft':
                nextIndex = (index - 1 + tabs.length) % tabs.length;
                break;

            case vertical ? 'ArrowDown' : 'ArrowRight':
                nextIndex = (index + 1) % tabs.length;
                break;

            case 'Home':
                nextIndex = 0;
                break;

            case 'End':
                nextIndex = tabs.length - 1;
        }

        if (nextIndex !== undefined) {
            this.selectTab(nextIndex, { focus: true });
            e.stopPropagation();
            e.preventDefault();
        }
    };

    private onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const tab = target.closest<HTMLElement>('[role=tab]');
        if (tab) {
            this.selectTab(this.tabs.indexOf(tab), { focus: true });
        }
    };

    private get initialTabIndex(): number {
        const index = this.tabs.findIndex(
            (tab) => tab.getAttribute('aria-selected') === 'true'
        );

        return index !== -1 ? index : 0;
    }

    private get tablist(): HTMLElement {
        return this.querySelector('[role=tablist]')!;
    }

    private get tabs(): HTMLElement[] {
        return Array.from(this.querySelectorAll('[role=tab]'));
    }

    private get tabpanels(): HTMLElement[] {
        return Array.from(this.querySelectorAll('[role=tabpanel]'));
    }
}
