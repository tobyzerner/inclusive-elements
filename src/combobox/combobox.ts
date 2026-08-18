import { createQueuedSync, getLookupRoot } from '../utils';

let idCounter = 0;
const internalSourceEvents = new WeakSet<Event>();

type Source = HTMLSelectElement | HTMLInputElement;
type InputAttributeState = Map<string, { original: string | null; managed: string | null }>;

const transferredAttributes = [
    'title',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-errormessage',
] as const;

type SourceState =
    | {
          source: HTMLSelectElement;
          cssHidden: boolean;
          container: HTMLDivElement;
      }
    | {
          source: HTMLInputElement;
          list: string | null;
          datalist: HTMLDataListElement | null;
          inputAttributes: InputAttributeState;
      };

export default class ComboboxElement extends HTMLElement {
    private idPrefix = 'combobox' + ++idCounter;
    private suppressedListId = this.idPrefix + '_suppressed_list';
    private sync = createQueuedSync(this, () =>
        this.sourceState ? this.render() : this.enhance(),
    );
    private observer = new MutationObserver(this.sync.queue);
    private listeners?: AbortController;
    private sourceState?: SourceState;
    private control?: HTMLDivElement;
    private tokens?: HTMLDivElement;
    private input?: HTMLInputElement;
    private listbox?: HTMLDivElement;
    private activeIndex = -1;
    private labelledBy = '';
    private generatedLabelIds: [HTMLLabelElement, string][] = [];

    public connectedCallback(): void {
        this.sync.queue();
    }

    public disconnectedCallback(): void {
        this.sync.disconnect();
        this.teardownSource();
    }

    public refresh(): void {
        const transferFocus = this.input?.matches(':focus');
        this.teardownSource();
        if (this.isConnected) this.enhance(transferFocus);
    }

    private enhance(transferFocus?: boolean): void {
        if (
            typeof HTMLElement.prototype.showPopover !== 'function' ||
            typeof HTMLElement.prototype.hidePopover !== 'function'
        ) {
            return;
        }

        const source = this.discoverSource();
        if (!source) return;

        transferFocus ??= source.matches(':focus');
        this.setupSource(source);
        this.render();
        if (transferFocus) this.input?.focus();
    }

    private setupSource(source: Source): void {
        const signal = (this.listeners = new AbortController()).signal;

        if (source instanceof HTMLSelectElement) {
            const container = document.createElement('div');
            this.sourceState = {
                source,
                cssHidden:
                    source.style.display === 'none' ||
                    (!source.hidden && getComputedStyle(source).display === 'none'),
                container,
            };
            container.hidden = true;
            container.inert = true;
            source.before(container);
            container.append(source);
            this.createGeneratedInput(source, signal);
        } else {
            this.sourceState = this.createInputState(source);
            this.input = source;
            this.addInputListeners(source, signal);
            source.addEventListener('keydown', this.onWidgetKeyDown, {
                signal,
            });
            source.addEventListener('focusout', this.onFocusOut, { signal });
            source.setAttribute('list', this.suppressedListId);
            this.observeDatalist();
        }

        const listbox = this.createListbox(signal);
        this.setInputAttribute('role', 'combobox');
        this.setInputAttribute('aria-autocomplete', 'list');
        this.setInputAttribute('aria-haspopup', 'listbox');
        this.setInputAttribute('aria-controls', listbox.id);
        if (this.multiple) {
            listbox.setAttribute('aria-multiselectable', 'true');
        }

        source.addEventListener('input', this.onSourceUpdate, { signal });
        source.addEventListener('change', this.onSourceUpdate, { signal });
        source.addEventListener('invalid', () => this.syncValidityState(), {
            signal,
        });
        this.ownerDocument.addEventListener('pointerdown', this.onDocumentPointerDown, {
            capture: true,
            signal,
        });

        this.observeSource(source);
        source.form?.addEventListener('reset', this.onFormReset, { signal });
        if (source instanceof HTMLSelectElement) {
            const labels = Array.from(source.labels);
            this.labelledBy = labels
                .map((label, index) => {
                    if (label.id) return label.id;

                    const id = `${this.idPrefix}_label_${index}`;
                    label.id = id;
                    this.generatedLabelIds.push([label, id]);
                    return id;
                })
                .join(' ');
            labels.forEach((label) => {
                label.addEventListener('click', this.onLabelClick, { signal });
            });
        }
    }

