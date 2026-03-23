# Popover

**A native-first popover pattern using the Popover API.**

## Example

```html
<button popovertarget="info-popover">More info</button>

<div id="info-popover" popover data-placement="bottom-start">
    This pattern no longer needs a library wrapper. Use the platform directly.
</div>
```

## Platform Requirements

-   Requires modern browser support for the Popover API.
-   The styling examples use CSS anchor positioning.

## Behavior

-   The button uses `popovertarget` to control the popover surface.
-   The browser manages opening, closing, and light dismiss behavior for the popover.
-   CSS anchor positioning can be used to place the popover relative to its trigger.

## Accessibility Notes

-   `popover` gives you a surface and lifecycle, not a semantic role. Choose markup and ARIA that match the actual pattern, such as menu, tooltip, or generic descriptive content.
-   Make sure the trigger has an accessible name and clearly communicates what will open.
-   Keep the content structure appropriate to the job. A simple help popover can stay plain, while interactive or decision-heavy content may be better served by a dialog.

## Styling

As a simple recommendation, you can style all popover surfaces with the `popover` attribute and control placement with a `data-placement` attribute:

```css
[popover] {
    position: fixed;
    position-anchor: auto;
}

[popover][data-placement='bottom'] {
    position-area: block-end;
}

[popover][data-placement='bottom-start'] {
    position-area: block-end span-inline-start;
}

[popover][data-placement='bottom-end'] {
    position-area: block-end span-inline-end;
}

[popover][data-placement='top'] {
    position-area: block-start;
}

[popover][data-placement='top-start'] {
    position-area: block-start span-inline-start;
}

[popover][data-placement='top-end'] {
    position-area: block-start span-inline-end;
}

[popover][data-placement='right'] {
    position-area: inline-end;
}

[popover][data-placement='right-start'] {
    position-area: inline-end span-block-start;
}

[popover][data-placement='right-end'] {
    position-area: inline-end span-block-end;
}

[popover][data-placement='left'] {
    position-area: inline-start;
}

[popover][data-placement='left-start'] {
    position-area: inline-start span-block-start;
}

[popover][data-placement='left-end'] {
    position-area: inline-start span-block-end;
}
```

## Further Reading

-   [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
-   [MDN: CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
