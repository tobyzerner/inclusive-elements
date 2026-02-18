let idCounter = 0;

export default class TabsElement extends HTMLElement {
    private idPrefix = 'tabs' + ++idCounter;

    public connectedCallback(): void {
        this.tablist.addEventListener('keydown', this.onKeyDown);
        this.tablist.addEventListener('click', this.onClick);

        this.selectTab(this.initialTabIndex, false);

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

    private selectTab(index: number, focus = true) {
        if (index < 0) index += this.tabs.length;
        else if (index >= this.tabs.length) index -= this.tabs.length;

        this.tabs.forEach((tab, i) => {
            if (i === index) {
                tab.setAttribute('aria-selected', 'true');
                tab.removeAttribute('tabindex');
                this.tabpanels[i].hidden = false;
                if (focus) tab.focus();
            } else {
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
                this.tabpanels[i].hidden = true;
            }
        });
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const index = this.tabs.indexOf(target);
        const vertical =
            this.tablist.getAttribute('aria-orientation') === 'vertical';
        let captured = false;

        switch (e.key) {
            case vertical ? 'ArrowUp' : 'ArrowLeft':
                this.selectTab(index - 1);
                captured = true;
                break;

            case vertical ? 'ArrowDown' : 'ArrowRight':
                this.selectTab(index + 1);
                captured = true;
                break;

            case 'Home':
                this.selectTab(0);
                captured = true;
                break;

            case 'End':
                this.selectTab(this.tabs.length - 1);
                captured = true;
        }

        if (captured) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    private onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const tab = target.closest<HTMLElement>('[role=tab]');
        if (tab) {
            this.selectTab(this.tabs.indexOf(tab));
        }
    };

    private get initialTabIndex(): number {
        return (
            this.tabs.findIndex(
                (tab) => tab.getAttribute('aria-selected') === 'true'
            ) || 0
        );
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
