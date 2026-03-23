import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AlertOptions } from '../src/alerts/alerts';
import AlertsElement from '../src/alerts/alerts';

const transitionKit = vi.hoisted(() => {
    return {
        cancel: vi.fn(),
        enter: vi.fn(() => Promise.resolve(true)),
        leave: vi.fn(() => Promise.resolve(true)),
        move: vi.fn((elements: HTMLElement[], callback: () => void) => {
            callback();
            return elements;
        }),
    };
});

vi.mock('transition-kit', () => ({
    cancel: transitionKit.cancel,
    enter: transitionKit.enter,
    leave: transitionKit.leave,
    move: transitionKit.move,
}));

if (!customElements.get('ui-alerts')) {
    customElements.define('ui-alerts', AlertsElement);
}

function createAlerts(): AlertsElement {
    const alerts = document.createElement('ui-alerts') as AlertsElement;
    document.body.append(alerts);
    return alerts;
}

function createAlert(text: string): HTMLDivElement {
    const alert = document.createElement('div');
    alert.textContent = text;
    return alert;
}

async function flushMicrotasks(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    document.body.innerHTML = '';
});

describe('AlertsElement', () => {
    it('announces alerts politely by default and dismisses them after the duration', async () => {
        const alerts = createAlerts();
        const alert = createAlert('Saved');

        alerts.show(alert, { duration: 100 });

        expect(alert.getAttribute('role')).toBe('status');
        expect(alert.getAttribute('aria-live')).toBe('polite');

        vi.advanceTimersByTime(100);
        await flushMicrotasks();

        expect(alerts.contains(alert)).toBe(false);
    });

    it('replaces an existing alert when show() reuses a key', async () => {
        const alerts = createAlerts();
        const first = createAlert('First');
        const second = createAlert('Second');
        const options: AlertOptions = { key: 'save-complete', duration: 0 };

        alerts.show(first, options);
        alerts.show(second, options);
        await flushMicrotasks();

        expect(Array.from(alerts.children)).toEqual([second]);
        expect(transitionKit.leave).toHaveBeenCalledWith(first);
    });

    it('pauses dismissal on hover and restarts it on pointer exit', async () => {
        const alerts = createAlerts();
        const alert = createAlert('Hover me');

        alerts.show(alert, { duration: 100 });
        vi.advanceTimersByTime(50);

        alert.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        vi.advanceTimersByTime(200);
        await flushMicrotasks();

        expect(alerts.contains(alert)).toBe(true);

        alert.dispatchEvent(
            new MouseEvent('mouseout', {
                bubbles: true,
                relatedTarget: document.body,
            })
        );
        vi.advanceTimersByTime(100);
        await flushMicrotasks();

        expect(alerts.contains(alert)).toBe(false);
    });

    it('pauses dismissal on focus and restarts it on focus exit', async () => {
        const alerts = createAlerts();
        const alert = createAlert('Focusable');
        const button = document.createElement('button');

        button.type = 'button';
        button.textContent = 'Undo';
        alert.append(button);

        alerts.show(alert, { duration: 100 });
        vi.advanceTimersByTime(50);

        button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        vi.advanceTimersByTime(200);
        await flushMicrotasks();

        expect(alerts.contains(alert)).toBe(true);

        button.dispatchEvent(
            new FocusEvent('focusout', {
                bubbles: true,
                relatedTarget: document.body,
            })
        );
        vi.advanceTimersByTime(100);
        await flushMicrotasks();

        expect(alerts.contains(alert)).toBe(false);
    });

    it('supports speak() for plain text announcements', () => {
        const alerts = createAlerts();

        alerts.speak('A polite message', { duration: 0 });

        const alert = alerts.firstElementChild as HTMLElement;

        expect(alert.textContent).toBe('A polite message');
        expect(alert.getAttribute('role')).toBe('status');
        expect(alert.getAttribute('aria-live')).toBe('polite');
    });
});
