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
