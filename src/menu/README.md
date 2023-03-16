# Menu

**A custom element for building accessible menus.**

A menu is a widget that offers a list of choices to the user, such as a set of actions or functions.

Usually you will want to compose this element with the [Popup](../popup) element to create a "menu button". This use-case is demonstrated in the markup below.

## Example

```js
import { PopupElement, MenuElement } from 'inclusive-elements';

window.customElements.define('ui-popup', PopupElement);
window.customElements.define('ui-menu', MenuElement);
```

```html
<ui-popup placement="bottom-start">
    <button type="button">Menu <span aria-hidden="true">&#x25be;</span></button>

    <ui-menu hidden>
        <button role="menuitem">Item 1</button>
        <button role="menuitem">Item 2</button>
        <button role="menuitem">Item 3</button>
    </ui-menu>
</ui-popup>
```

## Behavior

-   The `<ui-menu>` element will be given a role of `menu`.

-   While the menu has focus, the Up/Down Arrow keys can be used to cycle focus through child elements with a role starting with `menuitem`. These elements are given a `tabindex` of `-1` so that they cannot be reached with the Tab key.

-   While the menu has focus, typing a string will move focus to the first item which contains text beginning with that string. The search string is cleared after a configurable delay.

## API

```ts
// The number of milliseconds that must pass without a key press
// before the search string is cleared.
MenuElement.searchDelay = 800;
```

## Further Reading

-   [ARIA Authoring Practices Guide: Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
-   [Inclusive Components: Menus & Menu Buttons](https://inclusive-components.design/menus-menu-buttons/)
-   [Adrian Roselli: Don’t Use ARIA Menu Roles for Site Nav](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html)
