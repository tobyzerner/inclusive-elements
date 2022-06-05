# Tooltip

**A custom element for building accessible tooltips.**

A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Example

```js
import { TooltipElement } from 'inclusive-elements';

window.customElements.define('ui-tooltip', TooltipElement);
```

```html
<!-- Tooltip as primary label -->
<button>
    <svg><use href="#cog" /></svg>
    <ui-tooltip class="visually-hidden">Settings</ui-tooltip>
</button>

<!-- Tooltip as auxiliary description -->
<button aria-describedby="settings-description">
    <svg><use href="#cog" /></svg>
    <span class="visually-hidden">Settings</span>
    <ui-tooltip id="settings-description" hidden
        >View and manage settings</ui-tooltip
    >
</button>
```

## Behavior

-   When the parent element (`<button>` in the example above) is hovered or focused, the contents of `<ui-tooltip>` will be cloned into a new element, appended to `<body>`, and positioned next to the parent element using [Floating UI](https://floating-ui.com) as per the `placement` attribute.

## API

```js
// The default class applied to the tooltip element.
TooltipElement.tooltipClass = 'tooltip';

// The default placement for tooltips.
TooltipElement.placement = 'top';

// The number of milliseconds to delay showing and hiding
// the tooltip for hover events.
TooltipElement.delay = 100;
```

```html
<!-- Override the above settings per instance -->
<ui-tooltip tooltip-class="tooltip" placement="top" delay="100"></ui-tooltip>
```

```css
/* Style the tooltip */
.tooltip {
    background: black;
    color: white;
    padding: 0.5em 1em;
    pointer-events: none;
}

/* Transitions can be applied to the tooltip using hello-goodbye */
@media (prefers-reduced-motion: no-preference) {
    .tooltip.enter-active,
    .tooltip.leave-active {
        transition: all 0.2s;
    }

    .tooltip.enter-from,
    .tooltip.leave-to {
        transform: scale(0.5);
        opacity: 0;
    }
}
```

## Further Reading

-   [WAI-ARIA Authoring Practices: Tooltip](https://w3c.github.io/aria-practices/#tooltip)
-   [Inclusive Components: Tooltips & Toggletips](https://inclusive-components.design/tooltips-toggletips/)
