# Tabs

**A custom element for building accessible tabbed interfaces.**

## Example

```js
import { TabsElement } from 'inclusive-elements';

window.customElements.define('ui-tabs', TabsElement);
```

```html
<ui-tabs>
    <div role="tablist" aria-label="Tabs">
        <button type="button" role="tab">Tab 1</button>
        <button type="button" role="tab">Tab 2</button>
        <button type="button" role="tab">Tab 3</button>
    </div>
    <div role="tabpanel">Tab Panel 1</div>
    <div role="tabpanel" hidden>Tab Panel 2</div>
    <div role="tabpanel" hidden>Tab Panel 3</div>
</ui-tabs>
```

## Behavior

-   Descendants with `role="tab"` and `role="tabpanel"` will have appropriate `id`, `aria-controls`, and `aria-labelledby` attributes generated if they are not already set.

-   The active `tab` will have the `aria-selected="true"` attribute set. Inactive tabs will have their `tabindex` set to `-1` so that focus remains on the active tab.

-   When focus is on the active `tab`, pressing the `Left Arrow`, `Right Arrow`, `Home`, and `End` keys can be used for navigation. If the `tablist` has `aria-orientation="vertical"`, `Down Arrow` and `Up Arrow` are used instead.

-   The `tab` with focus is automatically activated, and its corresponding `tabpanel` will become visible.

## Further Reading

-   [ARIA Authoring Practices Guide: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
