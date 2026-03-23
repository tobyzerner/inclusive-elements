# Alerts

**An accessible alert pattern with a supporting custom element.**

`ui-alerts` manages a stack of alert elements, normalizes their announcement semantics, and handles timed dismissal.

## Example

```js
import { AlertsElement } from 'inclusive-elements';

window.customElements.define('ui-alerts', AlertsElement);

const alerts = document.createElement('ui-alerts');
document.body.appendChild(alerts);

function createAlert(type, message) {
    const el = document.createElement('div');
    el.className = type;
    el.textContent = message;
    return el;
}

alerts.show(createAlert('error', 'There was an error'));
alerts.speak('Hello stranger!');
```

## Behavior

### Container

-   `<ui-alerts>` is the container and timing manager for a stack of alert elements.
-   Any alerts already present as children when the element connects are reprocessed in place so they are announced and animated.

### Announcement Semantics

-   Each alert can be announced politely or assertively.
-   `show(..., { politeness })` takes precedence. Otherwise, existing authored live-region semantics on the alert are preserved before falling back to the element default.
-   Polite alerts use `role="status"` and `aria-live="polite"`.
-   Assertive alerts use `role="alert"` and `aria-live="assertive"`.

### Timing And Replacement

-   Alerts auto-dismiss after their configured duration.
-   Hovering or focusing an alert clears its dismissal timer, and the full duration starts again when pointer or focus leaves the alert.
-   Showing a new alert with an existing `key` dismisses the previous alert with that key before the new one is announced.

## API

```ts
import type { AlertOptions } from 'inclusive-elements';

// Default dismissal time for alerts that do not provide one.
// Use 0 or a negative value to disable auto-dismiss by default.
AlertsElement.duration = 10000;

// Default politeness for alerts that do not provide one.
AlertsElement.politeness = 'polite';

const options: AlertOptions = {
    // Reuse this key to replace an earlier alert with the same key.
    key: 'save-complete',

    // Override the default dismissal time for this alert only.
    // Use 0 or a negative value to require manual dismissal.
    duration: 5000,

    // Use 'assertive' for urgent announcements that should interrupt.
    politeness: 'assertive',
};

// Appends the element, announces it, starts dismissal timing,
// and returns the key used for this alert.
const key = alerts.show(el, options);

// Dismiss a specific alert element.
alerts.dismiss(el);

// Dismiss any current alerts using this key.
alerts.dismiss(key);

// Dismiss every alert in the container.
alerts.clear();

// Announce plain text without creating your own element.
alerts.speak(message, { politeness: 'polite' });
```

## Styling

`ui-alerts` is unstyled. The supported animation hooks are:

-   New alerts receive `enter-*` classes so CSS can animate them in.
-   Dismissed alerts animate out using `leave-*` classes and are then removed.
-   Existing alerts animate into their new positions using the `move` class.

```css
ui-alerts {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    pointer-events: none;
}

ui-alerts > * {
    pointer-events: auto;
}

@media (prefers-reduced-motion: no-preference) {
    ui-alerts > .enter-active,
    ui-alerts > .leave-active,
    ui-alerts > .move {
        transition: opacity 0.2s ease, transform 0.2s ease;
    }

    ui-alerts > .move {
        transition: transform 0.2s ease;
    }

    ui-alerts > .enter-from,
    ui-alerts > .leave-to {
        opacity: 0;
        transform: translateY(-0.5rem);
    }
}
```

## Further Reading

-   [ARIA Authoring Practices Guide: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
