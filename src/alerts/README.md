# Alerts

**A custom element for building accessible alerts.**

An alert is an element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.

The Alerts element provides a container to push alerts into, ensuring they are announced appropriately. It also manages automatic disappearance of alerts after a certain period of time.

It may be styled as a "toasts" container, but careful consideration should be given to the accessibility implications of this pattern (see [Further Reading](#further-reading)).

## Example

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

-   The `<ui-alerts>` container is given the attributes `role="status"`, `aria-live="polite"` and `aria-relevant="additions"` so that any content additions will be announced.

## API

```ts
// The default number of milliseconds that alerts will be visible for.
// If -1, alerts will not automatically disappear.
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
    key?: string;

    // The number of milliseconds to show the alert for.
    // If -1, the alert will not automatically disappear.
    // If undefined, the default value will be used.
    duration?: number;
};

// The `key` and `duration` options can also be specified as [data-*] attributes
// on the alert element being shown. eg:
// <div data-key="foo" data-duration="1000">Alert</div>

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
```

## Further Reading

-   [ARIA Authoring Practices Guide: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
-   [Scott O'Hara: A toast to an accessible toast...](https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html)
-   [Adrian Roselli: Defining 'Toast' Messages](https://adrianroselli.com/2020/01/defining-toast-messages.html)
