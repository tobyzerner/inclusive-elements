# Disclosure Widget

**A custom element for building accessible disclosure widgets.**

## Example

```js
import { DisclosureElement } from 'inclusive-elements';

window.customElements.define('ui-disclosure', DisclosureElement);
```

```html
<ui-disclosure>
    <button type="button">Summary</button>
    <div>Details</div>
</ui-disclosure>
```

## Behavior

-   The first descendant that is a `<button>` or has `role="button"` will be given the `aria-expanded` attribute, which will reflect the open state of the disclosure widget.

-   Clicking the button will toggle the disclosure widget. The `hidden` attribute will be toggled on the content element.

## API

```js
const disclosure = document.querySelector('ui-disclosure');

// Programatically open and close the widget.
disclosure.open = true;

disclosure.addEventListener('toggle', callback);
```

```css
/* Transitions can be applied to the content using hello-goodbye */
@media (prefers-reduced-motion: no-preference) {
    ui-disclosure > .enter-active,
    ui-disclosure > .leave-active {
        transition: all 0.5s;
    }

    ui-disclosure > .enter-from,
    ui-disclosure > .leave-to {
        opacity: 0;
        transform: scale(0.5);
    }
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
-   [Scott O'Hara: The details and summary elements, again](https://www.scottohara.me/blog/2022/09/12/details-summary.html)
