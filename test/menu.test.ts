import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MenuElement from '../src/menu/menu';

if (!customElements.get('ui-menu')) {
    customElements.define('ui-menu', MenuElement);
}

type TestMenu = MenuElement & {
    _open?: boolean;
    showPopover: (options?: { source?: HTMLElement }) => void;
    hidePopover: () => void;
};

function flushMicrotasks(): Promise<void> {
    return Promise.resolve().then(() => Promise.resolve());
}

function pressKey(target: EventTarget, key: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function click(target: EventTarget, detail: number = 1): void {
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, detail }));
}

function hover(target: EventTarget): void {
    target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
}

function createButton(label: string, attributes: Record<string, string> = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;

    Object.entries(attributes).forEach(([name, value]) => {
        button.setAttribute(name, value);
    });

    return button;
}

function enhancePopover(menu: TestMenu): TestMenu {
    menu.showPopover = vi.fn(() => {
        menu._open = true;
    });

    menu.hidePopover = vi.fn(() => {
        menu._open = false;
    });

    const matches = menu.matches.bind(menu);
    menu.matches = ((selector: string) => {
        if (selector === ':popover-open') {
            return menu._open === true;
        }

        return matches(selector);
    }) as typeof menu.matches;

    return menu;
}

async function createMenu(
    labels: string[] = ['Edit', 'Archive', 'Delete'],
    attributes: Record<string, string> = {}
) {
    const trigger = createButton('Actions', {
        popovertarget: 'actions-menu',
        'aria-haspopup': 'menu',
    });
    const menu = enhancePopover(document.createElement('ui-menu') as TestMenu);

    menu.id = 'actions-menu';
    menu.setAttribute('popover', '');

    Object.entries(attributes).forEach(([name, value]) => {
        menu.setAttribute(name, value);
    });

    const items = labels.map((label) => {
        const item = createButton(label, { role: 'menuitem' });
        menu.append(item);
        return item;
    });

    document.body.append(trigger, menu);
    await flushMicrotasks();

    return { trigger, menu, items };
}

async function createMenuWithSubmenu(horizontal = false) {
    const { trigger, menu, items } = await createMenu(
        ['Edit', 'More', 'Delete'],
        horizontal ? { 'aria-orientation': 'horizontal' } : {}
    );
    const submenuTrigger = items[1];
    const submenu = enhancePopover(document.createElement('ui-menu') as TestMenu);

    submenu.id = 'more-menu';
    submenu.setAttribute('popover', '');
    submenuTrigger.setAttribute('aria-haspopup', 'menu');
    submenuTrigger.setAttribute('popovertarget', 'more-menu');

    const submenuItems = ['Duplicate', 'Share'].map((label) => {
        const item = createButton(label, { role: 'menuitem' });
        submenu.append(item);
        return item;
    });

    document.body.append(submenu);
    await flushMicrotasks();

    return { trigger, menu, items, submenuTrigger, submenu, submenuItems };
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('CSS', {
        escape: (value: string) => value,
    });
});

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
});

