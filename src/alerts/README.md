# Alerts

**A custom element for building accessible alerts.**

```js
import { AlertsElement } from 'inclusive-elements';

window.customElements.define('ui-alerts', AlertsElement);

// 1. Create the element and append it to the <body>
const alerts = document.createElement('ui-alerts');
document.body.appendChild(alerts);

// 2. Create your own alert template
function createAlert(type, message) {
  const el = document.createElement('div');
  el.className = type;
  el.textContent = message;
  return el;
}

// 3. Show an alert
alerts.show(createAlert('error', 'There was an error'));

// You can also send a visually-hidden message to be spoken
alerts.speak('There was an error');
```

## Behavior

- The `<ui-alerts>` container is given the attributes `role="status"`, `aria-live="polite"` and `aria-relevant="additions"` so that any content additions will be announced.

## API

```ts
// The default number of milliseconds that alerts will be visible for.
AlertsElement.duration = 10000;

const alerts = document.querySelector('ui-alerts');

// Show an alert
alerts.show(
    el: HTMLElement, 
    options?: AlertOptions
);

type AlertOptions = {
    // A unique key that represents this alert. Any previous alerts with the
    // same key will be dismissed before the new one is shown.
    key?: string,

    // The number of milliseconds to show the alert for.
    // If -1, the alert will not automatically disappear.
    // If undefined, the default value will be used.
    duration?: number
};

// Dismiss an alert by passing its element or unique key
alerts.dismiss(el: HTMLElement);
alerts.dismiss(key: string);

// Speak a visually-hidden message
alerts.speak(message: string);
```

```css
/* Basic styles for the alert container */
ui-alerts {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}

/* Transitions using hello-goodbye */
ui-alerts > .enter-active,
ui-alerts > .leave-active,
ui-alerts > .move {
  transition: all .5s;
}

ui-alerts > .enter-from {
  transform: translateY(-100%);
}

ui-alerts > .leave-to {
  opacity: 0;
}
```

## Further Reading

- [WAI-ARIA Authoring Practices: Alert](https://w3c.github.io/aria-practices/#alert)
