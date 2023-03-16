# Modal

**A custom element for building accessible modal dialogs.**

In a web context, a modal dialog is an element superimposed on the page that traps focus – that is, users cannot interact with content outside the modal dialog.

## Example

```js
import { ModalElement } from 'inclusive-elements';

window.customElements.define('ui-modal', ModalElement);
```

```html
<button onclick="document.getElementById('your-dialog').open = true">
    Open dialog
</button>

<ui-modal id="your-dialog" hidden>
    <div role="dialog" aria-labelledby="your-dialog-title">
        <button
            type="button"
            aria-label="Close dialog"
            onclick="document.getElementById('your-dialog').close()"
        >
            &times;
        </button>

        <h2 id="your-dialog-title">Your dialog title</h2>
    </div>
</ui-modal>
```

## Behavior

-   The `<ui-modal>` element should contain a single child with the role `dialog` or `alertdialog` and an appropriate label and description. The `aria-modal` attribute will be automatically set to `true`.

-   Set the `open` property of the `<ui-modal>` element to `true` to open the dialog.

-   Upon opening:

    -   The `hidden` attribute on the dialog is removed.
    -   Focus will be moved to the first element inside the dialog that has the `autofocus` attribute. If none is found, focus will be moved to the dialog element itself.
    -   A focus trap is activated, such that Tab and Shift + Tab do not move focus outside the dialog.

-   The dialog will be closed if:

    -   The Escape key is pressed.
    -   The backdrop is clicked, unless the `<ui-modal>` element has the `static` attribute.
    -   The `open` attribute is removed, or the `close()` method is called.

-   Upon closing:
    -   The `hidden` attribute on the dialog is reinstated.
    -   Focus will be returned to the element that was focused before the dialog was opened.
    -   The focus trap is deactivated.

## API

```ts
// Do something to call attention to the modal. This is called when the backdrop
// is clicked on a `static` modal. By default, the follow animation is used.
ModalElement.attention = (el: Element) =>
    el.animate(
        [
            { transform: 'scale(1)' },
            { transform: 'scale(1.1)' },
            { transform: 'scale(1)' },
        ],
        300
    );

const modal = document.querySelector('ui-modal');

// Open the modal.
modal.open = true;

// Close the modal. You can also set open = false,
// but this will bypass any `beforeclose` listeners.
modal.close();

modal.addEventListener('open', callback);
modal.addEventListener('beforeclose', (e) => e.preventDefault());
modal.addEventListener('close', callback);
```

```css
/* Style the modal container */
ui-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Style the backdrop */
ui-modal::part(backdrop) {
    background: rgba(0, 0, 0, 0.5);
}

/* Transitions can be applied to the modal and its parts using hello-goodbye */
@media (prefers-reduced-motion: no-preference) {
    ui-modal.enter-active,
    ui-modal.leave-active {
        transition: opacity 0.5s;
    }

    ui-modal.enter-from,
    ui-modal.leave-to {
        opacity: 0;
    }

    ui-modal.enter-active::part(content),
    ui-modal.leave-active::part(content) {
        transition: transform 0.5s;
    }

    ui-modal.enter-from::part(content),
    ui-modal.leave-to::part(content) {
        transform: scale(0.5);
    }
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