describe('MenuElement', () => {
    it('supports keyboard opening from a root trigger with initial item focus', async () => {
        const { trigger, menu, items } = await createMenu();

        pressKey(trigger, 'ArrowDown');
        expect(menu.matches(':popover-open')).toBe(true);
        expect(document.activeElement).toBe(items[0]);

        pressKey(trigger, 'ArrowUp');
        expect(document.activeElement).toBe(items[2]);
    });

    it('supports roving navigation across enabled items', async () => {
        const { menu, items } = await createMenu(['One', 'Two', 'Three', 'Four']);

        menu.showPopover();
        items[1].disabled = true;
        items[2].hidden = true;
        items[0].focus();

        pressKey(items[0], 'ArrowDown');
        expect(document.activeElement).toBe(items[3]);

        pressKey(items[3], 'ArrowDown');
        expect(document.activeElement).toBe(items[0]);
    });

    it('manages direct menuitem tabindex and roving order', async () => {
        const { menu, items } = await createMenu(['One', 'Two']);
        const roleOnlyItem = document.createElement('div');
        const lateItem = createButton('Three', { role: 'menuitem' });

        roleOnlyItem.setAttribute('role', 'menuitem');
        roleOnlyItem.textContent = 'Unsupported';
        menu.insertBefore(roleOnlyItem, items[1]);
        menu.append(lateItem);
        await flushMicrotasks();

        expect(items[0].getAttribute('tabindex')).toBe('-1');
        expect(items[1].getAttribute('tabindex')).toBe('-1');
        expect(lateItem.getAttribute('tabindex')).toBe('-1');
        expect(roleOnlyItem.getAttribute('tabindex')).toBe('-1');

        menu.showPopover();
        items[0].focus();

        pressKey(items[0], 'ArrowDown');
        expect(document.activeElement).toBe(roleOnlyItem);

        pressKey(roleOnlyItem, 'ArrowDown');
        expect(document.activeElement).toBe(items[1]);

        pressKey(items[1], 'ArrowDown');
        expect(document.activeElement).toBe(lateItem);
    });

    it('reapplies managed tabindex after direct mutation', async () => {
        const { menu, items } = await createMenu(['One']);
        const lateItem = createButton('Two', { role: 'menuitem' });

        menu.append(lateItem);
        await flushMicrotasks();

        lateItem.setAttribute('tabindex', '0');
        await flushMicrotasks();

        expect(lateItem.getAttribute('tabindex')).toBe('-1');

        menu.showPopover();
        items[0].focus();

        pressKey(items[0], 'ArrowDown');
        expect(document.activeElement).toBe(lateItem);
    });

    it('supports horizontal navigation with submenu open and close keys', async () => {
        const { menu, items, submenuTrigger, submenu, submenuItems } =
            await createMenuWithSubmenu(true);

        menu.showPopover();
        items[0].focus();

        pressKey(items[0], 'ArrowRight');
        expect(document.activeElement).toBe(submenuTrigger);

        pressKey(submenuTrigger, 'ArrowDown');
        expect(submenu.matches(':popover-open')).toBe(true);
        expect(document.activeElement).toBe(submenuItems[0]);

        pressKey(submenuItems[0], 'ArrowUp');
        expect(submenu.matches(':popover-open')).toBe(false);
        expect(document.activeElement).toBe(submenuTrigger);
    });

    it('supports closing a vertical submenu with Left Arrow', async () => {
        const { menu, submenuTrigger, submenu, submenuItems } =
            await createMenuWithSubmenu();

        menu.showPopover();
        submenuTrigger.focus();

        pressKey(submenuTrigger, 'ArrowRight');
        expect(submenu.matches(':popover-open')).toBe(true);
        expect(document.activeElement).toBe(submenuItems[0]);

        pressKey(submenuItems[0], 'ArrowLeft');
        expect(submenu.matches(':popover-open')).toBe(false);
        expect(document.activeElement).toBe(submenuTrigger);
    });

    it('supports opening submenus with click', async () => {
        const { menu, submenuTrigger, submenu } = await createMenuWithSubmenu();

        menu.showPopover();
        click(submenuTrigger);

        expect(menu.matches(':popover-open')).toBe(true);
        expect(submenu.matches(':popover-open')).toBe(true);
    });

    it('supports opening submenus with Enter and Space', async () => {
        const { menu, submenuTrigger, submenu, submenuItems } =
            await createMenuWithSubmenu();

        menu.showPopover();
        submenuTrigger.focus();

        pressKey(submenuTrigger, 'Enter');
        expect(submenu.matches(':popover-open')).toBe(true);
        expect(document.activeElement).toBe(submenuItems[0]);

        submenu.hidePopover();
        submenuTrigger.focus();

        pressKey(submenuTrigger, ' ');
        expect(submenu.matches(':popover-open')).toBe(true);
        expect(document.activeElement).toBe(submenuItems[0]);
    });

    it('supports hover-driven submenu changes', async () => {
        const { menu, items, submenuTrigger, submenu } =
            await createMenuWithSubmenu();

        menu.showPopover();
        hover(submenuTrigger);

        expect(document.activeElement).toBe(submenuTrigger);
        expect(submenu.matches(':popover-open')).toBe(true);

        hover(items[0]);
        expect(document.activeElement).toBe(items[0]);
        expect(submenu.matches(':popover-open')).toBe(false);
    });

    it('supports closing the menu tree from item activation, Escape, and Tab', async () => {
        const { menu, items } = await createMenu();

        menu.showPopover();
        click(items[0]);
        expect(menu.matches(':popover-open')).toBe(false);

        menu.showPopover();
        items[0].focus();
        pressKey(items[0], 'Escape');
        expect(menu.matches(':popover-open')).toBe(false);

        menu.showPopover();
        items[0].focus();
        pressKey(items[0], 'Tab');
        expect(menu.matches(':popover-open')).toBe(false);
    });

    it('supports typeahead from the current item with wrapping and repeated characters', async () => {
        const { menu, items } = await createMenu([
            'Apple',
            'Banana',
            'Blueberry',
        ]);

        menu.showPopover();
        items[1].focus();

        pressKey(items[1], 'b');
        expect(document.activeElement).toBe(items[2]);

        pressKey(items[2], 'b');
        expect(document.activeElement).toBe(items[1]);

        vi.advanceTimersByTime(MenuElement.searchDelay);
        items[2].focus();
        pressKey(items[2], 'a');
        expect(document.activeElement).toBe(items[0]);
    });

    it('registers document listeners only for root popover menus', async () => {
        const addSpy = vi.spyOn(document, 'addEventListener');

        const { menu, submenu } = await createMenuWithSubmenu();

        expect(addSpy).toHaveBeenCalledWith(
            'click',
            (menu as unknown as { onDocumentClick: EventListener }).onDocumentClick
        );
        expect(addSpy).toHaveBeenCalledWith(
            'keydown',
            (menu as unknown as { onDocumentKeyDown: EventListener }).onDocumentKeyDown
        );
        expect(addSpy).not.toHaveBeenCalledWith(
            'click',
            (submenu as unknown as { onDocumentClick: EventListener })
                .onDocumentClick
        );
        expect(addSpy).not.toHaveBeenCalledWith(
            'keydown',
            (submenu as unknown as { onDocumentKeyDown: EventListener })
                .onDocumentKeyDown
        );
    });
});
