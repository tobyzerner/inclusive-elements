# Accordion

**A native-first accordion pattern using `<details name>`.**

## Example

```html
<details name="faq">
    <summary>Returns</summary>
    <div>
        <p>30 day returns.</p>
    </div>
</details>

<details name="faq">
    <summary>Warranty</summary>
    <div>
        <p>Two years included.</p>
    </div>
</details>
```

## Platform Requirements

-   Requires modern browser support for grouped `<details name>` behavior.

## Behavior

-   Giving related `<details>` elements the same `name` makes them behave like an accordion, where opening one closes the others.
-   The browser provides the disclosure semantics and keyboard interaction.
-   This keeps the pattern lightweight and easy to style, without a custom wrapper element.

## Further Reading

-   [MDN: `<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
-   [ARIA Authoring Practices Guide: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
