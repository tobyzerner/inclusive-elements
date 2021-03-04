# Modal

**A custom element for building accessible modal dialogs.**

Requires an [inert polyfill](https://github.com/WICG/inert).

```js
import { ModalElement } from 'inclusive-elements';
import 'wicg-inert';

window.customElements.define('ui-modal', ModalElement);
```

```html
<body>
  <ui-modal hidden>
    <div role="dialog" aria-labelledby="your-dialog-title-id">
      <button
        type="button" 
        aria-label="Close dialog" 
        onclick="this.closest('ui-modal').hidden = true"
      >&times;</button>
      
      <h2 id="your-dialog-title-id">Your dialog title</h2>
    </div>
  </ui-modal>
</body>
```

## Behavior

- The `<ui-modal>` element must be a direct child of `<body>`.

- It should contain a single child with the role `dialog` and an appropriate label. The `aria-modal` attribute will be automatically set to `true`.

- When the `open` attribute is added to the `<ui-modal>` element, the dialog is opened.

- Upon opening:
    - Focus will be moved to the first element inside the dialog that has the `autofocus` attribute. If none is found, focus will be moved to the dialog element itself.
    - The `inert` attribute will be added to all direct children of `<body>`.

- The dialog will be closed if:
    - The Escape key is pressed.
    - The backdrop is clicked, unless the `<ui-modal>` element has the `static` attribute.
    - The `open` attribute is removed, or the `close()` method is called.

- Upon closing:
    - Focus will be returned to the element that invoked the dialog. If this element has a role of `menuitem`, its associated menu button will be focused instead.
    - The `inert` attribute on all direct children of `<body>` will be set back to their previous values.

## API

```ts
// Play an animation when the backdrop is clicked on a `static` modal.
ModalElement.attention = (el: Element) => el.animate([
  { transform: 'scale(1)' },
  { transform: 'scale(1.1)' },
  { transform: 'scale(1)' }
], 300);

const modal = document.querySelector('ui-modal');

modal.open = true;

// Close the modal. You can also set open = false, 
// but this will bypass any `beforeclose` listeners.
modal.close();

modal.addEventListener('open', callback);
modal.addEventListener('beforeclose', e => e.preventDefault());
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

/* Transitions using hello-goodbye */
ui-modal.enter-active,
ui-modal.leave-active {
  transition: opacity .5s;
}

ui-modal.enter-from,
ui-modal.leave-to {
  opacity: 0;
}

ui-modal.enter-active::part(content),
ui-modal.leave-active::part(content) {
  transition: transform .5s;
}

ui-modal.enter-from::part(content),
ui-modal.leave-to::part(content) {
  transform: scale(0.5);
}
```

## Further Reading

- [WAI-ARIA Authoring Practices: Dialog (Modal)](https://w3c.github.io/aria-practices/#dialog_modal)
