# Combobox

**An accessible, filterable combobox built on native form controls.**

`ui-combobox` upgrades native `<select>` and `<input list>` controls into
user-friendly, accessible comboboxes.

## Example

```js
import { ComboboxElement } from 'inclusive-elements';

window.customElements.define('ui-combobox', ComboboxElement);
```

Use a `<select>` when values must come from its options:

```html
<label for="country">Country</label>
<ui-combobox>
    <select id="country" name="country">
        <option value="">Choose a country</option>
        <option value="au">Australia</option>
        <option value="nz">New Zealand</option>
    </select>
</ui-combobox>
```

Add `multiple` for a token-based multi-select:

```html
<label for="specialties">Specialties</label>
<ui-combobox>
    <select id="specialties" name="specialties[]" multiple>
        <option value="cardiology">Cardiology</option>
        <option value="emergency">Emergency medicine</option>
        <option value="paediatrics">Paediatrics</option>
    </select>
</ui-combobox>
```

Use `<input list>` when arbitrary text is also valid:

```html
<label for="city">City</label>
<ui-combobox>
    <input id="city" name="city" type="text" list="cities" />
    <datalist id="cities">
        <option value="Adelaide"></option>
        <option value="Melbourne"></option>
        <option value="Sydney"></option>
    </datalist>
</ui-combobox>
```

## Requirements

- The browser must support the Popover API. Unsupported browsers keep the
  native control unchanged.
- Keep the label outside `ui-combobox` and associate it with the native control.
- `<input list>` supports the `text`, `search`, `email`, `url`, and `tel` input
  types, except for multi-address `<input type="email" multiple>` controls,
  which remain native.

## Behavior

For a select, the element inserts a filter input and listbox alongside the native
control, then hides the select. For an `<input list>`, it reuses the native input
and replaces its suggestions with a filterable listbox. `multiple` selects show
selected options as removable tokens.

The native control remains in the DOM and is kept in sync, so it continues to
work as expected for form submission, validation, reset, events, focus, and
disabled states.

- Focus or click opens the suggestions. A select's filter input is cleared
  so all options are visible; a datalist input keeps its submitted text.
- Typing filters options by label or value.
- Arrow Up and Arrow Down move through enabled options. Enter chooses one and
  Escape closes the suggestions.
- Choosing a single-select option closes the popup. Choosing a multi-select option
  adds a token and leaves the popup open.
- Left and Right move between multi-select tokens. Backspace or Delete removes a
  focused token.
- Tab leaves the combobox without changing its value. With the popup closed,
  Enter retains the input's native behavior, including form submission.

## API

Call `refresh()` after changing the source control or its related label, form,
or datalist in a way that does not emit an event or update observed markup.

```js
const combobox = document.querySelector('ui-combobox');

input.setAttribute('list', 'regional-cities');
combobox.refresh();
```

## Styling

Use the ARIA roles to style the combobox, listbox, and options. The generated
light DOM exposes these stable styling hooks where no semantic equivalent
exists:

- `[data-combobox-control]`
- `[data-combobox-tokens]`, `[data-combobox-token]`, and
  `[data-combobox-token-remove]`
- `[role="option"][data-placeholder]` for a single select's empty option
- `[role="option"][data-active]` for the active option

```css
ui-combobox [role='listbox'] {
    position: fixed;
    position-anchor: auto;
    max-height: 16rem;
    overflow: auto;
}

ui-combobox [role='option'][data-active] {
    outline: 2px solid currentColor;
}

ui-combobox [role='option'][data-placeholder] {
    color: GrayText;
}
```

## Further Reading

- [ARIA Authoring Practices Guide: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [MDN: ARIA combobox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role)
- [MDN: `<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist)