    private observeSource(source: Source): void {
        this.observer.observe(source, {
            subtree: source instanceof HTMLSelectElement,
            childList: source instanceof HTMLSelectElement,
            characterData: source instanceof HTMLSelectElement,
            attributes: true,
            attributeFilter: [
                'disabled',
                'hidden',
                'label',
                'readonly',
                'required',
                'selected',
                'tabindex',
                'value',
                'aria-invalid',
                ...transferredAttributes,
            ],
        });
        for (let ancestor = source.parentElement; ancestor; ancestor = ancestor.parentElement) {
            if (ancestor instanceof HTMLFieldSetElement) {
                this.observer.observe(ancestor, {
                    attributes: true,
                    attributeFilter: ['disabled'],
                });
            }
        }
    }

    private teardownSource(): void {
        const state = this.sourceState;
        if (!state) return;

        this.listeners?.abort();
        this.listeners = undefined;
        this.observer.disconnect();
        this.generatedLabelIds.forEach(([label, id]) => {
            if (label.id === id) label.removeAttribute('id');
        });
        this.generatedLabelIds = [];
        this.labelledBy = '';

        if (!('cssHidden' in state)) {
            const list = state.source.getAttribute('list');
            if (list !== this.suppressedListId) state.list = list;

            this.restoreInputAttributes(state.source, state.inputAttributes);
            if (state.list !== null) {
                state.source.setAttribute('list', state.list);
            } else {
                state.source.removeAttribute('list');
            }
        } else {
            state.container.replaceWith(...state.container.childNodes);
        }

        this.control?.remove();
        this.listbox?.remove();

        this.sourceState = undefined;
        this.control = undefined;
        this.tokens = undefined;
        this.input = undefined;
        this.listbox = undefined;
        this.activeIndex = -1;
    }

    private render(): void {
        const state = this.sourceState;
        if (!state) return;

        if ('cssHidden' in state && this.control) {
            this.control.hidden = this.sourceHidden;
        }

        this.syncInputState();

        if (state.source instanceof HTMLSelectElement) {
            this.syncInputDisplay();
            this.renderTokens();
        }

        this.renderOptions();
    }

    private createGeneratedInput(source: HTMLSelectElement, signal: AbortSignal): void {
        this.control = document.createElement('div');
        this.control.setAttribute('data-combobox-control', '');
        this.control.addEventListener('focusout', this.onFocusOut, { signal });
        this.control.addEventListener('mousedown', this.onControlMouseDown, {
            signal,
        });
        this.control.addEventListener('click', this.onControlClick, { signal });
        this.control.addEventListener('keydown', this.onWidgetKeyDown, {
            signal,
        });
        this.append(this.control);

        if (this.multiple) {
            this.tokens = document.createElement('div');
            this.tokens.setAttribute('data-combobox-tokens', '');
            this.control.append(this.tokens);
        }

        this.input = document.createElement('input');
        this.input.type = 'text';
        const form = source.getAttribute('form');
        if (form !== null) this.input.setAttribute('form', form);
        this.addInputListeners(this.input, signal);
        this.control.append(this.input);
    }

    private createListbox(signal: AbortSignal): HTMLDivElement {
        this.listbox = document.createElement('div');
        this.listbox.id = this.idPrefix + '_listbox';
        this.listbox.setAttribute('role', 'listbox');
        this.listbox.setAttribute('popover', 'manual');
        this.listbox.addEventListener(
            'mousedown',
            (e) => {
                if ((e.target as Element | null)?.closest('[role="option"]')) {
                    e.preventDefault();
                }
            },
            { signal },
        );
        this.listbox.addEventListener('click', this.onListboxClick, { signal });

        this.append(this.listbox);
        return this.listbox;
    }

