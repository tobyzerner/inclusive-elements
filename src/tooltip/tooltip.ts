import { createQueuedSync } from '../utils';

let tooltipIdCounter = 0;

type ManagedDescription = {
    owner: HTMLElement;
    id: string;
};

export default class TooltipElement extends HTMLElement {
    public static delay: number = 100;
    public static observedAttributes = ['disabled', 'for', 'id'];

    private owner?: HTMLElement;
    private timeout?: number;
    private sync = createQueuedSync(this, () => this.syncOwner());
    private ownerObserver?: MutationObserver;
    private siblingObserver?: MutationObserver;
    private managedDescription?: ManagedDescription;

    public connectedCallback(): void {
        if (!this.hasAttribute('popover')) {
            this.setAttribute('popover', 'hint');
        }

        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'tooltip');
        }

        this.ensureTooltipId();

        this.addEventListener('toggle', this.onToggle);
        this.addEventListener('pointerenter', this.onTooltipPointerEnter);
        this.addEventListener('pointerleave', this.onInteractivePointerLeave);

        this.syncOwner();
    }

    public disconnectedCallback(): void {
        this.removeEventListener('toggle', this.onToggle);
        this.removeEventListener('pointerenter', this.onTooltipPointerEnter);
        this.removeEventListener(
            'pointerleave',
            this.onInteractivePointerLeave
        );

        this.ownerDocument.removeEventListener(
            'keydown',
            this.onDocumentKeyDown
        );

        this.siblingObserver?.disconnect();
        this.sync.disconnect();

        this.setOwner(undefined);

        clearTimeout(this.timeout);
    }

    public attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        if (!this.isConnected || oldValue === newValue) return;

        if (name === 'id' && !newValue) {
            this.ensureTooltipId();
        }

        this.syncOwner();
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    public show(owner: HTMLElement | undefined = this.resolveOwner()) {
        clearTimeout(this.timeout);

        this.syncOwner(owner);

        const resolvedOwner = this.owner;
        if (!resolvedOwner || this.matches(':popover-open')) {
            return;
        }

        (
            this as HTMLElement & {
                showPopover?: (options?: { source?: HTMLElement }) => void;
            }
        ).showPopover?.({ source: resolvedOwner });
    }

    public hide() {
        clearTimeout(this.timeout);

        if (this.matches(':popover-open')) {
            this.hidePopover();
        }
    }

    private onToggle = (e: Event) => {
        if (e.target !== this) return;

        if ((e as ToggleEvent).newState === 'open') {
            this.ownerDocument.addEventListener(
                'keydown',
                this.onDocumentKeyDown
            );
            return;
        }

        this.ownerDocument.removeEventListener(
            'keydown',
            this.onDocumentKeyDown
        );
    };

    private onDocumentKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this.hide();
        }
    };

    private syncOwner(owner: HTMLElement | undefined = this.resolveOwner()) {
        this.siblingObserver ??= new MutationObserver(this.sync.queue);
        this.siblingObserver.disconnect();

        if (!this.hasAttribute('for') && this.parentElement) {
            this.siblingObserver.observe(this.parentElement, {
                childList: true,
            });
        }

        if (!owner) {
            this.hide();
            this.setOwner(undefined);
            return;
        }

        if (
            this.owner &&
            this.owner !== owner &&
            this.matches(':popover-open')
        ) {
            this.hide();
        }

        this.setOwner(owner);
    }

    private resolveOwner(owner?: HTMLElement): HTMLElement | undefined {
        const candidate =
            owner ??
            (this.hasAttribute('for')
                ? this.resolveExplicitOwner()
                : this.previousElementSibling instanceof HTMLElement
                ? this.previousElementSibling
                : undefined);

        if (
            this.disabled ||
            !candidate ||
            !candidate.isConnected ||
            candidate === this ||
            this.isOwnerDisabled(candidate)
        ) {
            return undefined;
        }

        return candidate;
    }

    private resolveExplicitOwner(): HTMLElement | undefined {
        const ownerId = this.getAttribute('for');
        if (!ownerId) return undefined;

        const root = this.getRootNode();
        const owner =
            (root instanceof ShadowRoot &&
                root.querySelector(`#${CSS.escape(ownerId)}`)) ||
            this.ownerDocument.getElementById(ownerId);

        return owner instanceof HTMLElement ? owner : undefined;
    }

    private setOwner(owner: HTMLElement | undefined) {
        const ownerChanged = this.owner !== owner;

        if (ownerChanged && this.owner) {
            this.owner.removeEventListener('focusin', this.onOwnerFocusIn);
            this.owner.removeEventListener('focusout', this.onOwnerFocusOut);
            this.owner.removeEventListener(
                'pointerenter',
                this.onOwnerPointerEnter
            );
            this.owner.removeEventListener(
                'pointerleave',
                this.onInteractivePointerLeave
            );
            this.owner.removeEventListener('click', this.onOwnerClick);
        }

        this.owner = owner;
        this.updateManagedDescription(owner);

        this.ownerObserver?.disconnect();
        if (!owner) return;

        this.ownerObserver ??= new MutationObserver(this.sync.queue);

        this.ownerObserver.observe(owner, {
            attributes: true,
            attributeFilter: ['aria-describedby', 'aria-disabled', 'disabled'],
        });

        if (ownerChanged) {
            owner.addEventListener('focusin', this.onOwnerFocusIn);
            owner.addEventListener('focusout', this.onOwnerFocusOut);
            owner.addEventListener('pointerenter', this.onOwnerPointerEnter);
            owner.addEventListener(
                'pointerleave',
                this.onInteractivePointerLeave
            );
            owner.addEventListener('click', this.onOwnerClick);
        }
    }

    private onOwnerFocusIn = (): void => {
        if (!this.owner || !this.owner.matches(':focus-visible')) return;
        this.show(this.owner);
    };

    private onOwnerFocusOut = (e: FocusEvent): void => {
        if (this.containsInteractiveTarget(e.relatedTarget)) {
            return;
        }

        this.hide();
    };

    private onOwnerPointerEnter = (e: PointerEvent): void => {
        if (!this.supportsHoverInteraction(e)) return;
        if (!this.owner) return;
        if (this.containsInteractiveTarget(e.relatedTarget)) return;

        this.afterDelay(() => this.show(this.owner));
    };

    private onTooltipPointerEnter = (e: PointerEvent): void => {
        if (!this.supportsHoverInteraction(e)) return;

        if (!this.containsInteractiveTarget(e.relatedTarget)) {
            clearTimeout(this.timeout);
        }
    };

    private onInteractivePointerLeave = (e: PointerEvent): void => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        if (this.containsInteractiveTarget(e.relatedTarget)) {
            return;
        }

        this.afterDelay(this.hide);
    };

    private onOwnerClick = (): void => {
        this.hide();
    };

    private afterDelay(callback: () => void) {
        clearTimeout(this.timeout);
        const delay = parseInt(this.getAttribute('delay') || '');
        this.timeout = window.setTimeout(
            callback,
            isNaN(delay) ? TooltipElement.delay : delay
        );
    }

    private containsInteractiveTarget(
        target: EventTarget | null
    ): target is Node {
        return (
            target instanceof Node &&
            (this.contains(target) ||
                (!!this.owner && this.owner.contains(target)))
        );
    }

    private updateManagedDescription(owner: HTMLElement | undefined) {
        const tooltipId = owner ? this.ensureTooltipId() : undefined;

        if (
            this.managedDescription &&
            (this.managedDescription.owner !== owner ||
                this.managedDescription.id !== tooltipId)
        ) {
            const managedDescription = this.managedDescription;
            const tokens = this.getDescriptionTokens(
                managedDescription.owner
            ).filter((token) => token !== managedDescription.id);

            if (tokens.length) {
                managedDescription.owner.setAttribute(
                    'aria-describedby',
                    tokens.join(' ')
                );
            } else {
                managedDescription.owner.removeAttribute('aria-describedby');
            }

            this.managedDescription = undefined;
        }

        if (!owner || !tooltipId || this.managedDescription) return;

        const tokens = this.getDescriptionTokens(owner);
        if (tokens.includes(tooltipId)) return;

        owner.setAttribute(
            'aria-describedby',
            [...tokens, tooltipId].join(' ')
        );
        this.managedDescription = { owner, id: tooltipId };
    }

    private getDescriptionTokens(owner: HTMLElement): string[] {
        return (owner.getAttribute('aria-describedby') || '')
            .split(/\s+/)
            .filter(Boolean);
    }

    private ensureTooltipId(): string {
        if (!this.id) {
            this.id = `ui-tooltip-${++tooltipIdCounter}`;
        }

        return this.id;
    }

    private supportsHoverInteraction(event: PointerEvent): boolean {
        return (
            (!event.pointerType || event.pointerType === 'mouse') &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches
        );
    }

    private isOwnerDisabled(owner: HTMLElement): boolean {
        return (
            owner.hasAttribute('disabled') ||
            owner.getAttribute('aria-disabled') === 'true'
        );
    }
}
