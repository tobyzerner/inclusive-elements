import{move as t,hello as e,goodbye as i,cancel as s}from"hello-goodbye";import{createFocusTrap as n}from"focus-trap";import{computePosition as o,shift as r,flip as a,size as h}from"@floating-ui/dom";import{focusable as d}from"tabbable";class c extends HTMLElement{static duration=1e4;timeouts=new Map;index=0;connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","status"),this.hasAttribute("aria-live")||this.setAttribute("aria-live","polite"),this.hasAttribute("aria-relevant")||this.setAttribute("aria-relevant","additions")}show(i,s={}){const n=s.key||String(this.index++);this.dismiss(n),i.dataset.key=n,t(this.children,(()=>{this.append(i),e(i)}));const o=void 0!==s.duration?Number(s.duration):c.duration;return o>0&&(this.startTimeout(i,o),i.addEventListener("mouseenter",this.clearTimeout.bind(this,i)),i.addEventListener("focusin",this.clearTimeout.bind(this,i)),i.addEventListener("mouseleave",this.startTimeout.bind(this,i,o)),i.addEventListener("focusout",this.startTimeout.bind(this,i,o))),n}dismiss(e){if("string"!=typeof e)t(this.children,(()=>{i(e,{finish:()=>this.removeChild(e)})})),this.clearTimeout(e);else{const t=this.querySelector(`[data-key="${e}"]`);t&&this.dismiss(t)}}clear(){for(const t of this.children)this.dismiss(t)}speak(t){const e=document.createElement("div");Object.assign(e.style,{clip:"rect(0 0 0 0)",clipPath:"inset(50%)",height:"1px",overflow:"hidden",position:"absolute",whiteSpace:"nowrap",width:"1px"}),e.textContent=t,this.show(e)}startTimeout(t,e){this.clearTimeout(t),this.timeouts.set(t,window.setTimeout((()=>{this.dismiss(t)}),e))}clearTimeout(t){this.timeouts.has(t)&&clearTimeout(this.timeouts.get(t))}}class l extends HTMLElement{static searchDelay=800;search="";searchTimeout;connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","menu"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),this.items.forEach((t=>{t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1")})),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){this.removeEventListener("keydown",this.onKeyDown)}get items(){return Array.from(this.querySelectorAll("[role^=menuitem]"))}onKeyDown=t=>{if(!this.hidden)return"ArrowUp"===t.key?(this.navigate(-1),void t.preventDefault()):"ArrowDown"===t.key?(this.navigate(1),void t.preventDefault()):void(t.key.length>1||t.ctrlKey||t.metaKey||t.altKey||(this.search+=t.key.toLowerCase(),t.preventDefault(),clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout((()=>{this.search=""}),l.searchDelay),this.items.some((t=>{if(0===t.textContent?.trim().toLowerCase().indexOf(this.search))return t.focus(),!0}))))};navigate(t){const e=this.items;let i=(document.activeElement instanceof HTMLElement?e.indexOf(document.activeElement):-1)+t;i<0&&(i=e.length-1),i>=e.length&&(i=0),e[i]?.focus()}}class u extends HTMLElement{static attention=t=>t.animate([{transform:"scale(1)"},{transform:"scale(1.1)"},{transform:"scale(1)"}],300);static get observedAttributes(){return["open"]}trigger;focusTrap;constructor(){super();const t=document.createElement("template");t.innerHTML='\n            <div part="backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>\n            <div part="content" style="z-index: 1"><slot></slot></div>\n        ';const e=this.attachShadow({mode:"open"});e.appendChild(t.content.cloneNode(!0)),this.backdrop.addEventListener("click",(()=>{this.hasAttribute("static")?u.attention?.(e.children[1]):this.close()})),this.focusTrap=n(this,{escapeDeactivates:!1,allowOutsideClick:!0})}connectedCallback(){this.content?.hasAttribute("role")||this.content?.setAttribute("role","dialog"),this.content?.hasAttribute("aria-modal")||this.content?.setAttribute("aria-modal","true"),this.content?.hasAttribute("tabindex")||this.content?.setAttribute("tabindex","-1"),this.addEventListener("keydown",(t=>{"Escape"===t.key&&this.open&&(t.preventDefault(),t.stopPropagation(),this.close())}))}get open(){return this.hasAttribute("open")}set open(t){t?this.setAttribute("open",""):this.removeAttribute("open")}close(){if(!this.open)return;const t=new Event("beforeclose",{cancelable:!0});this.dispatchEvent(t)&&(this.open=!1)}attributeChangedCallback(t,e,i){"open"===t&&(null!==i?this.wasOpened():this.wasClosed())}wasOpened(){this.trigger=document.activeElement,this.hidden=!1,e(this),this.focusTrap.activate();const t=this.querySelector("[autofocus]");t?t.focus():this.content?.focus(),this.dispatchEvent(new Event("open"))}wasClosed(){this.focusTrap.deactivate(),this.trigger?.focus(),i(this,{finish:()=>this.hidden=!0}),this.dispatchEvent(new Event("close"))}get backdrop(){return this.shadowRoot?.firstElementChild}get content(){return this.firstElementChild}}class p extends HTMLElement{static get observedAttributes(){return["open"]}constructor(){super();const t=document.createElement("template");t.innerHTML='\n            <div part="backdrop" hidden style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>\n            <slot></slot>\n        ';this.attachShadow({mode:"open"}).appendChild(t.content.cloneNode(!0)),this.backdrop.onclick=()=>this.open=!1}connectedCallback(){this.backdrop.hidden=!0,this.content.hidden=!0,this.open=!1,this.button.setAttribute("aria-expanded","false"),setTimeout((()=>{"menu"===this.content.getAttribute("role")&&this.button.setAttribute("aria-haspopup","true")})),this.button.addEventListener("click",(()=>{this.open=!this.open})),this.button.addEventListener("keydown",(t=>{"ArrowDown"===t.key&&(t.preventDefault(),this.open=!0,d(this.content)[0]?.focus())})),this.addEventListener("keydown",(t=>{"Escape"===t.key&&this.open&&(t.preventDefault(),t.stopPropagation(),this.open=!1,this.button.focus())})),this.addEventListener("focusout",(t=>{t.relatedTarget instanceof Node&&this.contains(t.relatedTarget)||(this.open=!1)})),this.content.addEventListener("click",(t=>{t.target instanceof Element&&t.target.closest("[role=menuitem], [role=menuitemradio]")&&(this.open=!1,this.button.focus())}))}disconnectedCallback(){s(this.backdrop),s(this.content)}get open(){return this.hasAttribute("open")}set open(t){t?this.setAttribute("open",""):this.removeAttribute("open")}attributeChangedCallback(t,e,i){"open"===t&&(null!==i?this.wasOpened():this.wasClosed())}wasOpened(){if(!this.content.hidden)return;this.content.hidden=!1,this.backdrop.hidden=!1,e(this.content),e(this.backdrop),this.button.setAttribute("aria-expanded","true"),this.content.style.position="absolute",o(this.button,this.content,{placement:this.getAttribute("placement")||"bottom",middleware:[r(),a(),h()]}).then((({x:t,y:e,placement:i})=>{Object.assign(this.content.style,{left:`${t}px`,top:`${e}px`}),this.content.dataset.placement=i}));const t=this.content.querySelector("[autofocus]");t?t.focus():this.content.focus(),this.dispatchEvent(new Event("open"))}wasClosed(){this.content.hidden||(this.button.setAttribute("aria-expanded","false"),i(this.backdrop,{finish:()=>this.backdrop.hidden=!0}),i(this.content,{finish:()=>this.content.hidden=!0}),this.dispatchEvent(new Event("close")))}get backdrop(){return this.shadowRoot?.firstElementChild}get button(){return this.children[0]}get content(){return this.children[1]}}class m extends HTMLElement{connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","toolbar"),this.setAttribute("tabindex","0"),this.addEventListener("focus",this.onInitialFocus,{once:!0}),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){this.removeEventListener("keydown",this.onKeyDown)}onInitialFocus=t=>{this.removeAttribute("tabindex"),this.focusControlAtIndex(0)};onKeyDown=t=>{if("ArrowRight"!==t.key&&"ArrowLeft"!==t.key&&"Home"!==t.key&&"End"!==t.key)return;const e=this.controls,i=this.controls.length,s=e.indexOf(t.target);if(-1===s)return;let n=0;"ArrowLeft"===t.key&&(n=s-1),"ArrowRight"===t.key&&(n=s+1),"End"===t.key&&(n=i-1),n<0&&(n=i-1),n>i-1&&(n=0),this.focusControlAtIndex(n),t.preventDefault()};focusControlAtIndex(t){this.controls.forEach(((e,i)=>{i===t?(e.setAttribute("tabindex","0"),e.focus()):e.setAttribute("tabindex","-1")}))}get controls(){return d(this)}}class b extends HTMLElement{static delay=100;static placement="top";static tooltipClass="tooltip";parent;tooltip;timeout;observer;showing=!1;onMouseEnter=this.afterDelay.bind(this,this.show);onFocus=this.show.bind(this);onMouseLeave=this.afterDelay.bind(this,this.hide);onBlur=this.hide.bind(this);connectedCallback(){this.parent=this.parentNode,this.parent&&(this.parent.addEventListener("mouseenter",this.onMouseEnter),this.parent.addEventListener("focus",this.onFocus),this.parent.addEventListener("mouseleave",this.onMouseLeave),this.parent.addEventListener("blur",this.onBlur),this.parent.addEventListener("click",this.onBlur),this.observer=new MutationObserver((t=>{t.forEach((t=>{"disabled"===t.attributeName&&this.hide()}))})),this.observer.observe(this.parent,{attributes:!0})),document.addEventListener("keydown",this.onKeyDown),document.addEventListener("scroll",this.onBlur)}disconnectedCallback(){this.tooltip&&(this.tooltip.remove(),this.tooltip=void 0),this.parent&&(this.parent.removeEventListener("mouseenter",this.onMouseEnter),this.parent.removeEventListener("focus",this.onFocus),this.parent.removeEventListener("mouseleave",this.onMouseLeave),this.parent.removeEventListener("blur",this.onBlur),this.parent.removeEventListener("click",this.onBlur),this.parent=void 0),document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("scroll",this.onBlur),this.observer.disconnect()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}onKeyDown=t=>{"Escape"===t.key&&this.hide()};show(){if(this.disabled)return;const t=this.createTooltip();clearTimeout(this.timeout),this.showing||(t.hidden=!1,e(t),this.showing=!0),t.innerHTML!==this.innerHTML&&(t.innerHTML=this.innerHTML),t.style.position="absolute",o(this.parent,t,{placement:this.getAttribute("placement")||b.placement,middleware:[r(),a()]}).then((({x:e,y:i,placement:s})=>{Object.assign(t.style,{left:`${e}px`,top:`${i}px`}),t.dataset.placement=s}))}hide(){clearTimeout(this.timeout),this.showing&&(this.showing=!1,i(this.tooltip,{finish:()=>{this.tooltip&&(this.tooltip.hidden=!0)}}))}afterDelay(t){clearTimeout(this.timeout);const e=parseInt(this.getAttribute("delay")||"");this.timeout=window.setTimeout(t.bind(this),isNaN(e)?b.delay:e)}createTooltip(){return this.tooltip||(this.tooltip=document.createElement("div"),this.tooltip.className=this.getAttribute("tooltip-class")||b.tooltipClass,this.tooltip.hidden=!0,this.tooltip.addEventListener("mouseenter",this.show.bind(this)),this.tooltip.addEventListener("mouseleave",this.afterDelay.bind(this,this.hide)),document.body.appendChild(this.tooltip)),this.tooltip}}export{c as AlertsElement,l as MenuElement,u as ModalElement,p as PopupElement,m as ToolbarElement,b as TooltipElement};