    private syncInputState(): void {
        const state = this.sourceState;
        const input = this.input;
        if (!state || !input) return;

        this.setInputAttribute('aria-expanded', String(this.isOpen()));

        if (state.source instanceof HTMLSelectElement) {
            transferredAttributes.forEach((attribute) => {
                this.setInputAttribute(attribute, state.source.getAttribute(attribute));
            });

            if (
                !state.source.hasAttribute('aria-label') &&
                !state.source.hasAttribute('aria-labelledby') &&
                this.labelledBy
            ) {
                input.setAttribute('aria-labelledby', this.labelledBy);
            }

            input.disabled = state.source.disabled;
            input.tabIndex = state.source.tabIndex;
            this.setInputAttribute('aria-required', state.source.required ? 'true' : null);
        }

        this.syncValidityState();

        if (!this.editable) this.close();
    }

    private syncValidityState(): void {
        const source = this.sourceState?.source;
        if (!(source instanceof HTMLSelectElement) || !this.input) return;

        this.input.setCustomValidity(source.validity.valid ? '' : source.validationMessage);
        const invalid =
            source.getAttribute('aria-invalid') ?? (!source.validity.valid ? 'true' : null);
        this.setInputAttribute('aria-invalid', invalid);
    }

    private addInputListeners(input: HTMLInputElement, signal: AbortSignal): void {
        input.addEventListener('input', this.onInput, { signal });
        input.addEventListener('keydown', this.onKeyDown, { signal });
        input.addEventListener('focus', this.onInputFocus, { signal });
        input.addEventListener('click', this.onInputClick, { signal });
    }

    private restoreInputAttributes(input: HTMLInputElement, attributes: InputAttributeState) {
        attributes.forEach(({ original, managed }, name) => {
            if (input.getAttribute(name) !== managed) return;

            if (original === null) {
                input.removeAttribute(name);
            } else {
                input.setAttribute(name, original);
            }
        });
    }

    private setInputAttribute(name: string, value: string | null): void {
        const input = this.input;
        const state = this.sourceState;
        if (!input || !state) return;

        if (!('cssHidden' in state)) {
            const attribute = state.inputAttributes.get(name);
            if (attribute) attribute.managed = value;
        }

        if (value === null) {
            input.removeAttribute(name);
        } else {
            input.setAttribute(name, value);
        }
    }

    private renderTokens(): void {
        const source = this.sourceState?.source;
        if (!this.tokens || !(source instanceof HTMLSelectElement)) return;

        const selectedOptions = Array.from(source.selectedOptions).filter(
            (option) => option.value !== '',
        );
        this.tokens.replaceChildren(
            ...selectedOptions.map((option) => {
                const token = document.createElement('span');
                token.setAttribute('data-combobox-token', '');
                const label = this.optionLabel(option);
                token.textContent = label + ' ';

                const remove = document.createElement('button');
                remove.type = 'button';
                remove.setAttribute('data-combobox-token-remove', '');
                remove.dataset.optionIndex = String(option.index);
                remove.setAttribute('aria-label', `Remove ${label}`);
                remove.disabled = source.disabled || this.isOptionDisabled(option);
                remove.tabIndex = -1;
                remove.textContent = '×';

                token.append(remove);
                return token;
            }),
        );
    }

