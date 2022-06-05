import {
    PopupElement,
    TooltipElement,
    MenuElement,
    ModalElement,
    AlertsElement,
    ToolbarElement,
} from '../dist/index';

window.customElements.define('ui-popup', PopupElement);
window.customElements.define('ui-tooltip', TooltipElement);
window.customElements.define('ui-menu', MenuElement);
window.customElements.define('ui-modal', ModalElement);
window.customElements.define('ui-alerts', AlertsElement);
window.customElements.define('ui-toolbar', ToolbarElement);
