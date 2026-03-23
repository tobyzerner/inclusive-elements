import { afterEach, describe, expect, it, vi } from 'vitest';
import ToolbarElement from '../src/toolbar/toolbar';

vi.mock('tabbable', () => ({
    focusable: (container: HTMLElement) =>
        Array.from(container.querySelectorAll<HTMLElement>('button')).filter(
            (control) =>
                !control.hidden &&
                !control.hasAttribute('disabled') &&
                control.getAttribute('aria-disabled') !== 'true'
        ),
}));

if (!customElements.get('ui-toolbar')) {
    customElements.define('ui-toolbar', ToolbarElement);
}

function flushMicrotasks(): Promise<void> {
    return Promise.resolve().then(() => Promise.resolve());
}

function createToolbar(attributes: Record<string, string> = {}) {
    const toolbar = document.createElement('ui-toolbar');

    Object.entries(attributes).forEach(([name, value]) => {
        toolbar.setAttribute(name, value);
    });

    const controls = ['One', 'Two', 'Three', 'Four'].map((label) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        toolbar.append(button);
        return button;
    });

    document.body.append(toolbar);

    return { toolbar, controls };
}

function focusToolbar(toolbar: HTMLElement): void {
    toolbar.focus();
}

function pressKey(target: HTMLElement, key: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('ToolbarElement', () => {
    it('uses the toolbar as a single tab stop and moves focus into the current control', async () => {
        const { toolbar, controls } = createToolbar();
        await flushMicrotasks();

        expect(toolbar.getAttribute('role')).toBe('toolbar');
        expect(toolbar.getAttribute('tabindex')).toBe('0');

        focusToolbar(toolbar);

        expect(document.activeElement).toBe(controls[0]);
        expect(toolbar.hasAttribute('tabindex')).toBe(false);
        expect(controls[0].getAttribute('tabindex')).toBe('0');
        expect(controls[1].getAttribute('tabindex')).toBe('-1');
    });

    it('supports horizontal roving focus by default', async () => {
        const { toolbar, controls } = createToolbar();
        await flushMicrotasks();

        focusToolbar(toolbar);
        pressKey(controls[0], 'ArrowRight');

        expect(controls[1].getAttribute('tabindex')).toBe('0');
        expect(controls[0].getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(controls[1]);
    });

    it('supports vertical roving focus when aria-orientation is vertical', async () => {
        const { toolbar, controls } = createToolbar({
            'aria-orientation': 'vertical',
        });
        await flushMicrotasks();

        focusToolbar(toolbar);
        pressKey(controls[0], 'ArrowDown');

        expect(controls[1].getAttribute('tabindex')).toBe('0');
        expect(controls[0].getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(controls[1]);
    });

    it('navigates across enabled controls only', async () => {
        const { toolbar, controls } = createToolbar({
            'aria-orientation': 'vertical',
        });
        await flushMicrotasks();

        controls[1].disabled = true;
        controls[2].hidden = true;
        await flushMicrotasks();

        focusToolbar(toolbar);
        pressKey(controls[0], 'ArrowDown');

        expect(controls[3].getAttribute('tabindex')).toBe('0');
        expect(controls[0].getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(controls[3]);
    });

    it('supports Home and End navigation', async () => {
        const { toolbar, controls } = createToolbar({
            'aria-orientation': 'vertical',
        });
        await flushMicrotasks();

        focusToolbar(toolbar);
        pressKey(controls[0], 'End');
        pressKey(controls[3], 'Home');

        expect(controls[0].getAttribute('tabindex')).toBe('0');
        expect(controls[3].getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(controls[0]);
    });

    it('keeps roving tabindex in sync when controls are added or removed', async () => {
        const { toolbar, controls } = createToolbar();
        await flushMicrotasks();

        const added = document.createElement('button');
        added.type = 'button';
        added.textContent = 'Five';
        toolbar.append(added);
        await flushMicrotasks();

        focusToolbar(toolbar);
        pressKey(controls[0], 'End');

        expect(added.getAttribute('tabindex')).toBe('0');
        expect(document.activeElement).toBe(added);

        added.remove();
        await flushMicrotasks();

        expect(controls[0].getAttribute('tabindex')).toBe('0');
    });
});
