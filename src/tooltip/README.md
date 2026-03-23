# Tooltip

**An accessible tooltip pattern built on native hint popovers with a supporting custom element.**

`ui-tooltip` keeps the tooltip surface native and adds the ownership and interaction behavior the platform does not provide by itself.

## Example

```js
import { TooltipElement } from 'inclusive-elements';

window.customElements.define('ui-tooltip', TooltipElement);
```

```html
<!-- Adjacent sibling tooltip -->
<button type="button">Save</button>
<ui-tooltip popover="hint" data-placement="top">Save changes</ui-tooltip>

<!-- Explicit owner with for -->
<button id="share-button" type="button">Share</button>
<ui-tooltip for="share-button" popover="hint" data-placement="top">
    Create a shareable link
</ui-tooltip>
```

## Platform Requirements

-   Requires modern browser support for the Popover API and hint popovers with `popover="hint"`.
-   The styling examples use CSS anchor positioning.

## Behavior

### Structure

-   `ui-tooltip` adds `popover="hint"` and `role="tooltip"` if they are not already present.
-   The tooltip ensures it has an `id` and adds that value to the owner's `aria-describedby`.

### Ownership

-   Use whichever ownership style fits the markup best: if the tooltip has a `for` attribute, it targets the element with that `id`; otherwise, it targets its immediately preceding element sibling.
-   Changing `for`, `id`, or `disabled` re-syncs the owner relationship automatically.

### Visibility And Interaction

-   The `disabled` attribute, or the reflected `tooltip.disabled` property, prevents the tooltip from showing and clears any current owner relationship.
-   Tooltips do not show while the tooltip itself is `disabled`, or when the resolved owner is `disabled` or `aria-disabled="true"`.
-   The tooltip shows on keyboard focus and pointer hover, hides on blur, pointer exit, click, and Escape, and stays open while the pointer moves between the owner and the tooltip.

### Content Guidance

-   Tooltip content should stay descriptive, supplemental, and non-interactive.
-   Do not put required instructions or critical information in a tooltip, because hover is not reliably available on touch and other coarse-pointer devices.
-   If you need buttons, links, form controls, or information the user must be able to discover, use a popover or dialog pattern instead.

## API

```ts
// Default delay in milliseconds before the tooltip shows or hides.
TooltipElement.delay = 100;

// Override the delay for one tooltip instance.
tooltip.setAttribute('delay', '200');

// Reflect the disabled attribute as a property when convenient.
tooltip.disabled = true;

// Convenience methods for programmatic control.
tooltip.show();
tooltip.hide();
```

## Styling

`ui-tooltip` is unstyled. Position the tooltip with native anchor positioning:

```css
[popover] {
    position: fixed;
    position-anchor: auto;
}

ui-tooltip[popover][data-placement='top'] {
    position-area: block-start;
    max-inline-size: 18rem;
    padding: 0.5rem 0.75rem;
}

ui-tooltip[popover][data-placement='bottom'] {
    position-area: block-end;
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
-   [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