    private renderOptions(): void {
        if (!this.listbox) return;

        const options = this.filteredOptions();
        if (this.activeIndex >= options.length) {
            this.activeIndex = this.firstEnabledIndex(options);
        }

        const children: HTMLElement[] = [];
        const groups = new Map<HTMLOptGroupElement, HTMLElement>();

        options.forEach((option, index) => {
            const el = document.createElement('div');
            el.id = this.idPrefix + '_option_' + index;
            el.dataset.index = String(index);
            el.setAttribute('role', 'option');
            el.setAttribute('aria-selected', String(this.isSelected(option)));
            el.textContent = this.optionLabel(option);

            if (!this.multiple && option.value === '') {
                el.setAttribute('data-placeholder', '');
            }

            if (this.isOptionDisabled(option)) {
                el.setAttribute('aria-disabled', 'true');
            }

            if (index === this.activeIndex) {
                el.setAttribute('data-active', '');
            }

            const parent = option.parentElement;
            if (parent instanceof HTMLOptGroupElement) {
                let group = groups.get(parent);
                if (!group) {
                    group = document.createElement('div');
                    group.setAttribute('role', 'group');
                    group.setAttribute('aria-label', parent.label);
                    groups.set(parent, group);
                    children.push(group);
                }
                group.append(el);
            } else {
                children.push(el);
            }
        });

        this.listbox.replaceChildren(...children);

        if (!options.length) {
            this.close();
            return;
        }

        this.syncActiveDescendant();
    }

    private syncInputDisplay(): void {
        const state = this.sourceState;
        if (!this.input || !(state?.source instanceof HTMLSelectElement)) return;

        if (this.input.matches(':focus') && (this.multiple || this.isOpen())) {
            return;
        }

        this.restoreCommittedText();
    }

    private onInput = (): void => {
        if (!this.editable) return;

        this.activeIndex = this.firstEnabledIndex(this.filteredOptions());
        this.renderOptions();
        this.open();
    };

    private onInputFocus = (): void => {
        this.syncValidityState();
        this.showSuggestions();
    };

    private onInputClick = (): void => {
        if (!this.isOpen()) {
            this.showSuggestions();
        }
    };

