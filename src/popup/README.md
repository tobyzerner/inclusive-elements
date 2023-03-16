# Popup

**A custom element for building accessible popup disclosure widgets and menu buttons.**

Popup is [an ill-defined term](https://adrianroselli.com/2021/07/stop-using-pop-up.html), but this popup element is intended to fulfill two specific use-cases:

-   A **disclosure widget** where the disclosed content "pops up" as an overlay positioned adjacent to the trigger.
-   A **menu button** where the popup content is a [Menu](../menu) element.

## Example

```js
import { PopupElement } from 'inclusive-elements';

window.customElements.define('ui-popup', PopupElement);
```

```html
<ui-popup placement="bottom-start">
    <button type="button">
        Open Popup <span aria-hidden="true">&#x25be;</span>
    </button>
    <div hidden>Popup content</div>
</ui-popup>
```

## Behavior

-   The first descendant that is a `<button>` or has `role="button"` will be given the `aria-expanded` attribute, which will reflect the open state of the popup. If the popup content has `role="menu"`, then the popup button will also be given the `aria-haspopup="true"` attribute.

-   Clicking the button, or pressing the Down Arrow key while it is focused, will open the popup. The `hidden` attribute will be removed from the content element. The content element will be positioned next to the trigger element using [Floating UI](https://floating-ui.com) as per the `placement` attribute.

-   The popup will be closed, and focus returned to the button, if:
    -   The backdrop outside of the popup content is clicked.
    -   The Escape key is pressed, or the user Tabs out of the popup.
    -   A child with a `role` beginning with `menuitem` is clicked.

## API

```js
const popup = document.querySelector('ui-popup');

// Programatically open and close the popup.
popup.open = true;

popup.addEventListener('open', callback);
popup.addEventListener('close', callback);
```

```css
/* Optionally style the backdrop */
ui-popup::part(backdrop) {
}

/* Transitions can be applied to the popup using hello-goodbye */
@media (prefers-reduced-motion: no-preference) {
    ui-popup > .enter-active,
    ui-popup > .leave-active {
        transition: all 0.5s;
    }

    ui-popup > .enter-from,
    ui-popup > .leave-to {
        opacity: 0;
        transform: scale(0.5);
    }
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
-   [ARIA Authoring Practices Guide: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
-   [Adrian Roselli: Stop Using 'Pop-up'](https://adrianroselli.com/2021/07/stop-using-pop-up.html)
