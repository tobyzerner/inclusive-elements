# Dialog

**A native-first modal dialog pattern using `<dialog>`.**

## Example

```html
<button command="show-modal" commandfor="delete-dialog">Delete</button>
```

```html
<button type="button" id="delete-trigger">Delete</button>

<script type="module">
    document
        .getElementById('delete-trigger')
        ?.addEventListener('click', () => {
            document.getElementById('delete-dialog')?.showModal();
        });
</script>
```

```html
<dialog id="delete-dialog" aria-labelledby="delete-title">
    <h2 id="delete-title">Delete item?</h2>
    <p>This action cannot be undone.</p>

    <form method="dialog">
        <button value="cancel" autofocus>Cancel</button>
        <button value="confirm">Delete</button>
    </form>
</dialog>
```

## Platform Requirements

-   Requires modern browser support for `<dialog>`.
-   Declarative `command="show-modal"` and `commandfor` buttons are newer platform features. Use `showModal()` when you need the imperative fallback.

## Behavior

-   `<dialog>` provides the modal container and top-layer behavior.
-   Declarative `command="show-modal"` / `commandfor` buttons and imperative `showModal()` calls are both valid ways to open the dialog.
-   The browser manages focus movement, Escape handling, and inert background behavior.

## Accessibility Notes

-   Give the dialog an accessible name with visible text and `aria-labelledby`, or with `aria-label` when no visible title fits.
-   Provide an obvious dismiss action inside the dialog, not just Escape or backdrop dismissal.
-   Use `<form method="dialog">` or `close()` intentionally so the close behavior is explicit in your markup and scripts.
-   Native modal dialogs usually restore focus appropriately when they close. Only manage focus yourself when the opener is gone or your workflow needs a different destination.
-   This pattern is for modal tasks that need blocking attention. For non-modal surfaces, use a popover or another native pattern instead.

## Further Reading

-   [MDN: `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
-   [ARIA Authoring Practices Guide: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
