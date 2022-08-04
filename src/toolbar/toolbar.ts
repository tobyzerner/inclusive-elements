import { focusable } from 'tabbable';

export default class ToolbarElement extends HTMLElement {
    connectedCallback(): void {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'toolbar');
        }

        this.setAttribute('tabindex', '0');
        this.addEventListener('focus', this.onInitialFocus, { once: true });
        this.addEventListener('keydown', this.onKeyDown);
    }

    disconnectedCallback(): void {
        this.removeEventListener('keydown', this.onKeyDown);
    }

    private onInitialFocus = (): void => {
        this.removeAttribute('tabindex');
        this.focusControlAtIndex(0);
    };

    private onKeyDown = (e: KeyboardEvent): void => {
        if (
            e.key !== 'ArrowRight' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'Home' &&
            e.key !== 'End'
        )
            return;

        const controls = this.controls;
        const length = this.controls.length;
        const index = controls.indexOf(e.target as HTMLElement);
        if (index === -1) return;

        let n = 0;
        if (e.key === 'ArrowLeft') n = index - 1;
        if (e.key === 'ArrowRight') n = index + 1;
        if (e.key === 'End') n = length - 1;
        if (n < 0) n = length - 1;
        if (n > length - 1) n = 0;

        this.focusControlAtIndex(n);

        e.preventDefault();
    };

    private focusControlAtIndex(index: number): void {
        this.controls.forEach((control, i) => {
            if (i === index) {
                control.setAttribute('tabindex', '0');
                control.focus();
            } else {
                control.setAttribute('tabindex', '-1');
            }
        });
    }

    private get controls() {
        return focusable(this);
    }
}
