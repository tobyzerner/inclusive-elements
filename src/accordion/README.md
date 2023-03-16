# Accordion

**A custom element for building accessible accordions.**

The accordion element wraps multiple disclosure elements, and ensures only one of these is expanded at a time.

## Example

```js
import { AccordionElement } from 'inclusive-elements';

window.customElements.define('ui-accordion', AccordionElement);
```

```html
<ui-accordion>
    <ui-disclosure>
        <h2>
            <button type="button">Section A</button>
        </h2>
        <div>
            Details
        </div>
    </ui-disclosure>
    
    <ui-disclosure>
        <h2>
            <button type="button">Section B</button>
        </h2>
        <div>
            Details
        </div>
    </ui-disclosure>
</ui-accordion>
```

## Behavior

-   Whenever a direct child `<ui-disclosure>` element is opened, sibling `<ui-disclosure>` elements will be closed.

-   If the `required` attribute is present, the `<ui-disclosure>` element that is currently open will be `disabled`.

## Further Reading

-   [ARIA Authoring Practices Guide: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
