function t(t,e,n={}){const i=new WeakMap,o=s(n);t instanceof HTMLCollection&&(t=Array.from(t)),t.forEach((t=>{"none"!==getComputedStyle(t).display&&i.set(t,t.getBoundingClientRect())})),e(),t.forEach((t=>{const e=i.get(t);if(!e)return;const n=e.left-t.getBoundingClientRect().left,s=e.top-t.getBoundingClientRect().top;if(!n&&!s)return;const a=t.style;a.transitionDuration="0s",a.transform=`translate(${n}px, ${s}px)`,document.body.offsetWidth,a.transitionDuration=a.transform="",t.classList.add(o+"move"),r(t,(()=>{t.classList.remove(o+"move")}))}))}function e(t){t._currentTransition&&(t.classList.remove(...["active","from","to"].map((e=>t._currentTransition+e))),t._currentTransition=null)}function n(t,n,i={}){const o=s(i)+n+"-",a=t.classList;var c;e(t),t._currentTransition=o,a.add(o+"active",o+"from"),c=()=>{a.add(o+"to"),a.remove(o+"from"),r(t,(()=>{a.remove(o+"to",o+"active"),t._currentTransition===o&&(i.finish&&i.finish(),t._currentTransition=null)}))},requestAnimationFrame((()=>{requestAnimationFrame(c)}))}function i(t,e={}){n(t,"enter",e)}function o(t,e={}){n(t,"leave",e)}function r(t,e){if(getComputedStyle(t).transitionDuration.startsWith("0s"))e();else{const n=()=>{e(),t.removeEventListener("transitionend",n),t.removeEventListener("transitioncancel",n)};t.addEventListener("transitionend",n),t.addEventListener("transitioncancel",n)}}function s(t){return t.prefix?t.prefix+"-":""}
/*!
* tabbable 5.2.1
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var a=["input","select","textarea","a[href]","button","[tabindex]","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details>summary:first-of-type","details"],c=a.join(","),l="undefined"==typeof Element?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,u=function(t,e,n){var i=Array.prototype.slice.apply(t.querySelectorAll(c));return e&&l.call(t,c)&&i.unshift(t),i=i.filter(n)},d=function(t){var e=parseInt(t.getAttribute("tabindex"),10);return isNaN(e)?function(t){return"true"===t.contentEditable}(t)?0:"AUDIO"!==t.nodeName&&"VIDEO"!==t.nodeName&&"DETAILS"!==t.nodeName||null!==t.getAttribute("tabindex")?t.tabIndex:0:e},h=function(t,e){return t.tabIndex===e.tabIndex?t.documentOrder-e.documentOrder:t.tabIndex-e.tabIndex},f=function(t){return"INPUT"===t.tagName},p=function(t){return function(t){return f(t)&&"radio"===t.type}(t)&&!function(t){if(!t.name)return!0;var e,n=t.form||t.ownerDocument,i=function(t){return n.querySelectorAll('input[type="radio"][name="'+t+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)e=i(window.CSS.escape(t.name));else try{e=i(t.name)}catch(t){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",t.message),!1}var o=function(t,e){for(var n=0;n<t.length;n++)if(t[n].checked&&t[n].form===e)return t[n]}(e,t.form);return!o||o===t}(t)},m=function(t,e){return!(e.disabled||function(t){return f(t)&&"hidden"===t.type}(e)||function(t,e){if("hidden"===getComputedStyle(t).visibility)return!0;var n=l.call(t,"details>summary:first-of-type")?t.parentElement:t;if(l.call(n,"details:not([open]) *"))return!0;if(e&&"full"!==e){if("non-zero-area"===e){var i=t.getBoundingClientRect(),o=i.width,r=i.height;return 0===o&&0===r}}else for(;t;){if("none"===getComputedStyle(t).display)return!0;t=t.parentElement}return!1}(e,t.displayCheck)||function(t){return"DETAILS"===t.tagName&&Array.prototype.slice.apply(t.children).some((function(t){return"SUMMARY"===t.tagName}))}(e)||function(t){if(f(t)||"SELECT"===t.tagName||"TEXTAREA"===t.tagName||"BUTTON"===t.tagName)for(var e=t.parentElement;e;){if("FIELDSET"===e.tagName&&e.disabled){for(var n=0;n<e.children.length;n++){var i=e.children.item(n);if("LEGEND"===i.tagName)return!i.contains(t)}return!0}e=e.parentElement}return!1}(e))},b=function(t,e){return!(!m(t,e)||p(e)||d(e)<0)},v=function(t,e){return u(t,(e=e||{}).includeContainer,m.bind(null,e))},g=function(t,e){if(e=e||{},!t)throw new Error("No node provided");return!1!==l.call(t,c)&&b(e,t)},y=a.concat("iframe").join(","),w=function(t,e){if(e=e||{},!t)throw new Error("No node provided");return!1!==l.call(t,y)&&m(e,t)};
/*!
* focus-trap 6.7.2
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
function E(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function x(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var k,L=(k=[],{activateTrap:function(t){if(k.length>0){var e=k[k.length-1];e!==t&&e.pause()}var n=k.indexOf(t);-1===n||k.splice(n,1),k.push(t)},deactivateTrap:function(t){var e=k.indexOf(t);-1!==e&&k.splice(e,1),k.length>0&&k[k.length-1].unpause()}}),T=function(t){return setTimeout(t,0)},A=function(t,e){var n=-1;return t.every((function(t,i){return!e(t)||(n=i,!1)})),n},C=function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];return"function"==typeof t?t.apply(void 0,n):t},D=function(t){return t.target.shadowRoot&&"function"==typeof t.composedPath?t.composedPath()[0]:t.target},O=function(t,e){var n,i=(null==e?void 0:e.document)||document,o=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?E(Object(n),!0).forEach((function(e){x(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({returnFocusOnDeactivate:!0,escapeDeactivates:!0,delayInitialFocus:!0},e),r={containers:[],tabbableGroups:[],nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1,delayInitialFocusTimer:void 0},s=function(t,e,n){return t&&void 0!==t[e]?t[e]:o[n||e]},a=function(t){return!(!t||!r.containers.some((function(e){return e.contains(t)})))},c=function(t){var e=o[t];if("function"==typeof e){for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];e=e.apply(void 0,r)}if(!e){if(void 0===e||!1===e)return e;throw new Error("`".concat(t,"` was specified but was not a node, or did not return a node"))}var a=e;if("string"==typeof e&&!(a=i.querySelector(e)))throw new Error("`".concat(t,"` as selector refers to no known node"));return a},l=function(){var t=c("initialFocus");if(!1===t)return!1;if(void 0===t)if(a(i.activeElement))t=i.activeElement;else{var e=r.tabbableGroups[0];t=e&&e.firstTabbableNode||c("fallbackFocus")}if(!t)throw new Error("Your focus-trap needs to have at least one focusable element");return t},f=function(){if(r.tabbableGroups=r.containers.map((function(t){var e,n,i,o=(n=[],i=[],u(t,(e=e||{}).includeContainer,b.bind(null,e)).forEach((function(t,e){var o=d(t);0===o?n.push(t):i.push({documentOrder:e,tabIndex:o,node:t})})),i.sort(h).map((function(t){return t.node})).concat(n));if(o.length>0)return{container:t,firstTabbableNode:o[0],lastTabbableNode:o[o.length-1]}})).filter((function(t){return!!t})),r.tabbableGroups.length<=0&&!c("fallbackFocus"))throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times")},p=function t(e){!1!==e&&e!==i.activeElement&&(e&&e.focus?(e.focus({preventScroll:!!o.preventScroll}),r.mostRecentlyFocusedNode=e,function(t){return t.tagName&&"input"===t.tagName.toLowerCase()&&"function"==typeof t.select}(e)&&e.select()):t(l()))},m=function(t){var e=c("setReturnFocus",t);return e||!1!==e&&t},v=function(t){var e=D(t);a(e)||(C(o.clickOutsideDeactivates,t)?n.deactivate({returnFocus:o.returnFocusOnDeactivate&&!w(e)}):C(o.allowOutsideClick,t)||t.preventDefault())},y=function(t){var e=D(t),n=a(e);n||e instanceof Document?n&&(r.mostRecentlyFocusedNode=e):(t.stopImmediatePropagation(),p(r.mostRecentlyFocusedNode||l()))},k=function(t){if(function(t){return"Escape"===t.key||"Esc"===t.key||27===t.keyCode}(t)&&!1!==C(o.escapeDeactivates,t))return t.preventDefault(),void n.deactivate();(function(t){return"Tab"===t.key||9===t.keyCode})(t)&&function(t){var e=D(t);f();var n=null;if(r.tabbableGroups.length>0){var i=A(r.tabbableGroups,(function(t){return t.container.contains(e)}));if(i<0)n=t.shiftKey?r.tabbableGroups[r.tabbableGroups.length-1].lastTabbableNode:r.tabbableGroups[0].firstTabbableNode;else if(t.shiftKey){var o=A(r.tabbableGroups,(function(t){var n=t.firstTabbableNode;return e===n}));if(o<0&&(r.tabbableGroups[i].container===e||w(e)&&!g(e))&&(o=i),o>=0){var s=0===o?r.tabbableGroups.length-1:o-1;n=r.tabbableGroups[s].lastTabbableNode}}else{var a=A(r.tabbableGroups,(function(t){var n=t.lastTabbableNode;return e===n}));if(a<0&&(r.tabbableGroups[i].container===e||w(e)&&!g(e))&&(a=i),a>=0){var l=a===r.tabbableGroups.length-1?0:a+1;n=r.tabbableGroups[l].firstTabbableNode}}}else n=c("fallbackFocus");n&&(t.preventDefault(),p(n))}(t)},O=function(t){if(!C(o.clickOutsideDeactivates,t)){var e=D(t);a(e)||C(o.allowOutsideClick,t)||(t.preventDefault(),t.stopImmediatePropagation())}},N=function(){if(r.active)return L.activateTrap(n),r.delayInitialFocusTimer=o.delayInitialFocus?T((function(){p(l())})):p(l()),i.addEventListener("focusin",y,!0),i.addEventListener("mousedown",v,{capture:!0,passive:!1}),i.addEventListener("touchstart",v,{capture:!0,passive:!1}),i.addEventListener("click",O,{capture:!0,passive:!1}),i.addEventListener("keydown",k,{capture:!0,passive:!1}),n},S=function(){if(r.active)return i.removeEventListener("focusin",y,!0),i.removeEventListener("mousedown",v,!0),i.removeEventListener("touchstart",v,!0),i.removeEventListener("click",O,!0),i.removeEventListener("keydown",k,!0),n};return(n={activate:function(t){if(r.active)return this;var e=s(t,"onActivate"),n=s(t,"onPostActivate"),o=s(t,"checkCanFocusTrap");o||f(),r.active=!0,r.paused=!1,r.nodeFocusedBeforeActivation=i.activeElement,e&&e();var a=function(){o&&f(),N(),n&&n()};return o?(o(r.containers.concat()).then(a,a),this):(a(),this)},deactivate:function(t){if(!r.active)return this;clearTimeout(r.delayInitialFocusTimer),r.delayInitialFocusTimer=void 0,S(),r.active=!1,r.paused=!1,L.deactivateTrap(n);var e=s(t,"onDeactivate"),i=s(t,"onPostDeactivate"),o=s(t,"checkCanReturnFocus");e&&e();var a=s(t,"returnFocus","returnFocusOnDeactivate"),c=function(){T((function(){a&&p(m(r.nodeFocusedBeforeActivation)),i&&i()}))};return a&&o?(o(m(r.nodeFocusedBeforeActivation)).then(c,c),this):(c(),this)},pause:function(){return r.paused||!r.active||(r.paused=!0,S()),this},unpause:function(){return r.paused&&r.active?(r.paused=!1,f(),N(),this):this},updateContainerElements:function(t){var e=[].concat(t).filter(Boolean);return r.containers=e.map((function(t){return"string"==typeof t?i.querySelector(t):t})),r.active&&f(),this}}).updateContainerElements(t),n};function N(t){return t.split("-")[0]}function S(t){return t.split("-")[1]}function R(t){return["top","bottom"].includes(N(t))?"x":"y"}function F(t){return"y"===t?"height":"width"}function M(t){let{reference:e,floating:n,placement:i}=t;const o=e.x+e.width/2-n.width/2,r=e.y+e.height/2-n.height/2;let s;switch(N(i)){case"top":s={x:o,y:e.y-n.height};break;case"bottom":s={x:o,y:e.y+e.height};break;case"right":s={x:e.x+e.width,y:r};break;case"left":s={x:e.x-n.width,y:r};break;default:s={x:e.x,y:e.y}}const a=R(i),c=F(a);switch(S(i)){case"start":s[a]=s[a]-(e[c]/2-n[c]/2);break;case"end":s[a]=s[a]+(e[c]/2-n[c]/2)}return s}function P(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function H(t,e){void 0===e&&(e={});const{x:n,y:i,platform:o,rects:r,elements:s,strategy:a}=t,{boundary:c="clippingParents",rootBoundary:l="viewport",elementContext:u="floating",altBoundary:d=!1,padding:h=0}=e,f=function(t){return"number"!=typeof t?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}(h),p=s[d?"floating"===u?"reference":"floating":u],m=await o.getClippingClientRect({element:await o.isElement(p)?p:p.contextElement||await o.getDocumentElement({element:s.floating}),boundary:c,rootBoundary:l}),b=P(await o.convertOffsetParentRelativeRectToViewportRelativeRect({rect:"floating"===u?{...r.floating,x:n,y:i}:r.reference,offsetParent:await o.getOffsetParent({element:s.floating}),strategy:a}));return{top:m.top-b.top+f.top,bottom:b.bottom-m.bottom+f.bottom,left:m.left-b.left+f.left,right:b.right-m.right+f.right}}const I=Math.min,B=Math.max;function j(t,e,n){return B(t,I(e,n))}const G={left:"right",right:"left",bottom:"top",top:"bottom"};function W(t){return t.replace(/left|right|bottom|top/g,(t=>G[t]))}function K(t,e){const n="start"===S(t),i=R(t),o=F(i);let r="x"===i?n?"right":"left":n?"bottom":"top";return e.reference[o]>e.floating[o]&&(r=W(r)),{main:r,cross:W(r)}}const q={start:"end",end:"start"};function $(t){return t.replace(/start|end/g,(t=>q[t]))}["top","right","bottom","left"].reduce(((t,e)=>t.concat(e,e+"-start",e+"-end")),[]);const V=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var n,i;const{placement:o,middlewareData:r,rects:s,initialPlacement:a}=e;if(null!=(n=r.flip)&&n.skip)return{};const{mainAxis:c=!0,crossAxis:l=!0,fallbackPlacements:u,fallbackStrategy:d="bestFit",flipAlignment:h=!0,...f}=t,p=N(o),m=[a,...u||(p!==a&&h?function(t){const e=W(t);return[$(t),e,$(e)]}(a):[W(a)])],b=await H(e,f),v=[];let g=(null==(i=r.flip)?void 0:i.overflows)||[];if(c&&v.push(b[p]),l){const{main:t,cross:e}=K(o,s);v.push(b[t],b[e])}if(g=[...g,{placement:o,overflows:v}],!v.every((t=>t<=0))){var y,w;const t=(null!=(y=null==(w=r.flip)?void 0:w.index)?y:0)+1,e=m[t];if(e)return{data:{index:t,overflows:g},reset:{placement:e}};let n="bottom";switch(d){case"bestFit":{var E;const t=null==(E=g.slice().sort(((t,e)=>t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)-e.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)))[0])?void 0:E.placement;t&&(n=t);break}case"initialPlacement":n=a}return{data:{skip:!0},reset:{placement:n}}}return{}}}};const _=function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:n,y:i,placement:o}=e,{mainAxis:r=!0,crossAxis:s=!1,limiter:a={fn:t=>{let{x:e,y:n}=t;return{x:e,y:n}}},...c}=t,l={x:n,y:i},u=await H(e,c),d=R(N(o)),h=function(t){return"x"===t?"y":"x"}(d);let f=l[d],p=l[h];if(r){const t="y"===d?"bottom":"right";f=j(f+u["y"===d?"top":"left"],f,f-u[t])}if(s){const t="y"===h?"bottom":"right";p=j(p+u["y"===h?"top":"left"],p,p-u[t])}const m=a.fn({...e,[d]:f,[h]:p});return{...m,data:{x:m.x-n,y:m.y-i}}}}},U=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){var n;const{placement:i,rects:o,middlewareData:r}=e,{apply:s,...a}=t;if(null!=(n=r.size)&&n.skip)return{};const c=await H(e,a),l=N(i),u="end"===S(i);let d,h;"top"===l||"bottom"===l?(d=l,h=u?"left":"right"):(h=l,d=u?"top":"bottom");const f=B(c.left,0),p=B(c.right,0),m=B(c.top,0),b=B(c.bottom,0),v={height:o.floating.height-(["left","right"].includes(i)?2*(0!==m||0!==b?m+b:B(c.top,c.bottom)):c[d]),width:o.floating.width-(["top","bottom"].includes(i)?2*(0!==f||0!==p?f+p:B(c.left,c.right)):c[h])};return null==s||s({...v,...o}),{data:{skip:!0},reset:{rects:!0}}}}};function Y(t){return"[object Window]"===(null==t?void 0:t.toString())}function z(t){if(null==t)return window;if(!Y(t)){const e=t.ownerDocument;return e&&e.defaultView||window}return t}function X(t){return z(t).getComputedStyle(t)}function J(t){return Y(t)?"":t?(t.nodeName||"").toLowerCase():""}function Q(t){return t instanceof z(t).HTMLElement}function Z(t){return t instanceof z(t).Element}function tt(t){return t instanceof z(t).ShadowRoot||t instanceof ShadowRoot}function et(t){const{overflow:e,overflowX:n,overflowY:i}=X(t);return/auto|scroll|overlay|hidden/.test(e+i+n)}function nt(t){return["table","td","th"].includes(J(t))}function it(t){const e=navigator.userAgent.toLowerCase().includes("firefox"),n=X(t);return"none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||["transform","perspective"].includes(n.willChange)||e&&"filter"===n.willChange||e&&!!n.filter&&"none"!==n.filter}const ot=Math.min,rt=Math.max,st=Math.round;function at(t,e){void 0===e&&(e=!1);const n=t.getBoundingClientRect();let i=1,o=1;return e&&Q(t)&&(i=t.offsetWidth>0&&st(n.width)/t.offsetWidth||1,o=t.offsetHeight>0&&st(n.height)/t.offsetHeight||1),{width:n.width/i,height:n.height/o,top:n.top/o,right:n.right/i,bottom:n.bottom/o,left:n.left/i,x:n.left/i,y:n.top/o}}function ct(t){return(e=t,(e instanceof z(e).Node?t.ownerDocument:t.document)||window.document).documentElement;var e}function lt(t){return Y(t)?{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}:{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}}function ut(t){return at(ct(t)).left+lt(t).scrollLeft}function dt(t,e,n){const i=Q(e),o=ct(e),r=at(t,i&&function(t){const e=at(t);return st(e.width)!==t.offsetWidth||st(e.height)!==t.offsetHeight}(e));let s={scrollLeft:0,scrollTop:0};const a={x:0,y:0};if(i||!i&&"fixed"!==n)if(("body"!==J(e)||et(o))&&(s=lt(e)),Q(e)){const t=at(e,!0);a.x=t.x+e.clientLeft,a.y=t.y+e.clientTop}else o&&(a.x=ut(o));return{x:r.left+s.scrollLeft-a.x,y:r.top+s.scrollTop-a.y,width:r.width,height:r.height}}function ht(t){return"html"===J(t)?t:t.assignedSlot||t.parentNode||(tt(t)?t.host:null)||ct(t)}function ft(t){return Q(t)&&"fixed"!==getComputedStyle(t).position?t.offsetParent:null}function pt(t){const e=z(t);let n=ft(t);for(;n&&nt(n)&&"static"===getComputedStyle(n).position;)n=ft(n);return n&&("html"===J(n)||"body"===J(n)&&"static"===getComputedStyle(n).position&&!it(n))?e:n||function(t){let e=ht(t);for(;Q(e)&&!["html","body"].includes(J(e));){if(it(e))return e;e=e.parentNode}return null}(t)||e}function mt(t){return{width:t.offsetWidth,height:t.offsetHeight}}function bt(t){return["html","body","#document"].includes(J(t))?t.ownerDocument.body:Q(t)&&et(t)?t:bt(ht(t))}function vt(t,e){var n;void 0===e&&(e=[]);const i=bt(t),o=i===(null==(n=t.ownerDocument)?void 0:n.body),r=z(i),s=o?[r].concat(r.visualViewport||[],et(i)?i:[]):i,a=e.concat(s);return o?a:a.concat(vt(ht(s)))}function gt(t,e){return"viewport"===e?P(function(t){const e=z(t),n=ct(t),i=e.visualViewport;let o=n.clientWidth,r=n.clientHeight,s=0,a=0;return i&&(o=i.width,r=i.height,Math.abs(e.innerWidth/i.scale-i.width)<.01&&(s=i.offsetLeft,a=i.offsetTop)),{width:o,height:r,x:s,y:a}}(t)):Z(e)?function(t){const e=at(t),n=e.top+t.clientTop,i=e.left+t.clientLeft;return{top:n,left:i,x:i,y:n,right:i+t.clientWidth,bottom:n+t.clientHeight,width:t.clientWidth,height:t.clientHeight}}(e):P(function(t){var e;const n=ct(t),i=lt(t),o=null==(e=t.ownerDocument)?void 0:e.body,r=rt(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),s=rt(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0);let a=-i.scrollLeft+ut(t);const c=-i.scrollTop;return"rtl"===X(o||n).direction&&(a+=rt(n.clientWidth,o?o.clientWidth:0)-r),{width:r,height:s,x:a,y:c}}(ct(t)))}function yt(t){const e=vt(ht(t)),n=["absolute","fixed"].includes(X(t).position)&&Q(t)?pt(t):t;return Z(n)?e.filter((t=>Z(t)&&function(t,e){const n=null==e.getRootNode?void 0:e.getRootNode();if(t.contains(e))return!0;if(n&&tt(n)){let n=e;do{if(n&&t===n)return!0;n=n.parentNode||n.host}while(n)}return!1}(t,n)&&"body"!==J(t))):[]}const wt={getElementRects:t=>{let{reference:e,floating:n,strategy:i}=t;return{reference:dt(e,pt(n),i),floating:{...mt(n),x:0,y:0}}},convertOffsetParentRelativeRectToViewportRelativeRect:t=>function(t){let{rect:e,offsetParent:n,strategy:i}=t;const o=Q(n),r=ct(n);if(n===r)return e;let s={scrollLeft:0,scrollTop:0};const a={x:0,y:0};if((o||!o&&"fixed"!==i)&&(("body"!==J(n)||et(r))&&(s=lt(n)),Q(n))){const t=at(n,!0);a.x=t.x+n.clientLeft,a.y=t.y+n.clientTop}return{...e,x:e.x-s.scrollLeft+a.x,y:e.y-s.scrollTop+a.y}}(t),getOffsetParent:t=>{let{element:e}=t;return pt(e)},isElement:t=>Z(t),getDocumentElement:t=>{let{element:e}=t;return ct(e)},getClippingClientRect:t=>function(t){let{element:e,boundary:n,rootBoundary:i}=t;const o=[..."clippingParents"===n?yt(e):[].concat(n),i],r=o[0],s=o.reduce(((t,n)=>{const i=gt(e,n);return t.top=rt(i.top,t.top),t.right=ot(i.right,t.right),t.bottom=ot(i.bottom,t.bottom),t.left=rt(i.left,t.left),t}),gt(e,r));return s.width=s.right-s.left,s.height=s.bottom-s.top,s.x=s.left,s.y=s.top,s}(t),getDimensions:t=>{let{element:e}=t;return mt(e)},getClientRects:t=>{let{element:e}=t;return e.getClientRects()}},Et=(t,e,n)=>(async(t,e,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:s}=n;let a=await s.getElementRects({reference:t,floating:e,strategy:o}),{x:c,y:l}=M({...a,placement:i}),u=i,d={};for(let n=0;n<r.length;n++){const{name:h,fn:f}=r[n],{x:p,y:m,data:b,reset:v}=await f({x:c,y:l,initialPlacement:i,placement:u,strategy:o,middlewareData:d,rects:a,platform:s,elements:{reference:t,floating:e}});c=null!=p?p:c,l=null!=m?m:l,d={...d,[h]:null!=b?b:{}},v&&("object"==typeof v&&(v.placement&&(u=v.placement),v.rects&&(a=!0===v.rects?await s.getElementRects({reference:t,floating:e,strategy:o}):v.rects),({x:c,y:l}=M({...a,placement:u}))),n=-1)}return{x:c,y:l,placement:u,strategy:o,middlewareData:d}})(t,e,{platform:wt,...n});class xt extends HTMLElement{static duration=1e4;timeouts=new Map;index=0;connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","status"),this.hasAttribute("aria-live")||this.setAttribute("aria-live","polite"),this.hasAttribute("aria-relevant")||this.setAttribute("aria-relevant","additions")}show(e,n={}){const o=n.key||String(this.index++);this.dismiss(o),e.dataset.key=o,t(this.children,(()=>{this.append(e),i(e)}));const r=void 0!==n.duration?Number(n.duration):xt.duration;return r>0&&(this.startTimeout(e,r),e.addEventListener("mouseenter",this.clearTimeout.bind(this,e)),e.addEventListener("focusin",this.clearTimeout.bind(this,e)),e.addEventListener("mouseleave",this.startTimeout.bind(this,e,r)),e.addEventListener("focusout",this.startTimeout.bind(this,e,r))),o}dismiss(e){if("string"!=typeof e)t(this.children,(()=>{o(e,{finish:()=>this.removeChild(e)})})),this.clearTimeout(e);else{const t=this.querySelector(`[data-key="${e}"]`);t&&this.dismiss(t)}}clear(){for(const t of this.children)this.dismiss(t)}speak(t){const e=document.createElement("div");Object.assign(e.style,{clip:"rect(0 0 0 0)",clipPath:"inset(50%)",height:"1px",overflow:"hidden",position:"absolute",whiteSpace:"nowrap",width:"1px"}),e.textContent=t,this.show(e)}startTimeout(t,e){this.clearTimeout(t),this.timeouts.set(t,window.setTimeout((()=>{this.dismiss(t)}),e))}clearTimeout(t){this.timeouts.has(t)&&clearTimeout(this.timeouts.get(t))}}class kt extends HTMLElement{static searchDelay=800;search="";searchTimeout;connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","menu"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),this.items.forEach((t=>{t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1")})),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){this.removeEventListener("keydown",this.onKeyDown)}get items(){return Array.from(this.querySelectorAll("[role^=menuitem]"))}onKeyDown=t=>{if(!this.hidden)return"ArrowUp"===t.key?(this.navigate(-1),void t.preventDefault()):"ArrowDown"===t.key?(this.navigate(1),void t.preventDefault()):void(t.key.length>1||t.ctrlKey||t.metaKey||t.altKey||(this.search+=t.key.toLowerCase(),t.preventDefault(),clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout((()=>{this.search=""}),kt.searchDelay),this.items.some((t=>{if(0===t.textContent?.trim().toLowerCase().indexOf(this.search))return t.focus(),!0}))))};navigate(t){const e=this.items;let n=(document.activeElement instanceof HTMLElement?e.indexOf(document.activeElement):-1)+t;n<0&&(n=e.length-1),n>=e.length&&(n=0),e[n]?.focus()}}class Lt extends HTMLElement{static attention=t=>t.animate([{transform:"scale(1)"},{transform:"scale(1.1)"},{transform:"scale(1)"}],300);static get observedAttributes(){return["open"]}trigger;focusTrap;constructor(){super();const t=document.createElement("template");t.innerHTML='\n            <div part="backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>\n            <div part="content" style="z-index: 1"><slot></slot></div>\n        ';const e=this.attachShadow({mode:"open"});e.appendChild(t.content.cloneNode(!0)),this.backdrop.addEventListener("click",(()=>{this.hasAttribute("static")?Lt.attention?.(e.children[1]):this.close()})),this.focusTrap=O(this,{escapeDeactivates:!1,allowOutsideClick:!0})}connectedCallback(){this.content?.hasAttribute("role")||this.content?.setAttribute("role","dialog"),this.content?.hasAttribute("aria-modal")||this.content?.setAttribute("aria-modal","true"),this.content?.hasAttribute("tabindex")||this.content?.setAttribute("tabindex","-1"),this.addEventListener("keydown",(t=>{"Escape"===t.key&&this.open&&(t.preventDefault(),t.stopPropagation(),this.close())}))}get open(){return this.hasAttribute("open")}set open(t){t?this.setAttribute("open",""):this.removeAttribute("open")}close(){if(!this.open)return;const t=new Event("beforeclose",{cancelable:!0});this.dispatchEvent(t)&&(this.open=!1)}attributeChangedCallback(t,e,n){"open"===t&&(null!==n?this.wasOpened():this.wasClosed())}wasOpened(){this.trigger=document.activeElement,this.hidden=!1,i(this),this.focusTrap.activate();const t=this.querySelector("[autofocus]");t?t.focus():this.content?.focus(),this.dispatchEvent(new Event("open"))}wasClosed(){this.focusTrap.deactivate(),this.trigger?.focus(),o(this,{finish:()=>this.hidden=!0}),this.dispatchEvent(new Event("close"))}get backdrop(){return this.shadowRoot?.firstElementChild}get content(){return this.firstElementChild}}class Tt extends HTMLElement{static get observedAttributes(){return["open"]}constructor(){super();const t=document.createElement("template");t.innerHTML='\n            <div part="backdrop" hidden style="position: fixed; top: 0; left: 0; right: 0; bottom: 0"></div>\n            <slot></slot>\n        ',this.attachShadow({mode:"open"}).appendChild(t.content.cloneNode(!0)),this.backdrop.onclick=()=>this.open=!1}connectedCallback(){this.backdrop.hidden=!0,this.content.hidden=!0,this.open=!1,this.button.setAttribute("aria-expanded","false"),setTimeout((()=>{"menu"===this.content.getAttribute("role")&&this.button.setAttribute("aria-haspopup","true")})),this.button.addEventListener("click",(()=>{this.open=!this.open})),this.button.addEventListener("keydown",(t=>{"ArrowDown"===t.key&&(t.preventDefault(),this.open=!0,v(this.content)[0]?.focus())})),this.addEventListener("keydown",(t=>{"Escape"===t.key&&this.open&&(t.preventDefault(),t.stopPropagation(),this.open=!1,this.button.focus())})),this.addEventListener("focusout",(t=>{t.relatedTarget instanceof Node&&this.contains(t.relatedTarget)||(this.open=!1)})),this.content.addEventListener("click",(t=>{t.target instanceof Element&&t.target.closest("[role=menuitem], [role=menuitemradio]")&&(this.open=!1,this.button.focus())}))}disconnectedCallback(){e(this.backdrop),e(this.content)}get open(){return this.hasAttribute("open")}set open(t){t?this.setAttribute("open",""):this.removeAttribute("open")}attributeChangedCallback(t,e,n){"open"===t&&(null!==n?this.wasOpened():this.wasClosed())}wasOpened(){if(!this.content.hidden)return;this.content.hidden=!1,this.backdrop.hidden=!1,i(this.content),i(this.backdrop),this.button.setAttribute("aria-expanded","true"),this.content.style.position="absolute",Et(this.button,this.content,{placement:this.getAttribute("placement")||"bottom",middleware:[_(),V(),U()]}).then((({x:t,y:e,placement:n})=>{Object.assign(this.content.style,{left:`${t}px`,top:`${e}px`}),this.content.dataset.placement=n}));const t=this.content.querySelector("[autofocus]");t?t.focus():this.content.focus(),this.dispatchEvent(new Event("open"))}wasClosed(){this.content.hidden||(this.button.setAttribute("aria-expanded","false"),o(this.backdrop,{finish:()=>this.backdrop.hidden=!0}),o(this.content,{finish:()=>this.content.hidden=!0}),this.dispatchEvent(new Event("close")))}get backdrop(){return this.shadowRoot?.firstElementChild}get button(){return this.children[0]}get content(){return this.children[1]}}class At extends HTMLElement{connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","toolbar"),this.setAttribute("tabindex","0"),this.addEventListener("focus",this.onInitialFocus,{once:!0}),this.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){this.removeEventListener("keydown",this.onKeyDown)}onInitialFocus=t=>{this.removeAttribute("tabindex"),this.focusControlAtIndex(0)};onKeyDown=t=>{if("ArrowRight"!==t.key&&"ArrowLeft"!==t.key&&"Home"!==t.key&&"End"!==t.key)return;const e=this.controls,n=this.controls.length,i=e.indexOf(t.target);if(-1===i)return;let o=0;"ArrowLeft"===t.key&&(o=i-1),"ArrowRight"===t.key&&(o=i+1),"End"===t.key&&(o=n-1),o<0&&(o=n-1),o>n-1&&(o=0),this.focusControlAtIndex(o),t.preventDefault()};focusControlAtIndex(t){this.controls.forEach(((e,n)=>{n===t?(e.setAttribute("tabindex","0"),e.focus()):e.setAttribute("tabindex","-1")}))}get controls(){return v(this)}}class Ct extends HTMLElement{static delay=100;static placement="top";static tooltipClass="tooltip";parent;tooltip;timeout;observer;showing=!1;onMouseEnter=this.afterDelay.bind(this,this.show);onFocus=this.show.bind(this);onMouseLeave=this.afterDelay.bind(this,this.hide);onBlur=this.hide.bind(this);connectedCallback(){this.parent=this.parentNode,this.parent&&(this.parent.addEventListener("mouseenter",this.onMouseEnter),this.parent.addEventListener("focus",this.onFocus),this.parent.addEventListener("mouseleave",this.onMouseLeave),this.parent.addEventListener("blur",this.onBlur),this.parent.addEventListener("click",this.onBlur),this.observer=new MutationObserver((t=>{t.forEach((t=>{"disabled"===t.attributeName&&this.hide()}))})),this.observer.observe(this.parent,{attributes:!0})),document.addEventListener("keydown",this.onKeyDown),document.addEventListener("scroll",this.onBlur)}disconnectedCallback(){this.tooltip&&(this.tooltip.remove(),this.tooltip=void 0),this.parent&&(this.parent.removeEventListener("mouseenter",this.onMouseEnter),this.parent.removeEventListener("focus",this.onFocus),this.parent.removeEventListener("mouseleave",this.onMouseLeave),this.parent.removeEventListener("blur",this.onBlur),this.parent.removeEventListener("click",this.onBlur),this.parent=void 0),document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("scroll",this.onBlur),this.observer.disconnect()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}onKeyDown=t=>{"Escape"===t.key&&this.hide()};show(){if(this.disabled)return;const t=this.createTooltip();clearTimeout(this.timeout),this.showing||(t.hidden=!1,i(t),this.showing=!0),t.innerHTML!==this.innerHTML&&(t.innerHTML=this.innerHTML),t.style.position="absolute",Et(this.parent,t,{placement:this.getAttribute("placement")||Ct.placement,middleware:[_(),V()]}).then((({x:e,y:n,placement:i})=>{Object.assign(t.style,{left:`${e}px`,top:`${n}px`}),t.dataset.placement=i}))}hide(){clearTimeout(this.timeout),this.showing&&(this.showing=!1,o(this.tooltip,{finish:()=>{this.tooltip&&(this.tooltip.hidden=!0)}}))}afterDelay(t){clearTimeout(this.timeout);const e=parseInt(this.getAttribute("delay")||"");this.timeout=window.setTimeout(t.bind(this),isNaN(e)?Ct.delay:e)}createTooltip(){return this.tooltip||(this.tooltip=document.createElement("div"),this.tooltip.className=this.getAttribute("tooltip-class")||Ct.tooltipClass,this.tooltip.hidden=!0,this.tooltip.addEventListener("mouseenter",this.show.bind(this)),this.tooltip.addEventListener("mouseleave",this.afterDelay.bind(this,this.hide)),document.body.appendChild(this.tooltip)),this.tooltip}}window.customElements.define("ui-popup",Tt),window.customElements.define("ui-tooltip",Ct),window.customElements.define("ui-menu",kt),window.customElements.define("ui-modal",Lt),window.customElements.define("ui-alerts",xt),window.customElements.define("ui-toolbar",At);
