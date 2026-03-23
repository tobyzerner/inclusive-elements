# Toolbar

**An accessible toolbar pattern with a supporting custom element.**

`ui-toolbar` groups a set of controls into a single tab stop and adds the arrow-key focus management the platform does not provide by itself.

## Example

```js
import { ToolbarElement } from 'inclusive-elements';

window.customElements.define('ui-toolbar', ToolbarElement);
```

```html
<ui-toolbar aria-label="Text formatting">
    <button type="button">Bold</button>
    <button type="button">Italic</button>
    <button type="button">Underline</button>
</ui-toolbar>

<ui-toolbar aria-label="Alignment" aria-orientation="vertical">
    <button type="button">Top</button>
    <button type="button">Middle</button>
    <button type="button">Bottom</button>
</ui-toolbar>
```

## Behavior

### Structure

-   `ui-toolbar` adds `role="toolbar"` if it is not already present.

### Focus Management

-   The toolbar itself starts as the entry point into the widget. When it receives focus, focus moves to the current managed control inside it.
-   The active control gets `tabindex="0"`. Other controls get `tabindex="-1"` so Tab leaves the toolbar instead of stepping through every control.

### Keyboard Navigation

-   By default, toolbars are horizontal. Left and Right move focus between controls and wrap at the ends.
-   Set `aria-orientation="vertical"` when the toolbar is arranged vertically. Then Up and Down move focus between controls instead.
-   Home and End move focus to the first or last control.

### Dynamic Changes

-   Adding or removing controls after connection keeps the roving tabindex state in sync so the toolbar remains a single managed widget in the tab order.

## Styling

`ui-toolbar` is unstyled. Lay out the controls however you like:

```css
ui-toolbar {
    display: inline-flex;
    gap: 0.5rem;
}

ui-toolbar[aria-orientation='vertical'] {
    flex-direction: column;
    align-items: start;
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
