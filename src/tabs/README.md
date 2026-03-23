# Tabs

**An accessible tabs pattern with a supporting custom element.**

`ui-tabs` connects tabs and panels, keeps selection and focus state in sync, and adds the keyboard behavior the platform does not provide by itself.

## Example

```js
import { TabsElement } from 'inclusive-elements';

window.customElements.define('ui-tabs', TabsElement);
```

```html
<ui-tabs>
    <div role="tablist" aria-label="Account sections">
        <button type="button" role="tab" aria-selected="true">Profile</button>
        <button type="button" role="tab">Security</button>
        <button type="button" role="tab">Billing</button>
    </div>

    <section role="tabpanel">
        <h2>Profile</h2>
        <p>Manage your public details.</p>
    </section>

    <section role="tabpanel" hidden>
        <h2>Security</h2>
        <p>Update your password and sign-in settings.</p>
    </section>

    <section role="tabpanel" hidden>
        <h2>Billing</h2>
        <p>View invoices and payment methods.</p>
    </section>
</ui-tabs>
```

## Behavior

### Structure

-   Add one descendant with `role="tablist"`. Use `button` elements with `role="tab"` inside it. Panels are read from owned descendants with `role="tabpanel"`, and `ui-tabs` pairs them strictly by document order.
-   For initialized pairs, `ui-tabs` preserves existing `id` values where present, fills in missing `id` values, and normalizes `aria-controls` and `aria-labelledby` so each ordered pair stays wired together.

### Selection And Panels

-   Set `aria-selected="true"` on the tab that should be active by default. If none is marked selected, the first tab is selected automatically when the element connects.
-   The active tab gets `aria-selected="true"` and stays in the normal tab order. Inactive tabs get `aria-selected="false"` and `tabindex="-1"`.
-   Only the active panel remains visible. Other panels get `hidden = true`.
-   If the active panel has no tabbable content and no author-provided `tabindex`, `ui-tabs` gives the panel `tabindex="0"` so keyboard users can still reach it.
-   The element dispatches a `change` event on the `<ui-tabs>` element when user interaction or `selectTab()` changes the active tab.

### Keyboard Navigation

-   In a horizontal tablist, Left and Right move between tabs and wrap at the ends. Home and End jump to the first or last tab.
-   In a vertical tablist, set `aria-orientation="vertical"` on the tablist. Then Up and Down move between tabs instead of Left and Right.
-   Moving focus with the keyboard automatically activates the newly focused tab.

### Dynamic Changes

-   Adding, removing, or re-roleing tabs and panels after connection automatically re-syncs the ordered pairs. The current selected tab is preserved when its ordered slot still has a matching panel.

## API

```ts
// Select a tab by index. Returns true when the active tab changed.
tabs.selectTab(index, {
    // Move focus to the selected tab.
    focus: false,

    // Emit a `change` event when selection changes.
    emit: true,
});
```

## Styling

`ui-tabs` is unstyled. Style the selected tab from its ARIA state:

```css
[role='tab'][aria-selected='true'] {
    font-weight: 600;
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
