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

-   To set a default selected tab, set `aria-selected="true"` on exactly one `tab`. If this is not provided, the first tab is selected by default.

-   When focus is on the active `tab`, pressing the `Left Arrow`, `Right Arrow`, `Home`, and `End` keys can be used for navigation. If the `tablist` has `aria-orientation="vertical"`, `Down Arrow` and `Up Arrow` are used instead.

-   The `tab` with focus is automatically activated, and its corresponding `tabpanel` will become visible.

-   The `ui-tabs` element dispatches a `change` event when a new tab is selected by user interaction (click or keyboard navigation), or by calling the `selectTab()` method.

## API

-   `selectTab(index, options?)`

    Programmatically selects a tab and returns `true` if the active tab changed, otherwise `false`.

    -   `index` (`number`): The tab index to select.
    -   `options.focus` (`boolean`, default `false`): Moves focus to the selected tab.
    -   `options.emit` (`boolean`, default `true`): Emits a `change` event when selection changes.

## Further Reading

-   [ARIA Authoring Practices Guide: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
