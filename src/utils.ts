import { enter, leave } from 'transition-kit';

/**
 * Determine whether the user is trying to open a link in a new tab.
 */
export function shouldOpenInNewTab(e: MouseEvent): boolean {
    return (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        (e.button !== undefined && e.button !== 0)
    );
}

/**
 * Unhide an element and run its enter transition.
 */
export function show(el: HTMLElement): void {
    el.hidden = false;
    enter(el);
}

/**
 * Determine whether an element's leave transition is still running, in which
 * case it is visible but should be treated as hidden.
 */
export function isLeaving(el: HTMLElement): boolean {
    return el.classList.contains('leave-active');
}

/**
 * Run an element's leave transition, then hide it. If the element is shown
 * again before the transition finishes, it stays visible.
 */
export function hide(el: HTMLElement): void {
    leave(el, { detachFromLayout: false }).then(
        (completed) => completed && (el.hidden = true)
    );
}
