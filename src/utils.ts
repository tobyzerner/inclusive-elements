export function createQueuedSync(element: HTMLElement, sync: () => void) {
    let queued = false;

    const queue = () => {
        if (queued) return;

        queued = true;

        queueMicrotask(() => {
            queued = false;

            if (element.isConnected) {
                sync();
            }
        });
    };

    return {
        queue,
        disconnect() {
            queued = false;
        },
    };
}

export function createQueuedElementSync(
    element: HTMLElement,
    options: MutationObserverInit,
    sync: () => void
) {
    const queuedSync = createQueuedSync(element, sync);

    const observer = new MutationObserver(queuedSync.queue);

    return {
        observe() {
            observer.observe(element, options);
        },
        disconnect() {
            observer.disconnect();
            queuedSync.disconnect();
        },
        queue: queuedSync.queue,
    };
}

export function getLookupRoot(element: HTMLElement): Document | ShadowRoot {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : element.ownerDocument;
}

export function getRovingIndexForKey(
    key: string,
    options: {
        currentIndex: number;
        length: number;
        vertical: boolean;
    }
): number | undefined {
    const { currentIndex, length, vertical } = options;

    if (length === 0 || currentIndex < 0 || currentIndex >= length) {
        return undefined;
    }

    if (key === (vertical ? 'ArrowUp' : 'ArrowLeft')) {
        return (currentIndex - 1 + length) % length;
    }

    if (key === (vertical ? 'ArrowDown' : 'ArrowRight')) {
        return (currentIndex + 1) % length;
    }

    if (key === 'Home') {
        return 0;
    }

    if (key === 'End') {
        return length - 1;
    }

    return undefined;
}