    private onKeyDown = (e: KeyboardEvent): void => {
        if (e.isComposing || !this.input || !this.editable) return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!this.isOpen() && this.sourceState?.source instanceof HTMLSelectElement) {
                this.showSuggestions();
            }
            this.moveActive(e.key === 'ArrowDown' ? 1 : -1);
            this.open();
            return;
        }

        if (e.key === 'Enter' && this.isOpen()) {
            e.preventDefault();
            this.chooseOption(this.filteredOptions()[this.activeIndex]);
            return;
        }

        if (
            this.multiple &&
            this.input.selectionStart === 0 &&
            this.input.selectionEnd === 0 &&
            (e.key === 'ArrowLeft' || (e.key === 'Backspace' && this.input.value === ''))
        ) {
            const lastToken = this.enabledTokenButtons().at(-1);
            if (lastToken) {
                e.preventDefault();
                lastToken.focus();
            }
        }
    };

    private onControlMouseDown = (e: MouseEvent): void => {
        if ((e.target as Element | null)?.closest('[data-combobox-token]')) {
            e.preventDefault();
        }
    };

    private onControlClick = (e: MouseEvent): void => {
        const target = e.target as Element | null;
        const remove = target?.closest<HTMLElement>('[data-combobox-token-remove]');
        if (remove) {
            const option = this.optionForToken(remove);
            if (option) {
                this.toggleOption(option);
            }
            this.input?.focus();
            return;
        }

        const token = target?.closest<HTMLElement>('[data-combobox-token]');
        if (token) {
            token.querySelector<HTMLButtonElement>('[data-combobox-token-remove]')?.focus();
            return;
        }

        this.input?.focus();
        if (!this.isOpen()) {
            this.showSuggestions();
        }
    };

    private onWidgetKeyDown = (e: KeyboardEvent): void => {
        if (e.isComposing) return;

        if (e.key === 'Escape' && this.isOpen()) {
            e.preventDefault();
            e.stopPropagation();
            this.dismiss();
            return;
        }

        const target = e.target;
        const tokenFocused =
            target instanceof HTMLButtonElement &&
            target.hasAttribute('data-combobox-token-remove');

        if (e.key === 'Tab') {
            if (tokenFocused) this.input?.focus();
            this.close();
            return;
        }

        if (!tokenFocused) return;

        const tokens = this.enabledTokenButtons();
        const index = tokens.indexOf(target);

        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            tokens[index - 1].focus();
            return;
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            (tokens[index + 1] ?? this.input)?.focus();
            return;
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            const option = this.optionForToken(target);
            if (!option) return;

            this.toggleOption(option);
            const remaining = this.enabledTokenButtons();
            const nextIndex =
                e.key === 'Backspace' ? index - 1 : Math.min(index, remaining.length - 1);
            (remaining[nextIndex] ?? this.input)?.focus();
        }
    };

    private onListboxClick = (e: MouseEvent): void => {
        const optionEl = (e.target as Element | null)?.closest<HTMLElement>('[role="option"]');
        if (!optionEl) return;

        if (this.chooseOption(this.filteredOptions()[Number(optionEl.dataset.index)])) {
            this.input?.focus();
        }
    };

    private onFocusOut = (e: FocusEvent): void => {
        const next = e.relatedTarget;
        if (next instanceof Node && this.contains(next)) return;
        this.dismiss();
    };

    private onDocumentPointerDown = (e: PointerEvent): void => {
        if (!this.isOpen() || e.composedPath().includes(this)) return;
        this.dismiss();
    };

    private onLabelClick = (e: MouseEvent): void => {
        if (
            e.defaultPrevented ||
            (e.target instanceof Element &&
                !!e.target.closest(
                    'a[href], button, input, select, textarea, summary, [contenteditable]',
                ))
        ) {
            return;
        }

        e.preventDefault();
        if (!(e.target instanceof Node && this.contains(e.target))) {
            this.input?.focus();
        }
    };

    private onSourceUpdate = (event: Event): void => {
        if (!internalSourceEvents.has(event)) this.sync.queue();
    };

    private onFormReset = (): void => {
        queueMicrotask(() => {
            this.close();
            this.sync.queue();
        });
    };

    private moveActive(delta: 1 | -1): void {
        const options = this.filteredOptions();
        if (!options.length) {
            this.activeIndex = -1;
            this.syncActiveDescendant();
            return;
        }

        let index = this.activeIndex === -1 && delta === -1 ? options.length : this.activeIndex;
        for (let i = 0; i < options.length; i++) {
            index = (index + delta + options.length) % options.length;
            if (!this.isOptionDisabled(options[index])) {
                this.activeIndex = index;
                this.renderOptions();
                return;
            }
        }
    }

    private showSuggestions(): void {
        const state = this.sourceState;
        if (!state || !this.input || !this.editable) return;

        if (state.source instanceof HTMLSelectElement) {
            this.input.value = '';
        }

        const options = this.filteredOptions();
        const selectedIndex = options.findIndex(
            (option) => this.isSelected(option) && !this.isOptionDisabled(option),
        );
        this.activeIndex =
            state.source instanceof HTMLSelectElement && selectedIndex !== -1
                ? selectedIndex
                : this.firstEnabledIndex(options);
        this.renderOptions();
        this.open();
    }

    private chooseOption(option?: HTMLOptionElement): boolean {
        const state = this.sourceState;
        if (!state || !option || !this.editable || this.isOptionDisabled(option)) {
            return false;
        }

        if (this.multiple) {
            this.toggleOption(option);
            return true;
        }

        if (state.source instanceof HTMLSelectElement) {
            if (!option.selected) {
                option.selected = true;
                this.emitSourceUpdate(state.source);
            }
        } else {
            if (state.source.value !== option.value) {
                state.source.value = option.value;
            }
            this.emitSourceUpdate(state.source);
        }

        this.syncValidityState();
        this.dismiss();
        return true;
    }

    private toggleOption(option: HTMLOptionElement): void {
        const state = this.sourceState;
        if (
            !(state?.source instanceof HTMLSelectElement) ||
            !this.editable ||
            this.isOptionDisabled(option)
        ) {
            return;
        }

        option.selected = !option.selected;
        this.emitSourceUpdate(state.source);
        this.syncValidityState();

        if (this.input) {
            this.input.value = '';
        }

        this.activeIndex = this.firstEnabledIndex(this.filteredOptions());
        this.renderTokens();
        this.renderOptions();
    }

    private emitSourceUpdate(source: Source): void {
        for (const type of ['input', 'change']) {
            const event = new Event(type, {
                bubbles: true,
                composed: type === 'input',
            });
            internalSourceEvents.add(event);
            source.dispatchEvent(event);
        }
    }

    private restoreCommittedText(): void {
        const state = this.sourceState;
        if (!this.input || !(state?.source instanceof HTMLSelectElement)) return;

        if (this.multiple) {
            this.input.value = '';
            return;
        }

        const selected = state.source.options.item(state.source.selectedIndex);
        const label = selected ? this.optionLabel(selected) : '';
        this.input.placeholder = label;
        this.input.value = selected?.value ? label : '';
    }

    private open(): void {
        if (!this.listbox || !this.input) return;
        if (!this.listbox.childElementCount) {
            this.close();
            return;
        }

        const wasOpen = this.isOpen();
        this.setInputAttribute('aria-expanded', 'true');

        if (!wasOpen) {
            const source = this.control ?? this.input;
            (
                this.listbox as HTMLElement & {
                    showPopover(options: { source: HTMLElement }): void;
                }
            ).showPopover({ source });
        }

        this.syncActiveDescendant();

        if (wasOpen) {
            this.scrollActiveOptionIntoView();
        } else {
            requestAnimationFrame(() => this.scrollActiveOptionIntoView());
        }
    }

    private close(): void {
        if (!this.listbox || !this.input) return;

        if (this.isOpen()) this.listbox.hidePopover();
        this.setInputAttribute('aria-expanded', 'false');
        this.activeIndex = -1;
        this.syncActiveDescendant();
    }

    private dismiss(): void {
        this.close();
        this.restoreCommittedText();
    }

    private isOpen(): boolean {
        return this.listbox?.matches(':popover-open') ?? false;
    }

    private get activeOption(): HTMLElement | undefined {
        return (
            this.listbox?.querySelector<HTMLElement>(
                `[role="option"][data-index="${this.activeIndex}"]`,
            ) ?? undefined
        );
    }

    private syncActiveDescendant(): void {
        if (!this.input) return;

        const option = this.activeOption;
        if (this.isOpen() && option) {
            this.setInputAttribute('aria-activedescendant', option.id);
        } else {
            this.setInputAttribute('aria-activedescendant', null);
        }
    }

    private scrollActiveOptionIntoView(): void {
        const listbox = this.listbox;
        const option = this.activeOption;
        if (!listbox || !option || !this.isOpen() || !listbox.clientHeight) {
            return;
        }

        const listboxRect = listbox.getBoundingClientRect();
        const optionRect = option.getBoundingClientRect();
        const visibleTop = listboxRect.top + listbox.clientTop;
        const visibleBottom = visibleTop + listbox.clientHeight;

        if (optionRect.top < visibleTop) {
            listbox.scrollTop -= visibleTop - optionRect.top;
        } else if (optionRect.bottom > visibleBottom) {
            listbox.scrollTop += optionRect.bottom - visibleBottom;
        }
    }

    private enabledTokenButtons(): HTMLButtonElement[] {
        return this.tokens
            ? Array.from(
                  this.tokens.querySelectorAll<HTMLButtonElement>(
                      '[data-combobox-token-remove]:not(:disabled)',
                  ),
              )
            : [];
    }

    private optionForToken(token: HTMLElement): HTMLOptionElement | null {
        const source = this.sourceState?.source;
        return source instanceof HTMLSelectElement
            ? source.options.item(Number(token.dataset.optionIndex))
            : null;
    }

    private filteredOptions(): HTMLOptionElement[] {
        const query = this.input?.value.trim().toLowerCase() ?? '';

        return this.options().filter((option) => {
            if (!query) return true;

            return (
                this.optionLabel(option).toLowerCase().includes(query) ||
                option.value.toLowerCase().includes(query)
            );
        });
    }

    private options(): HTMLOptionElement[] {
        const state = this.sourceState;
        if (!state) return [];

        if (state.source instanceof HTMLSelectElement) {
            return Array.from(state.source.options).filter(
                (option) =>
                    (!this.multiple || (option.value !== '' && !option.selected)) &&
                    !!this.optionLabel(option).trim() &&
                    !option.hidden &&
                    !(
                        option.parentElement instanceof HTMLOptGroupElement &&
                        option.parentElement.hidden
                    ),
            );
        }

        const datalist = 'datalist' in state ? state.datalist : null;
        return datalist ? Array.from(datalist.options).filter((option) => !option.hidden) : [];
    }

    private firstEnabledIndex(options: HTMLOptionElement[]): number {
        return options.findIndex((option) => !this.isOptionDisabled(option));
    }

    private isOptionDisabled(option: HTMLOptionElement): boolean {
        return (
            option.disabled ||
            (option.parentElement instanceof HTMLOptGroupElement && option.parentElement.disabled)
        );
    }

    private optionLabel(option: HTMLOptionElement): string {
        const source = this.sourceState?.source;
        return source instanceof HTMLInputElement
            ? option.label || option.value || option.textContent || ''
            : option.label || option.textContent || option.value;
    }

    private isSelected(option: HTMLOptionElement): boolean {
        const source = this.sourceState?.source;
        return source instanceof HTMLInputElement ? source.value === option.value : option.selected;
    }

    private observeDatalist(): void {
        const state = this.sourceState;
        const datalist = state && 'datalist' in state ? state.datalist : null;
        if (!datalist) return;

        this.observer.observe(datalist, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['disabled', 'hidden', 'label', 'value'],
        });
    }

    private discoverSource(): Source | undefined {
        const candidates = Array.from(this.children).filter((child): child is Source =>
            this.isSupportedSource(child),
        );

        return candidates.length === 1 ? candidates[0] : undefined;
    }

    private isSupportedSource(element: Element): element is Source {
        if (element instanceof HTMLSelectElement) return true;

        return (
            element instanceof HTMLInputElement &&
            ['text', 'search', 'email', 'url', 'tel'].includes(element.type) &&
            !(element.type === 'email' && element.multiple) &&
            !!element.getAttribute('list')
        );
    }

    private get multiple(): boolean {
        const source = this.sourceState?.source;
        return source instanceof HTMLSelectElement && source.multiple;
    }

    private get editable(): boolean {
        const source = this.sourceState?.source;
        return !!(
            source &&
            !this.sourceHidden &&
            !source.matches(':disabled') &&
            !(source instanceof HTMLInputElement && source.readOnly)
        );
    }

    private get sourceHidden(): boolean {
        const state = this.sourceState;
        return !!(state && (state.source.hidden || ('cssHidden' in state && state.cssHidden)));
    }

    private snapshotInputAttributes(input: HTMLInputElement): InputAttributeState {
        return new Map(
            [
                'role',
                'aria-autocomplete',
                'aria-haspopup',
                'aria-expanded',
                'aria-controls',
                'aria-activedescendant',
            ].map((name) => {
                const value = input.getAttribute(name);
                return [name, { original: value, managed: value }];
            }),
        );
    }

    private createInputState(source: HTMLInputElement): SourceState {
        const list = source.getAttribute('list')!;
        const datalist = getLookupRoot(this).querySelector(`#${CSS.escape(list)}`);

        return {
            source,
            list,
            datalist: datalist instanceof HTMLDataListElement ? datalist : null,
            inputAttributes: this.snapshotInputAttributes(source),
        };
    }
}
