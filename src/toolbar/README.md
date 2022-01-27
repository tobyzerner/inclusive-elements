# Toolbar

**A custom element for building accessible toolbars.**

A toolbar is a container for grouping a set of controls, such as buttons, menubuttons, or checkboxes.

## Example

```js
import { ToolbarElement } from 'inclusive-elements';

window.customElements.define('ui-toolbar', ToolbarElement);
```

```html
<ui-toolbar>
  <button type="button">Bold</button>
  <button type="button">Italic</button>
  <button type="button">Underline</button>
</ui-toolbar>
```

## Behavior

- The `<ui-toolbar>` element will be given a role of `toolbar`.

- Focus management is implemented so the keyboard tab sequence includes one stop for the toolbar, and the Left Arrow, Right Arrow, Home, and End keys move focus among the controls in the toolbar.

## Further Reading

- [WAI-ARIA Authoring Practices: Toolbar](https://www.w3.org/TR/wai-aria-practices-1.1/#toolbar)
