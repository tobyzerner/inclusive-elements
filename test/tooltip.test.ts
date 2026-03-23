import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TooltipElement from '../src/tooltip/tooltip';

if (!customElements.get('ui-tooltip')) {
    customElements.define('ui-tooltip', TooltipElement);
}

type TooltipWithPopoverState = TooltipElement & {
    _open?: boolean;
    showPopover: (options?: { source?: HTMLElement }) => void;
    hidePopover: () => void;
};

function dispatchToggle(
    tooltip: TooltipElement,
    newState: 'open' | 'closed'
): void {
    const event = new Event('toggle', { bubbles: false });
    Object.defineProperty(event, 'newState', {
        value: newState,
    });
    tooltip.dispatchEvent(event);
}

async function flushMicrotasks(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
}

function createTooltip(
    options: {
        ownerId?: string;
        forId?: string;
        attachOwner?: boolean;
    } = {}
): { owner: HTMLButtonElement; tooltip: TooltipWithPopoverState } {
    const owner = document.createElement('button');
    owner.type = 'button';
    owner.textContent = 'Save';

    if (options.ownerId) {
        owner.id = options.ownerId;
    }

    const tooltip = document.createElement(
        'ui-tooltip'
    ) as TooltipWithPopoverState;
    tooltip.textContent = 'Save changes';

    if (options.forId) {
        tooltip.setAttribute('for', options.forId);
    }

    tooltip.showPopover = () => {
        tooltip._open = true;
        dispatchToggle(tooltip, 'open');
    };

    tooltip.hidePopover = () => {
        tooltip._open = false;
        dispatchToggle(tooltip, 'closed');
    };

    const matches = tooltip.matches.bind(tooltip);
    tooltip.matches = ((selector: string) => {
        if (selector === ':popover-open') {
            return tooltip._open === true;
        }

        return matches(selector);
    }) as typeof tooltip.matches;

    if (options.attachOwner === false) {
        document.body.append(tooltip);
    } else {
        document.body.append(owner, tooltip);
    }

    return { owner, tooltip };
}

beforeEach(() => {
    vi.stubGlobal('CSS', {
        escape: (value: string) => value,
    });
    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
            media: '',
            onchange: null,
        }))
    );
});

afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
});

