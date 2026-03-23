import { focusable } from 'tabbable';
import {
    createQueuedElementSync,
    getLookupRoot,
    getRovingIndexForKey,
} from '../utils';

export default class ToolbarElement extends HTMLElement {
    private structureSync?: ReturnType<typeof createQueuedElementSync>;

    connectedCallback(): void {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'toolbar');
        }

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }

        this.addEventListener('focus', this.onFocus);
        this.addEventListener('keydown', this.onKeyDown);

        if (!this.structureSync) {
            this.structureSync = createQueuedElementSync(
                this,
                {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    attributeFilter: ['disabled', 'hidden', 'aria-disabled'],
                },
                () => this.syncControls()
            );
        }

        this.structureSync.observe();
        this.structureSync.queue();
    }

    disconnectedCallback(): void {
        this.removeEventListener('focus', this.onFocus);
        this.removeEventListener('keydown', this.onKeyDown);

        this.structureSync?.disconnect();
    }

    private onFocus = (event: FocusEvent): void => {
        if (event.target !== this) return;

        this.removeAttribute('tabindex');
        this.syncControls()?.focus();
    };

    private onKeyDown = (e: KeyboardEvent): void => {
        const controls = this.controls;
        const index = controls.indexOf(e.target as (typeof controls)[number]);
        if (index === -1) return;

        const nextIndex = getRovingIndexForKey(e.key, {
            currentIndex: index,
            length: controls.length,
            vertical: this.vertical,
        });
        if (nextIndex === undefined) return;

        const current = controls[nextIndex];
        this.syncCurrentControl(controls, current);
        current?.focus();

        e.preventDefault();
    };

    private syncControls(): ReturnType<typeof focusable>[number] | undefined {
        const controls = this.controls;

        if (!controls.length) {
            this.setAttribute('tabindex', '0');
            return;
        }

        const activeElement = getLookupRoot(this).activeElement;
        const current = this.hasAttribute('tabindex')
            ? controls[0]
            : controls.find((control) => control === activeElement) ||
              controls.find(
                  (control) => control.getAttribute('tabindex') === '0'
              ) ||
              controls[0];

        this.syncCurrentControl(controls, current);

        return current;
    }

    private syncCurrentControl(
        controls: ReturnType<typeof focusable>,
        current?: ReturnType<typeof focusable>[number]
    ): void {
        controls.forEach((control) => {
            control.setAttribute('tabindex', control === current ? '0' : '-1');
        });
    }

    private get vertical(): boolean {
        return this.getAttribute('aria-orientation') === 'vertical';
    }

    private get controls() {
        return focusable(this);
    }
}
