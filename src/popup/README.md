# Popup

**A custom element for building accessible popups.**

Usually you will want to compose this element with the [Menu](../menu) element to create a "menu button".

```js
import { PopupElement } from 'inclusive-elements';

window.customElements.define('ui-popup', PopupElement);
```

```html
<ui-popup placement="bottom-start">
  <button type="button">
    Open Popup <span aria-hidden="true">&#x25be;</span>
  </button>
  <div hidden>
    Popup content
  </div>
</ui-popup>
```

## Behavior

- The first descendant that is a `<button>` or has `role="button"` will be given the attributes `aria-haspopup="true"` and `aria-expanded`, which will reflect the open state of the popup.

- Clicking the button, or pressing the Down Arrow key while it is focused, will open the popup. The `hidden` attribute will be removed from the content element. The content element will be positioned next to the trigger element using [Placement.js](https://github.com/tobyzerner/placement.js) as per the `placement` attribute.

- The popup will be closed, and focus returned to the button, if:
    - The backdrop is clicked.
    - The Escape or Tab key is pressed.
    - A child with a `role` beginning with `menuitem` is clicked. 
    
## API

```js
const popup = document.querySelector('ui-popup');

popup.open = true;

popup.addEventListener('open', callback);
popup.addEventListener('close', callback);
```

```css
/* Style the backdrop */
ui-popup::part(backdrop) {
}

/* Transitions using hello-goodbye */
ui-popup > .enter-active,
ui-popup > .leave-active {
  transition: all .5s;
}

ui-popup > .enter-from,
ui-popup > .leave-to {
  opacity: 0;
  transform: scale(0.5);
}
```

## Further Reading

- [WAI-ARIA Authoring Practices: Menu Button](https://w3c.github.io/aria-practices/#menubutton)
