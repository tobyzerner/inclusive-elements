# Tooltip

**A custom element for building accessible tooltips.**

```js
import { TooltipElement } from 'inclusive-elements';

window.customElements.define('ui-tooltip', TooltipElement);
```

```html
<button>
  <svg><!-- icon --></svg>
  <ui-tooltip class="visually-hidden">More controls</ui-tooltip>
</button>
```

## Behavior

- The `<ui-tooltip>` element contains the primary label for the parent element. It can be hidden by applying a [`visually-hidden` class](https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/).

- When the parent element (`<button>` in the example above) is hovered or focused, the contents of `<ui-tooltip>` will be cloned into a new element, appended to `<body>`, and positioned next to the parent element using [Placement.js](https://github.com/tobyzerner/placement.js) as per the `placement` attribute.

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
<ui-tooltip
  tooltip-class="tooltip"
  placement="top"
  delay="100"
></ui-tooltip>
```

```css
/* Style the tooltip */
.tooltip {
  background: black;
  color: white;
  padding: .5em 1em;
  pointer-events: none;
}

/* Transitions using hello-goodbye */
.tooltip.enter-active,
.tooltip.leave-active {
  transition: all .2s;
}

.tooltip.enter-from,
.tooltip.leave-to {
  transform: scale(0.5);
  opacity: 0;
}
```

## Further Reading

- [WAI-ARIA Authoring Practices: Tooltip](https://w3c.github.io/aria-practices/#tooltip)
- [Inclusive Components: Tooltips & Toggletips](https://inclusive-components.design/tooltips-toggletips/)