describe('TooltipElement', () => {
    it('applies default tooltip semantics and describes its owner', async () => {
        const { owner, tooltip } = createTooltip();
        await flushMicrotasks();

        expect(tooltip.getAttribute('popover')).toBe('hint');
        expect(tooltip.getAttribute('role')).toBe('tooltip');
        expect(tooltip.id).toBeTruthy();
        expect(owner.getAttribute('aria-describedby')).toContain(tooltip.id);
    });

    it('supports showing on owner focus and hiding on blur', async () => {
        const { owner, tooltip } = createTooltip();
        const matches = owner.matches.bind(owner);
        owner.matches = ((selector: string) => {
            if (selector === ':focus-visible') {
                return true;
            }

            return matches(selector);
        }) as typeof owner.matches;
        await flushMicrotasks();

        owner.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        expect(tooltip.matches(':popover-open')).toBe(true);

        owner.dispatchEvent(
            new FocusEvent('focusout', { bubbles: true, relatedTarget: null })
        );
        expect(tooltip.matches(':popover-open')).toBe(false);
    });

    it('supports Escape dismissal while open', () => {
        const { tooltip } = createTooltip();

        tooltip.show();
        expect(tooltip.matches(':popover-open')).toBe(true);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(tooltip.matches(':popover-open')).toBe(false);
    });

    it('ignores Escape after closing or disconnecting', () => {
        const { tooltip } = createTooltip();
        const hideSpy = vi.spyOn(tooltip, 'hide');

        tooltip.show();
        tooltip.hide();
        hideSpy.mockClear();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(hideSpy).not.toHaveBeenCalled();

        tooltip.show();
        tooltip.remove();
        hideSpy.mockClear();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(hideSpy).not.toHaveBeenCalled();
    });

    it('supports adjacent sibling ownership when the sibling changes', async () => {
        const { owner, tooltip } = createTooltip();
        await flushMicrotasks();

        expect(owner.getAttribute('aria-describedby')).toContain(tooltip.id);

        const replacement = document.createElement('button');
        replacement.type = 'button';
        replacement.textContent = 'Share';

        document.body.insertBefore(replacement, tooltip);
        owner.remove();
        await flushMicrotasks();

        expect(owner.hasAttribute('aria-describedby')).toBe(false);
        expect(replacement.getAttribute('aria-describedby')).toContain(
            tooltip.id
        );
    });

    it('supports explicit ownership when the referenced target appears later', async () => {
        const { tooltip } = createTooltip({
            forId: 'share-button',
            attachOwner: false,
        });
        await flushMicrotasks();

        const lateOwner = document.createElement('button');
        lateOwner.type = 'button';
        lateOwner.id = 'share-button';
        lateOwner.textContent = 'Share';
        document.body.prepend(lateOwner);
        await flushMicrotasks();

        expect(lateOwner.hasAttribute('aria-describedby')).toBe(false);

        tooltip.show();

        expect(tooltip.matches(':popover-open')).toBe(true);
        expect(lateOwner.getAttribute('aria-describedby')).toContain(
            tooltip.id
        );
    });

    it('supports changing explicit ownership with the for attribute', async () => {
        const { owner, tooltip } = createTooltip({
            ownerId: 'share-button',
            forId: 'share-button',
        });
        const nextOwner = document.createElement('button');
        nextOwner.type = 'button';
        nextOwner.id = 'copy-button';
        nextOwner.textContent = 'Copy';
        document.body.insertBefore(nextOwner, tooltip);
        await flushMicrotasks();

        expect(owner.getAttribute('aria-describedby')).toContain(tooltip.id);

        tooltip.setAttribute('for', 'copy-button');
        await flushMicrotasks();

        expect(owner.hasAttribute('aria-describedby')).toBe(false);
        expect(nextOwner.getAttribute('aria-describedby')).toContain(
            tooltip.id
        );
    });

    it('supports rebinding the owner while open', async () => {
        const { owner, tooltip } = createTooltip({
            ownerId: 'share-button',
            forId: 'share-button',
        });
        const nextOwner = document.createElement('button');

        nextOwner.type = 'button';
        nextOwner.id = 'copy-button';
        nextOwner.textContent = 'Copy';
        document.body.insertBefore(nextOwner, tooltip);
        await flushMicrotasks();

        tooltip.show();
        expect(tooltip.matches(':popover-open')).toBe(true);

        tooltip.setAttribute('for', 'copy-button');
        await flushMicrotasks();

        expect(tooltip.matches(':popover-open')).toBe(false);
        expect(owner.hasAttribute('aria-describedby')).toBe(false);
        expect(nextOwner.getAttribute('aria-describedby')).toContain(
            tooltip.id
        );
    });

    it('supports enabling and disabling the tooltip owner relationship', async () => {
        const { owner, tooltip } = createTooltip();
        await flushMicrotasks();

        expect(owner.getAttribute('aria-describedby')).toContain(tooltip.id);

        tooltip.disabled = true;
        await flushMicrotasks();

        expect(owner.hasAttribute('aria-describedby')).toBe(false);

        tooltip.disabled = false;
        await flushMicrotasks();

        expect(owner.getAttribute('aria-describedby')).toContain(tooltip.id);
    });

    it('does not show when the resolved owner is disabled', async () => {
        const { owner, tooltip } = createTooltip();
        await flushMicrotasks();

        owner.disabled = true;
        tooltip.show();

        expect(tooltip.matches(':popover-open')).toBe(false);
    });

    it('reflects the disabled property to the attribute', () => {
        const { tooltip } = createTooltip();

        tooltip.disabled = true;
        expect(tooltip.hasAttribute('disabled')).toBe(true);

        tooltip.disabled = false;
        expect(tooltip.hasAttribute('disabled')).toBe(false);
    });
});
