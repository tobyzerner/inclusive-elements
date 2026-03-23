# Disclosure

**A native-first disclosure pattern using `<details>` and `<summary>`.**

## Example

```html
<details>
    <summary>Shipping information</summary>
    <div>
        <p>Ships in 2–3 business days.</p>
    </div>
</details>
```

## Behavior

-   `<summary>` acts as the built-in control for toggling the disclosure.
-   The browser manages the open state and accessibility semantics.

## Accessibility Notes

-   Write summary text that clearly describes the hidden content, not generic labels such as "More" without context.

## Further Reading

-   [MDN: `<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
-   [ARIA Authoring Practices Guide: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
