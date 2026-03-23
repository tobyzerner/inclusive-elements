# Menu

**An accessible menu pattern built on native popovers with a supporting custom element.**

`ui-menu` keeps the popup surface native and adds the menu behaviors the platform does not provide by itself, including arrow-key navigation, typeahead, and submenu coordination.

## Example

```js
import { MenuElement } from 'inclusive-elements';

window.customElements.define('ui-menu', MenuElement);
```

```html
<button type="button" popovertarget="actions-menu" aria-haspopup="menu">
    Actions
</button>

<ui-menu id="actions-menu" popover data-placement="bottom-start">
    <button type="button" role="menuitem">Edit</button>
    <button type="button" role="menuitem">Archive</button>
    <button
        type="button"
        role="menuitem"
        popovertarget="more-menu"
        aria-haspopup="menu"
    >
        More
    </button>
</ui-menu>

<ui-menu id="more-menu" popover data-placement="right-start">
    <button type="button" role="menuitem">Duplicate</button>
    <button type="button" role="menuitem">Delete</button>
</ui-menu>
```

## Platform Requirements

-   Requires modern browser support for the Popover API.
-   The styling examples use CSS anchor positioning.

## Behavior

### Structure

-   Add `popover` to the root `<ui-menu>` and point a button at it with `popovertarget` and `aria-haspopup="menu"`.
-   Give direct children a menu item role such as `role="menuitem"`. `ui-menu` adds `role="menu"` and `tabindex="-1"` to the menu itself and manages direct menuitem children with `tabindex="-1"` as well.

### Navigation

-   By default, menus are vertical. Arrow Down and Arrow Up move through the enabled items and wrap at the ends.
-   Pressing Arrow Down or Arrow Up on the root trigger opens the menu and focuses the first or last enabled item.
-   Typeahead matches and moves focus to enabled items by their `aria-label` when present, otherwise by their text content.

### Horizontal Menus

-   To make a horizontal popup menu, set `aria-orientation="horizontal"` on `<ui-menu>`. This keeps the element a `menu`, not a `menubar`, and works well for patterns such as reaction pickers.
-   In a horizontal popup menu, Left and Right move through the enabled items and wrap at the ends.

### Submenus

-   To create a submenu, make a menu item that points at another `<ui-menu>` with `popovertarget` and `aria-haspopup="menu"`.
-   Submenus open on click, hover, Enter, or Space, Right Arrow in vertical menus, and Down Arrow in horizontal menus.
-   Submenus close with Left Arrow in vertical menus and Up Arrow in horizontal menus.

### Closing

-   Clicking a regular menu item closes the open menu tree.
-   Escape also closes the open menu tree.
-   Tab closes the open menu tree before normal tab order continues.

## API

```ts
// Time in milliseconds before the accumulated typeahead search resets.
MenuElement.searchDelay = 800;
```

## Styling

`ui-menu` is unstyled. Position the popover surface with native anchor positioning:

```css
[popover] {
    position: fixed;
    position-anchor: auto;
}

[popover][data-placement='bottom-start'] {
    position-area: block-end span-inline-start;
}

[popover][data-placement='right-start'] {
    position-area: inline-end span-block-start;
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Menu and Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
-   [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
