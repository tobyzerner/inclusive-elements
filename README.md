# Inclusive Elements

**Accessible, lightweight, unstyled patterns for inclusive UI.**

[**Demo**](https://tobyzerner.github.io/inclusive-elements/index.html)

`inclusive-elements` is a set of documented patterns and lightweight supporting elements for implementing common interface patterns.

-   **🦮 Accessible.** Built around native semantics and established inclusive interaction patterns.
-   **🌳 Lightweight.** Prefer the platform first, and only add JS where it meaningfully helps.
-   **🎨 Unstyled.** Bring your own design without fighting defaults.
-   **🚀 Easy to use.** Straightforward markup, small APIs, and designed for modern browsers with the platform features each pattern depends on.

Each pattern in this library starts from the same question: what is the simplest, most inclusive way to build this on the platform today? Sometimes the answer is fully native HTML. Sometimes it is native HTML plus a small supporting custom element. The docs and demo are organized around patterns so you can start with the UI you need and immediately see the recommended implementation path.

Runtime elements are only shipped for the patterns that still need behavior the platform does not provide directly:
`ui-alerts`, `ui-menu`, `ui-tabs`, `ui-toolbar`, and `ui-tooltip`.
The other pattern docs are native-first guidance, including the accessibility work authors still need to do in their own markup.

## Installation

```sh
npm install inclusive-elements
```

Patterns in this package rely on modern browser features such as the Popover API, hint popovers, CSS anchor positioning, `<details name>`, and `<dialog>`.

## Patterns

-   [Accordion](src/accordion/README.md): native `<details name>` for grouped disclosure sections.
-   [Alerts](src/alerts/README.md): `<ui-alerts>` for polite or assertive announcements, timed dismissal, and animated stacking.
-   [Disclosure](src/disclosure/README.md): native `<details>` and `<summary>`.
-   [Menu](src/menu/README.md): native `popover` for the surface, plus `<ui-menu>` for keyboard navigation, typeahead, and submenu coordination.
-   [Dialog](src/dialog/README.md): native `<dialog>` for modality and focus handling.
-   [Popover](src/popover/README.md): native `popover` plus CSS anchor positioning.
-   [Tabs](src/tabs/README.md): `<ui-tabs>` for button-based tab selection and panel visibility.
-   [Toolbar](src/toolbar/README.md): `<ui-toolbar>` for arrow-key focus management.
-   [Tooltip](src/tooltip/README.md): native hint popovers, plus `<ui-tooltip>` for owner resolution and interaction behavior.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
