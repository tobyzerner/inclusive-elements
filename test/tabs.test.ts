import { afterEach, describe, expect, it, vi } from 'vitest';
import TabsElement from '../src/tabs/tabs';

vi.mock('tabbable', () => ({
    tabbable: (container: HTMLElement) =>
        Array.from(
            container.querySelectorAll<HTMLElement>(
                'button, a[href], input, select, textarea'
            )
        ).filter(
            (element) =>
                !element.hidden &&
                !element.hasAttribute('disabled') &&
                element.getAttribute('tabindex') !== '-1'
        ),
}));

if (!customElements.get('ui-tabs')) {
    customElements.define('ui-tabs', TabsElement);
}

function flushMicrotasks(): Promise<void> {
    return Promise.resolve().then(() => Promise.resolve());
}

function pressKey(target: HTMLElement, key: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function click(target: HTMLElement): void {
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

async function createTabs(options: {
    selectedIndex?: number;
    vertical?: boolean;
    panelWithButtonIndex?: number;
} = {}) {
    const tabs = document.createElement('ui-tabs') as TabsElement;
    const tablist = document.createElement('div');
    const labels = ['Profile', 'Security', 'Billing'];

    tablist.setAttribute('role', 'tablist');

    if (options.vertical) {
        tablist.setAttribute('aria-orientation', 'vertical');
    }

    const buttons = labels.map((label, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.setAttribute('role', 'tab');

        if (options.selectedIndex === index) {
            button.setAttribute('aria-selected', 'true');
        }

        tablist.append(button);
        return button;
    });

    const panels = labels.map((label, index) => {
        const panel = document.createElement('section');
        panel.setAttribute('role', 'tabpanel');
        panel.textContent = `${label} panel`;

        if (options.panelWithButtonIndex === index) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = `${label} action`;
            panel.append(button);
        }

        tabs.append(panel);
        return panel;
    });

    tabs.prepend(tablist);
    document.body.append(tabs);
    await flushMicrotasks();

    return { tabs, tablist, buttons, panels };
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('TabsElement', () => {
    it('uses the authored selected tab when one is provided', async () => {
        const { buttons, panels } = await createTabs({ selectedIndex: 1 });

        expect(buttons[1].getAttribute('aria-selected')).toBe('true');
        expect(buttons[0].getAttribute('aria-selected')).toBe('false');
        expect(panels[1].hidden).toBe(false);
        expect(panels[0].hidden).toBe(true);
    });

    it('selects the first tab when none is authored as selected', async () => {
        const { buttons, panels } = await createTabs();

        expect(buttons[0].getAttribute('aria-selected')).toBe('true');
        expect(panels[0].hidden).toBe(false);
        expect(panels[1].hidden).toBe(true);
    });

    it('supports keyboard navigation immediately after connecting', () => {
        const tabs = document.createElement('ui-tabs') as TabsElement;
        const tablist = document.createElement('div');
        const firstTab = document.createElement('button');
        const secondTab = document.createElement('button');
        const firstPanel = document.createElement('section');
        const secondPanel = document.createElement('section');

        tablist.setAttribute('role', 'tablist');
        firstTab.type = 'button';
        secondTab.type = 'button';
        firstTab.setAttribute('role', 'tab');
        secondTab.setAttribute('role', 'tab');
        firstPanel.setAttribute('role', 'tabpanel');
        secondPanel.setAttribute('role', 'tabpanel');

        tablist.append(firstTab, secondTab);
        tabs.append(tablist, firstPanel, secondPanel);
        document.body.append(tabs);

        firstTab.focus();
        pressKey(firstTab, 'ArrowRight');

        expect(secondTab.getAttribute('aria-selected')).toBe('true');
        expect(document.activeElement).toBe(secondTab);
    });

    it('supports horizontal and vertical keyboard navigation', async () => {
        const horizontal = await createTabs();
        horizontal.buttons[0].focus();
        pressKey(horizontal.buttons[0], 'ArrowRight');

        expect(document.activeElement).toBe(horizontal.buttons[1]);
        expect(horizontal.buttons[1].getAttribute('aria-selected')).toBe('true');

        document.body.innerHTML = '';

        const vertical = await createTabs({ vertical: true });
        vertical.buttons[0].focus();
        pressKey(vertical.buttons[0], 'ArrowDown');

        expect(document.activeElement).toBe(vertical.buttons[1]);
        expect(vertical.buttons[1].getAttribute('aria-selected')).toBe('true');
    });

    it('supports click activation', async () => {
        const { buttons, panels } = await createTabs();

        click(buttons[1]);

        expect(buttons[1].getAttribute('aria-selected')).toBe('true');
        expect(panels[1].hidden).toBe(false);
        expect(document.activeElement).toBe(buttons[1]);
    });

    it('links tabs and panels by generated ids in document order', async () => {
        const { buttons, panels } = await createTabs();

        expect(buttons[0].getAttribute('aria-controls')).toBe(panels[0].id);
        expect(buttons[1].getAttribute('aria-controls')).toBe(panels[1].id);
        expect(panels[0].getAttribute('aria-labelledby')).toBe(buttons[0].id);
        expect(panels[1].getAttribute('aria-labelledby')).toBe(buttons[1].id);
    });

    it('supports selectTab() return values and change events', async () => {
        const { tabs, buttons } = await createTabs();
        const changeSpy = vi.fn();

        tabs.addEventListener('change', changeSpy);

        expect(tabs.selectTab(1)).toBe(true);
        expect(buttons[1].getAttribute('aria-selected')).toBe('true');
        expect(changeSpy).toHaveBeenCalledTimes(1);

        expect(tabs.selectTab(1)).toBe(false);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('manages panel tabindex for selected panels without tabbable content', async () => {
        const { tabs, panels } = await createTabs({ panelWithButtonIndex: 1 });

        expect(panels[0].getAttribute('tabindex')).toBe('0');

        tabs.selectTab(1);

        expect(panels[0].hasAttribute('tabindex')).toBe(false);
        expect(panels[1].hasAttribute('tabindex')).toBe(false);
    });

    it('handles missing or temporarily incomplete tab structures', async () => {
        const tabsWithoutTablist = document.createElement('ui-tabs');
        document.body.append(tabsWithoutTablist);
        await flushMicrotasks();

        const tabs = document.createElement('ui-tabs');
        const tablist = document.createElement('div');
        const tab = document.createElement('button');
        const panel = document.createElement('section');

        tablist.setAttribute('role', 'tablist');
        tab.setAttribute('role', 'tab');
        panel.setAttribute('role', 'tabpanel');

        tablist.append(tab);
        tabs.append(tablist);
        document.body.append(tabs);
        tabs.append(panel);
        await flushMicrotasks();

        expect(tab.getAttribute('aria-controls')).toBe(panel.id);
        expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    });

    it('preserves selection when matching tab and panel pairs are removed together', async () => {
        const { buttons, panels } = await createTabs({ selectedIndex: 1 });

        buttons[0].remove();
        panels[0].remove();
        await flushMicrotasks();

        expect(buttons[1].getAttribute('aria-selected')).toBe('true');
        expect(panels[1].hidden).toBe(false);
    });
});
