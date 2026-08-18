import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import ComboboxElement from './combobox';

const nativeMatches = Object.getOwnPropertyDescriptor(Element.prototype, 'matches')!.value as (
    this: Element,
    selector: string,
) => boolean;
const nativeShowPopover = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'showPopover');
const nativeHidePopover = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'hidePopover');

if (!customElements.get('ui-combobox')) {
    customElements.define('ui-combobox', ComboboxElement);
}

function flushMicrotasks(): Promise<void> {
    return Promise.resolve().then(() => Promise.resolve());
}

function pressKey(target: HTMLElement, key: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function input(target: HTMLInputElement, value: string): void {
    target.value = value;
    target.dispatchEvent(new Event('input', { bubbles: true }));
}

function click(target: HTMLElement): void {
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function option(value: string, label: string, selected = false) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = selected;
    return option;
}

async function createSelectCombobox(multiple = false) {
    const label = document.createElement('label');
    const combobox = document.createElement('ui-combobox') as ComboboxElement;
    const select = document.createElement('select');

    label.htmlFor = multiple ? 'specialties' : 'country';
    label.textContent = multiple ? 'Specialties' : 'Country';
    select.id = label.htmlFor;
    select.name = multiple ? 'specialties[]' : 'country';
    select.multiple = multiple;
    select.append(
        option('', 'Choose one'),
        option('au', 'Australia', !multiple),
        option('nz', 'New Zealand'),
        option('jp', 'Japan'),
    );

    combobox.append(select);
    document.body.append(label, combobox);
    await flushMicrotasks();

    return { label, combobox, select };
}

async function createDatalistCombobox(type = 'text', multiple = false) {
    const label = document.createElement('label');
    const combobox = document.createElement('ui-combobox') as ComboboxElement;
    const source = document.createElement('input');
    const datalist = document.createElement('datalist');

    label.htmlFor = 'city';
    label.textContent = 'City';
    source.id = 'city';
    source.name = 'city';
    source.type = type;
    source.multiple = multiple;
    source.setAttribute('list', 'cities');
    datalist.id = 'cities';
    datalist.append(
        option('adelaide', 'Adelaide'),
        option('melbourne', 'Melbourne'),
        option('sydney', 'Sydney'),
    );

    combobox.append(source);
    document.body.append(label, combobox, datalist);
    await flushMicrotasks();

    return { label, combobox, source, datalist };
}

function comboboxInput(root: HTMLElement): HTMLInputElement {
    const input = root.querySelector<HTMLInputElement>('[role="combobox"]');
    expect(input).toBeInstanceOf(HTMLInputElement);
    return input!;
}

function listbox(root: HTMLElement): HTMLElement {
    const listbox = root.querySelector<HTMLElement>('[role="listbox"]');
    expect(listbox).toBeInstanceOf(HTMLElement);
    return listbox!;
}

function optionEls(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'));
}

beforeEach(() => {
    vi.stubGlobal('CSS', {
        escape: (value: string) => value,
    });
    Object.defineProperties(HTMLElement.prototype, {
        showPopover: {
            configurable: true,
            value(this: HTMLElement) {
                this.setAttribute('data-test-popover-open', '');
            },
        },
        hidePopover: {
            configurable: true,
            value(this: HTMLElement) {
                this.removeAttribute('data-test-popover-open');
            },
        },
    });
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(
        function (this: HTMLElement, selector) {
            if (selector === ':popover-open') {
                return this.hasAttribute('data-test-popover-open');
            }

            return nativeMatches.call(this, selector);
        },
    );
});

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (nativeShowPopover) {
        Object.defineProperty(HTMLElement.prototype, 'showPopover', nativeShowPopover);
    } else {
        Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
    }
    if (nativeHidePopover) {
        Object.defineProperty(HTMLElement.prototype, 'hidePopover', nativeHidePopover);
    } else {
        Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover');
    }
});

describe('ComboboxElement', () => {
    describe('select combobox', () => {
        describe('enhancement', () => {
            it('enhances the native select', async () => {
                const { label, combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const popup = listbox(combobox);

                expect(select.hidden).toBe(false);
                expect(select.style.display).toBe('');
                expect(select.parentElement?.hidden).toBe(true);
                expect(select.parentElement?.inert).toBe(true);
                expect(generatedInput).not.toBe(select);
                expect(generatedInput.getAttribute('role')).toBe('combobox');
                expect(generatedInput.getAttribute('aria-labelledby')).toBe(label.id);
                expect(generatedInput.getAttribute('aria-controls')).toBe(popup.id);
                expect(popup.getAttribute('role')).toBe('listbox');
                expect(generatedInput.value).toBe('Australia');
            });

            it('requires Popover', async () => {
                Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
                Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover');

                const selectCombobox = document.createElement('ui-combobox');
                const select = document.createElement('select');
                select.append(option('au', 'Australia', true));
                selectCombobox.append(select);

                const inputCombobox = document.createElement('ui-combobox');
                const input = document.createElement('input');
                input.setAttribute('list', 'cities');
                inputCombobox.append(input);

                document.body.append(selectCombobox, inputCombobox);
                await flushMicrotasks();

                expect(selectCombobox.querySelector('[role="combobox"]')).toBeNull();
                expect(input.getAttribute('list')).toBe('cities');
                expect(input.hasAttribute('role')).toBe(false);
            });

            it('transfers existing focus', async () => {
                const combobox = document.createElement('ui-combobox') as ComboboxElement;
                const select = document.createElement('select');
                select.append(option('au', 'Australia', true));
                combobox.append(select);
                document.body.append(combobox);
                select.focus();
                expect(document.activeElement).toBe(select);

                await flushMicrotasks();

                expect(document.activeElement).toBe(comboboxInput(combobox));
            });
        });

        describe('single selection', () => {
            it('filters and chooses with the keyboard', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const changeSpy = vi.fn();
                const inputSpy = vi.fn();

                select.addEventListener('input', inputSpy);
                select.addEventListener('change', changeSpy);

                input(generatedInput, 'new');

                expect(optionEls(combobox).map((el) => el.textContent)).toEqual(['New Zealand']);

                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');

                expect(select.value).toBe('nz');
                expect(generatedInput.value).toBe('New Zealand');
                expect(inputSpy).toHaveBeenCalledTimes(1);
                expect(changeSpy).toHaveBeenCalledTimes(1);
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
            });

            it('filters options by value', async () => {
                const { combobox } = await createSelectCombobox();

                input(comboboxInput(combobox), 'nz');

                expect(optionEls(combobox).map((el) => el.textContent)).toEqual(['New Zealand']);
            });

            it('chooses with the pointer', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const inputSpy = vi.fn();
                const changeSpy = vi.fn();
                select.addEventListener('input', inputSpy);
                select.addEventListener('change', changeSpy);

                generatedInput.focus();
                click(optionEls(combobox)[2]);

                expect(select.value).toBe('nz');
                expect(generatedInput.value).toBe('New Zealand');
                expect(inputSpy).toHaveBeenCalledOnce();
                expect(changeSpy).toHaveBeenCalledOnce();
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
            });

            it('opens with all options', async () => {
                const { combobox } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                generatedInput.focus();

                expect(generatedInput.value).toBe('');
                expect(generatedInput.placeholder).toBe('Australia');
                expect(generatedInput.getAttribute('aria-expanded')).toBe('true');
                expect(optionEls(combobox)).toHaveLength(4);
                expect(
                    combobox.querySelector('[role="option"][data-placeholder]')?.textContent,
                ).toBe('Choose one');
                const active = combobox.querySelector<HTMLElement>('[role="option"][data-active]');
                expect(generatedInput.getAttribute('aria-activedescendant')).toBe(active?.id);
            });

            it('closes with Escape', async () => {
                const { combobox } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const outerKeyDown = vi.fn();
                document.body.addEventListener('keydown', outerKeyDown);
                generatedInput.focus();

                const openEscape = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true,
                    cancelable: true,
                });
                generatedInput.dispatchEvent(openEscape);

                expect(openEscape.defaultPrevented).toBe(true);
                expect(outerKeyDown).not.toHaveBeenCalled();
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');

                const closedEscape = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true,
                    cancelable: true,
                });
                generatedInput.dispatchEvent(closedEscape);

                expect(closedEscape.defaultPrevented).toBe(false);
                expect(outerKeyDown).toHaveBeenCalledOnce();
            });

            it('leaves with Tab', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                generatedInput.focus();
                input(generatedInput, 'new');

                const tab = new KeyboardEvent('keydown', {
                    key: 'Tab',
                    bubbles: true,
                    cancelable: true,
                });
                generatedInput.dispatchEvent(tab);

                expect(tab.defaultPrevented).toBe(false);
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
                expect(select.value).toBe('au');
            });

            it('handles empty options', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.value = '';
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                expect(generatedInput.value).toBe('');
                expect(generatedInput.placeholder).toBe('Choose one');

                generatedInput.focus();
                const placeholder = combobox.querySelector<HTMLElement>(
                    '[role="option"][data-placeholder]',
                );
                expect(placeholder?.textContent).toBe('Choose one');
                expect(placeholder?.getAttribute('aria-selected')).toBe('true');

                select.options[0].textContent = '';
                await flushMicrotasks();

                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Australia',
                    'New Zealand',
                    'Japan',
                ]);
                expect(combobox.querySelector('[role="option"][data-placeholder]')).toBeNull();
            });

            it('reopens with arrow keys', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                generatedInput.focus();
                input(generatedInput, 'new');
                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');
                expect(select.value).toBe('nz');

                pressKey(generatedInput, 'ArrowDown');

                expect(optionEls(combobox)).toHaveLength(4);
                expect(generatedInput.placeholder).toBe('New Zealand');
                expect(combobox.querySelector('[role="option"][data-active]')?.textContent).toBe(
                    'Japan',
                );
            });

            it('ignores keys during composition', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const changeSpy = vi.fn();
                select.addEventListener('change', changeSpy);

                generatedInput.focus();
                const event = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    cancelable: true,
                    isComposing: true,
                });
                generatedInput.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(false);
                expect(select.value).toBe('au');
                expect(changeSpy).not.toHaveBeenCalled();
            });

            it('scrolls the active option into view', async () => {
                const { combobox } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const popup = listbox(combobox);

                generatedInput.focus();
                Object.defineProperties(popup, {
                    clientHeight: { configurable: true, value: 100 },
                    scrollTop: { configurable: true, value: 20, writable: true },
                });
                const getBoundingClientRect = vi
                    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
                    .mockImplementation(function (this: HTMLElement) {
                        if (this === popup) return new DOMRect(0, 0, 100, 100);
                        if (this.getAttribute('data-active') === '') {
                            return new DOMRect(0, 100 - popup.scrollTop, 100, 30);
                        }
                        return new DOMRect();
                    });

                pressKey(generatedInput, 'ArrowDown');
                expect(popup.scrollTop).toBe(30);

                pressKey(generatedInput, 'ArrowDown');
                expect(popup.scrollTop).toBe(30);

                getBoundingClientRect.mockImplementation(function (this: HTMLElement) {
                    if (this === popup) return new DOMRect(0, 0, 100, 100);
                    if (this.getAttribute('data-active') === '') {
                        return new DOMRect(0, 10 - popup.scrollTop, 100, 30);
                    }
                    return new DOMRect();
                });

                pressKey(generatedInput, 'ArrowUp');
                expect(popup.scrollTop).toBe(10);
            });

            it('closes on outside interaction', async () => {
                const { combobox } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                generatedInput.focus();
                input(generatedInput, 'new');
                optionEls(combobox)[0].dispatchEvent(
                    new MouseEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );
                expect(generatedInput.getAttribute('aria-expanded')).toBe('true');

                document.body.dispatchEvent(
                    new MouseEvent('pointerdown', {
                        bubbles: true,
                        composed: true,
                    }),
                );

                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
                expect(generatedInput.value).toBe('Australia');
            });

            it('skips disabled options', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.options[2].disabled = true;
                input(generatedInput, 'new');
                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');

                expect(select.value).toBe('au');

                const group = document.createElement('optgroup');
                group.disabled = true;
                group.append(option('ca', 'Canada'));
                select.append(group);
                await flushMicrotasks();

                input(generatedInput, 'can');
                const canada = optionEls(combobox)[0];
                expect(canada.getAttribute('aria-disabled')).toBe('true');

                click(canada);
                expect(select.value).toBe('au');

                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');
                expect(select.value).toBe('au');
            });

            it('distinguishes duplicate values', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.options[1].value = 'duplicate';
                select.options[1].textContent = 'First';
                select.options[2].value = 'duplicate';
                select.options[2].textContent = 'Second';
                await flushMicrotasks();

                generatedInput.focus();
                click(optionEls(combobox)[2]);

                expect(select.options[1].selected).toBe(false);
                expect(select.options[2].selected).toBe(true);
                expect(generatedInput.value).toBe('Second');
            });

            it('handles optgroups', async () => {
                const { combobox, select } = await createSelectCombobox();
                const group = document.createElement('optgroup');
                const hiddenGroup = document.createElement('optgroup');

                group.label = 'Asia Pacific';
                group.append(select.options[1], select.options[2]);
                hiddenGroup.label = 'Hidden region';
                hiddenGroup.hidden = true;
                hiddenGroup.append(option('ca', 'Canada'));
                select.append(group, hiddenGroup);
                await flushMicrotasks();
                comboboxInput(combobox).focus();

                const renderedGroup = combobox.querySelector<HTMLElement>('[role="group"]');
                expect(renderedGroup?.getAttribute('aria-label')).toBe('Asia Pacific');
                expect(
                    Array.from(
                        renderedGroup?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
                    ).map((option) => option.textContent),
                ).toEqual(['Australia', 'New Zealand']);
                expect(optionEls(combobox).map((option) => option.textContent)).not.toContain(
                    'Canada',
                );
            });

            it('displays hidden selections', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.options[0].hidden = true;
                select.value = '';
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                expect(generatedInput.value).toBe('');
                expect(generatedInput.placeholder).toBe('Choose one');

                generatedInput.focus();
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Australia',
                    'New Zealand',
                    'Japan',
                ]);
            });
        });

        describe('multiple selection', () => {
            it('chooses options as tokens', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);
                const changeSpy = vi.fn();

                select.addEventListener('change', changeSpy);

                input(generatedInput, 'jap');
                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');

                expect(Array.from(select.selectedOptions).map((item) => item.value)).toEqual([
                    'jp',
                ]);
                expect(generatedInput.value).toBe('');
                expect(listbox(combobox).matches(':popover-open')).toBe(true);
                expect(combobox.querySelector('[data-combobox-token]')?.textContent).toContain(
                    'Japan',
                );
                expect(optionEls(combobox).map((option) => option.textContent)).not.toContain(
                    'Japan',
                );
                expect(changeSpy).toHaveBeenCalledOnce();
            });

            it('removes tokens with the pointer', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);
                const changeSpy = vi.fn();
                select.options[3].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                select.addEventListener('change', changeSpy);
                await flushMicrotasks();
                generatedInput.focus();

                const remove = combobox.querySelector<HTMLButtonElement>(
                    '[data-combobox-token-remove]',
                );
                const token = combobox.querySelector<HTMLElement>('[data-combobox-token]')!;
                expect(remove).toBeInstanceOf(HTMLButtonElement);
                const tokenPress = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                });
                token.dispatchEvent(tokenPress);
                expect(tokenPress.defaultPrevented).toBe(true);
                expect(listbox(combobox).matches(':popover-open')).toBe(true);

                click(token);
                expect(document.activeElement).toBe(remove);
                expect(Array.from(select.selectedOptions)).toHaveLength(1);

                click(remove!);

                expect(Array.from(select.selectedOptions)).toHaveLength(0);
                expect(changeSpy).toHaveBeenCalledOnce();
                expect(document.activeElement).toBe(generatedInput);
                expect(optionEls(combobox).map((option) => option.textContent)).toContain('Japan');
            });

            it('ignores empty options', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                select.options[0].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                comboboxInput(combobox).focus();

                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Australia',
                    'New Zealand',
                    'Japan',
                ]);
                expect(combobox.querySelector('[data-combobox-token]')).toBeNull();
            });

            it('allows hidden selections to be removed', async () => {
                const { combobox, select } = await createSelectCombobox(true);

                select.options[1].hidden = true;
                select.options[1].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                expect(combobox.querySelector('[data-combobox-token]')?.textContent).toContain(
                    'Australia',
                );

                comboboxInput(combobox).focus();
                expect(optionEls(combobox).map((option) => option.textContent)).not.toContain(
                    'Australia',
                );

                click(combobox.querySelector<HTMLButtonElement>('[data-combobox-token-remove]')!);
                expect(select.options[1].selected).toBe(false);
            });

            it('prevents disabled removals', async () => {
                const { combobox, select } = await createSelectCombobox(true);

                select.options[1].selected = true;
                select.options[2].selected = true;
                select.options[1].disabled = true;
                await flushMicrotasks();

                let removeButtons = Array.from(
                    combobox.querySelectorAll<HTMLButtonElement>('[data-combobox-token-remove]'),
                );
                expect(removeButtons[0].disabled).toBe(true);
                expect(removeButtons[1].disabled).toBe(false);

                select.disabled = true;
                await flushMicrotasks();

                removeButtons = Array.from(
                    combobox.querySelectorAll<HTMLButtonElement>('[data-combobox-token-remove]'),
                );
                expect(removeButtons.every((button) => button.disabled)).toBe(true);

                click(removeButtons[1]);

                expect(select.options[2].selected).toBe(true);
            });

            it('distinguishes duplicate values', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);

                select.options[1].value = 'duplicate';
                select.options[1].textContent = 'First';
                select.options[2].value = 'duplicate';
                select.options[2].textContent = 'Second';
                await flushMicrotasks();

                generatedInput.focus();
                click(optionEls(combobox).find((option) => option.textContent === 'Second')!);

                expect(select.options[1].selected).toBe(false);
                expect(select.options[2].selected).toBe(true);
                expect(combobox.querySelector('[data-combobox-token]')?.textContent).toContain(
                    'Second',
                );

                click(combobox.querySelector<HTMLButtonElement>('[data-combobox-token-remove]')!);

                expect(select.options[2].selected).toBe(false);
            });

            it('navigates and removes tokens', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);

                select.options[1].selected = true;
                select.options[2].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                pressKey(generatedInput, 'Backspace');
                const removeButtons = Array.from(
                    combobox.querySelectorAll<HTMLButtonElement>('[data-combobox-token-remove]'),
                );

                expect(document.activeElement).toBe(removeButtons[1]);
                expect(Array.from(select.selectedOptions)).toHaveLength(2);

                pressKey(removeButtons[1], 'ArrowLeft');
                expect(document.activeElement).toBe(removeButtons[0]);

                pressKey(removeButtons[0], 'Delete');

                expect(Array.from(select.selectedOptions).map((item) => item.value)).toEqual([
                    'nz',
                ]);
                expect(document.activeElement).toBe(
                    combobox.querySelector('[data-combobox-token-remove]'),
                );
            });

            it('skips disabled tokens', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);

                select.options[1].selected = true;
                select.options[2].selected = true;
                select.options[2].disabled = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                const removeButtons = Array.from(
                    combobox.querySelectorAll<HTMLButtonElement>('[data-combobox-token-remove]'),
                );
                expect(removeButtons[1].disabled).toBe(true);

                pressKey(generatedInput, 'ArrowLeft');
                expect(document.activeElement).toBe(removeButtons[0]);

                pressKey(removeButtons[0], 'ArrowRight');
                expect(document.activeElement).toBe(generatedInput);
            });

            it('handles Escape and Tab from tokens', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);

                select.options[1].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                generatedInput.focus();
                pressKey(generatedInput, 'ArrowLeft');
                const remove = combobox.querySelector<HTMLButtonElement>(
                    '[data-combobox-token-remove]',
                )!;
                const escape = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true,
                    cancelable: true,
                });
                remove.dispatchEvent(escape);

                expect(escape.defaultPrevented).toBe(true);
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
                expect(document.activeElement).toBe(remove);

                generatedInput.focus();
                pressKey(generatedInput, 'ArrowLeft');
                const tab = new KeyboardEvent('keydown', {
                    key: 'Tab',
                    bubbles: true,
                    cancelable: true,
                });
                remove.dispatchEvent(tab);

                expect(tab.defaultPrevented).toBe(false);
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
                expect(document.activeElement).toBe(generatedInput);
            });

            it('restores focus after Backspace', async () => {
                const { combobox, select } = await createSelectCombobox(true);

                select.options[1].selected = true;
                select.options[2].selected = true;
                select.options[3].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                const removeButtons = Array.from(
                    combobox.querySelectorAll<HTMLButtonElement>('[data-combobox-token-remove]'),
                );
                removeButtons[1].focus();
                pressKey(removeButtons[1], 'Backspace');
                await flushMicrotasks();

                expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual([
                    'au',
                    'jp',
                ]);
                expect(document.activeElement).toBe(
                    combobox.querySelector('[data-combobox-token-remove]'),
                );
            });
        });

        describe('native control integration', () => {
            it('emits composed input events', async () => {
                const host = document.createElement('div');
                const root = host.attachShadow({ mode: 'open' });
                const combobox = document.createElement('ui-combobox');
                const select = document.createElement('select');
                select.append(option('au', 'Australia', true), option('nz', 'New Zealand'));
                combobox.append(select);
                root.append(combobox);
                document.body.append(host);
                await flushMicrotasks();

                const inputSpy = vi.fn();
                host.addEventListener('input', inputSpy);
                comboboxInput(combobox).focus();
                click(optionEls(combobox)[1]);

                expect(select.value).toBe('nz');
                expect(inputSpy).toHaveBeenCalledOnce();
                expect(inputSpy.mock.calls[0][0].composed).toBe(true);
            });

            it('supports wrapping labels', async () => {
                const label = document.createElement('label');
                const combobox = document.createElement('ui-combobox');
                const select = document.createElement('select');
                const text = document.createTextNode('Country');
                select.append(option('au', 'Australia', true));
                combobox.append(select);
                label.append(text, combobox);
                document.body.append(label);
                await flushMicrotasks();

                const generatedInput = comboboxInput(combobox);
                expect(generatedInput.getAttribute('aria-labelledby')).toBe(label.id);
                expect(label.id).not.toBe('');

                text.data = 'Localized country';
                expect(generatedInput.getAttribute('aria-labelledby')).toBe(label.id);

                combobox.remove();
                expect(label.id).toBe('');
            });

            it('avoids native select label clicks', async () => {
                const label = document.createElement('label');
                const combobox = document.createElement('ui-combobox');
                const select = document.createElement('select');
                const selectClick = vi.fn();
                select.append(option('au', 'Australia', true), option('nz', 'New Zealand'));
                select.addEventListener('click', selectClick);
                combobox.append(select);
                label.append('Country', combobox);
                document.body.append(label);
                await flushMicrotasks();

                comboboxInput(combobox).focus();
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });
                optionEls(combobox)[1].dispatchEvent(event);

                expect(select.value).toBe('nz');
                expect(event.defaultPrevented).toBe(true);
                expect(selectClick).not.toHaveBeenCalled();
            });

            it('exposes required state', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.required = true;
                await flushMicrotasks();

                expect(generatedInput.required).toBe(false);
                expect(generatedInput.getAttribute('aria-required')).toBe('true');

                select.required = false;
                await flushMicrotasks();

                expect(generatedInput.hasAttribute('aria-required')).toBe(false);
            });

            it('follows the select tab order', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.tabIndex = -1;
                await flushMicrotasks();
                expect(generatedInput.tabIndex).toBe(-1);

                select.tabIndex = 3;
                await flushMicrotasks();
                expect(generatedInput.tabIndex).toBe(3);
            });

            it('preserves explicit aria-invalid', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.setAttribute('aria-invalid', 'spelling');
                await flushMicrotasks();

                expect(select.validity.valid).toBe(true);
                expect(generatedInput.getAttribute('aria-invalid')).toBe('spelling');

                generatedInput.focus();
                expect(generatedInput.getAttribute('aria-invalid')).toBe('spelling');

                select.removeAttribute('aria-invalid');
                await flushMicrotasks();
                expect(generatedInput.hasAttribute('aria-invalid')).toBe(false);
            });

            it('transfers accessible attributes', async () => {
                const { combobox, select } = await createSelectCombobox();

                select.title = 'Destination country';
                select.setAttribute('aria-label', 'Destination country');
                select.setAttribute('aria-labelledby', 'country-heading');
                select.setAttribute('aria-describedby', 'country-help');
                select.setAttribute('aria-errormessage', 'country-error');
                await flushMicrotasks();

                const generatedInput = comboboxInput(combobox);
                expect(generatedInput.title).toBe('Destination country');
                expect(generatedInput.getAttribute('aria-label')).toBe('Destination country');
                expect(generatedInput.getAttribute('aria-labelledby')).toBe('country-heading');
                expect(generatedInput.getAttribute('aria-describedby')).toBe('country-help');
                expect(generatedInput.getAttribute('aria-errormessage')).toBe('country-error');

                select.removeAttribute('aria-label');
                select.removeAttribute('aria-labelledby');
                select.removeAttribute('aria-describedby');
                select.removeAttribute('aria-errormessage');
                await flushMicrotasks();

                expect(generatedInput.hasAttribute('aria-label')).toBe(false);
                expect(generatedInput.getAttribute('aria-labelledby')).toBe(
                    select.labels?.item(0)?.id,
                );
                expect(generatedInput.hasAttribute('aria-describedby')).toBe(false);
                expect(generatedInput.hasAttribute('aria-errormessage')).toBe(false);

                select.title = 'Country of residence';
                await flushMicrotasks();
                expect(generatedInput.title).toBe('Country of residence');
            });

            it('allows interactive label content', async () => {
                const { label, combobox } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const link = document.createElement('a');
                link.href = '#help';
                link.textContent = 'Help';
                label.append(link);
                generatedInput.blur();

                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });
                link.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(false);
                expect(document.activeElement).not.toBe(generatedInput);
            });

            it('submits the native value on Enter', async () => {
                const form = document.createElement('form');
                const combobox = document.createElement('ui-combobox') as ComboboxElement;
                const select = document.createElement('select');
                select.name = 'country';
                select.append(option('au', 'Australia', true));
                combobox.append(select);
                form.append(combobox);
                document.body.append(form);
                await flushMicrotasks();

                const generatedInput = comboboxInput(combobox);
                const submissions: [string, FormDataEntryValue][][] = [];
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    submissions.push(Array.from(new FormData(form).entries()));
                });

                generatedInput.value = 'filter text';
                const enter = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    cancelable: true,
                });
                generatedInput.dispatchEvent(enter);

                // jsdom does not perform implicit submission as a keyboard default action.
                if (!enter.defaultPrevented) generatedInput.form?.requestSubmit();

                expect(submissions).toEqual([[['country', 'au']]]);
            });

            it('resets with the form', async () => {
                const form = document.createElement('form');
                const label = document.createElement('label');
                const combobox = document.createElement('ui-combobox');
                const select = document.createElement('select');

                label.htmlFor = 'country';
                label.textContent = 'Country';
                select.id = 'country';
                select.name = 'country';
                select.append(option('au', 'Australia', true), option('nz', 'New Zealand'));
                combobox.append(select);
                form.append(label, combobox);
                document.body.append(form);
                await flushMicrotasks();

                const generatedInput = comboboxInput(combobox);
                select.value = 'nz';
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();
                expect(generatedInput.value).toBe('New Zealand');

                generatedInput.focus();
                input(generatedInput, 'new');
                expect(generatedInput.getAttribute('aria-expanded')).toBe('true');

                form.reset();
                await flushMicrotasks();

                expect(select.value).toBe('au');
                expect(generatedInput.value).toBe('Australia');
                expect(generatedInput.getAttribute('aria-expanded')).toBe('false');
            });

            it('mirrors native validation', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                const reportValidity = vi.spyOn(generatedInput, 'reportValidity');
                const invalid = vi.fn();
                const button = document.createElement('button');
                document.body.append(button);
                button.focus();
                select.addEventListener('invalid', invalid);

                select.required = true;
                select.value = '';
                expect(select.checkValidity()).toBe(false);

                expect(document.activeElement).toBe(button);
                expect(generatedInput.getAttribute('aria-invalid')).toBe('true');
                expect(generatedInput.validationMessage).toBe(select.validationMessage);
                expect(reportValidity).not.toHaveBeenCalled();
                expect(invalid).toHaveBeenCalledOnce();
                expect(invalid.mock.calls[0][0].defaultPrevented).toBe(false);
            });

            it('clears invalid state after selection', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.required = true;
                select.value = '';
                select.dispatchEvent(new Event('invalid', { bubbles: false, cancelable: true }));
                expect(generatedInput.getAttribute('aria-invalid')).toBe('true');

                generatedInput.focus();
                click(optionEls(combobox)[1]);

                expect(select.validity.valid).toBe(true);
                expect(generatedInput.validity.valid).toBe(true);
                expect(generatedInput.hasAttribute('aria-invalid')).toBe(false);
            });

            it('keeps validation on the native select', async () => {
                const { combobox, select } = await createSelectCombobox(true);
                const generatedInput = comboboxInput(combobox);

                select.required = true;
                select.options[1].selected = true;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();

                expect(select.checkValidity()).toBe(true);
                expect(generatedInput.required).toBe(false);
                expect(generatedInput.checkValidity()).toBe(true);
            });

            it('follows disabled fieldsets', async () => {
                const { label, combobox, select } = await createSelectCombobox(true);
                const fieldset = document.createElement('fieldset');

                select.options[1].selected = true;
                fieldset.append(label, combobox);
                document.body.append(fieldset);
                combobox.refresh();
                await flushMicrotasks();
                const generatedInput = comboboxInput(combobox);
                let remove = combobox.querySelector<HTMLButtonElement>(
                    '[data-combobox-token-remove]',
                )!;

                generatedInput.focus();
                expect(listbox(combobox).matches(':popover-open')).toBe(true);

                fieldset.disabled = true;
                await flushMicrotasks();
                remove = combobox.querySelector<HTMLButtonElement>('[data-combobox-token-remove]')!;
                expect(select.matches(':disabled')).toBe(true);
                expect(generatedInput.matches(':disabled')).toBe(true);
                expect(remove.matches(':disabled')).toBe(true);
                expect(listbox(combobox).matches(':popover-open')).toBe(false);

                input(generatedInput, 'new');
                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');
                expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual([
                    'au',
                ]);

                fieldset.disabled = false;
                expect(remove.matches(':disabled')).toBe(false);
                click(remove);
                expect(select.options[1].selected).toBe(false);

                input(generatedInput, 'new');
                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');
                expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual([
                    'nz',
                ]);
            });
        });

        describe('source changes', () => {
            it('reflects option text changes', async () => {
                const { combobox, select } = await createSelectCombobox();

                select.options[1].firstChild!.nodeValue = 'Australie';
                await flushMicrotasks();

                expect(comboboxInput(combobox).value).toBe('Australie');
            });

            it('follows the hidden state', async () => {
                const combobox = document.createElement('ui-combobox');
                const select = document.createElement('select');
                select.hidden = true;
                select.append(option('au', 'Australia', true), option('nz', 'New Zealand'));
                combobox.append(select);
                document.body.append(combobox);
                await flushMicrotasks();

                const control = combobox.querySelector<HTMLElement>('[data-combobox-control]');
                const generatedInput = comboboxInput(combobox);
                expect(control?.hidden).toBe(true);
                expect(listbox(combobox).matches(':popover-open')).toBe(false);

                input(generatedInput, 'new');
                pressKey(generatedInput, 'ArrowDown');
                pressKey(generatedInput, 'Enter');
                expect(select.value).toBe('au');

                select.hidden = false;
                await flushMicrotasks();
                expect(control?.hidden).toBe(false);

                generatedInput.focus();
                expect(listbox(combobox).matches(':popover-open')).toBe(true);

                select.hidden = true;
                await flushMicrotasks();
                expect(control?.hidden).toBe(true);
                expect(listbox(combobox).matches(':popover-open')).toBe(false);
            });

            it('refreshes a replaced source', async () => {
                const { combobox, select } = await createSelectCombobox();
                const replacement = document.createElement('select');
                replacement.id = select.id;
                replacement.append(option('ca', 'Canada', true));

                select.replaceWith(replacement);
                await flushMicrotasks();
                expect(comboboxInput(combobox).value).toBe('Australia');

                combobox.refresh();
                expect(select.style.display).toBe('');
                expect(comboboxInput(combobox).value).toBe('Canada');
            });

            it('refreshes programmatic values', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);

                select.value = 'nz';
                await flushMicrotasks();
                expect(generatedInput.value).toBe('Australia');

                combobox.refresh();
                expect(comboboxInput(combobox).value).toBe('New Zealand');
            });

            it('preserves focus on refresh', async () => {
                const { combobox } = await createSelectCombobox();
                comboboxInput(combobox).focus();

                combobox.refresh();

                expect(document.activeElement).toBe(comboboxInput(combobox));
            });

            it('preserves active filtering', async () => {
                const { combobox, select } = await createSelectCombobox();
                const generatedInput = comboboxInput(combobox);
                generatedInput.focus();
                input(generatedInput, 'new');
                select.append(option('ng', 'New Guinea'));
                await flushMicrotasks();

                expect(generatedInput.value).toBe('new');
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'New Zealand',
                    'New Guinea',
                ]);
            });

            it('preserves inline display', async () => {
                const combobox = document.createElement('ui-combobox') as ComboboxElement;
                const select = document.createElement('select');
                select.style.display = 'none';
                select.append(option('au', 'Australia', true));
                combobox.append(select);
                document.body.append(combobox);
                await flushMicrotasks();

                expect(combobox.querySelector<HTMLElement>('[data-combobox-control]')?.hidden).toBe(
                    true,
                );
                expect(listbox(combobox).matches(':popover-open')).toBe(false);

                select.style.display = 'block';
                combobox.refresh();
                expect(combobox.querySelector<HTMLElement>('[data-combobox-control]')?.hidden).toBe(
                    false,
                );

                select.style.display = 'none';
                combobox.refresh();
                expect(combobox.querySelector<HTMLElement>('[data-combobox-control]')?.hidden).toBe(
                    true,
                );

                combobox.remove();
                expect(select.style.display).toBe('none');
                expect(getComputedStyle(select).display).toBe('none');
            });

            it('refreshes label relationships', async () => {
                const { label, combobox } = await createSelectCombobox();
                let generatedInput = comboboxInput(combobox);

                label.textContent = 'Localized country';
                await flushMicrotasks();
                expect(generatedInput.getAttribute('aria-labelledby')).toBe(label.id);

                label.htmlFor = 'another-control';
                combobox.refresh();
                await flushMicrotasks();
                generatedInput = comboboxInput(combobox);
                expect(generatedInput.hasAttribute('aria-labelledby')).toBe(false);

                generatedInput.blur();
                click(label);
                expect(document.activeElement).not.toBe(generatedInput);

                label.htmlFor = 'country';
                combobox.refresh();
                await flushMicrotasks();
                generatedInput = comboboxInput(combobox);
                expect(generatedInput.getAttribute('aria-labelledby')).toBe(label.id);
                generatedInput.blur();

                click(label);
                expect(document.activeElement).toBe(generatedInput);
            });

            it('refreshes form relationships', async () => {
                const firstForm = document.createElement('form');
                firstForm.id = 'first-form';
                document.body.append(firstForm);

                const { combobox, select } = await createSelectCombobox();
                select.options[1].defaultSelected = true;
                select.setAttribute('form', firstForm.id);
                combobox.refresh();

                select.value = 'nz';
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await flushMicrotasks();
                firstForm.reset();
                await flushMicrotasks();
                expect(select.value).toBe('au');

                select.setAttribute('form', 'late-form');
                select.value = 'nz';
                select.dispatchEvent(new Event('change', { bubbles: true }));

                const lateForm = document.createElement('form');
                lateForm.id = 'late-form';
                document.body.append(lateForm);
                combobox.refresh();
                lateForm.reset();
                await flushMicrotasks();

                expect(select.value).toBe('au');
                expect(comboboxInput(combobox).value).toBe('Australia');
            });
        });
    });

    describe('input[list] combobox', () => {
        describe('enhancement', () => {
            it('enhances the existing input', async () => {
                const { combobox, source } = await createDatalistCombobox();

                expect(comboboxInput(combobox)).toBe(source);
                expect(source.list).toBeNull();
                expect(source.getAttribute('role')).toBe('combobox');
                expect(source.hasAttribute('aria-label')).toBe(false);
            });

            it('restores native suggestions', async () => {
                const { combobox, source } = await createDatalistCombobox();

                combobox.remove();

                expect(source.getAttribute('list')).toBe('cities');
                expect(source.hasAttribute('role')).toBe(false);
            });

            it('does not support multi-address email inputs', async () => {
                const { combobox, source } = await createDatalistCombobox('email', true);

                expect(source.getAttribute('list')).toBe('cities');
                expect(source.hasAttribute('role')).toBe(false);
                expect(combobox.querySelector('[role="listbox"]')).toBeNull();
            });
        });

        describe('entering a value', () => {
            it('filters and accepts suggestions', async () => {
                const { combobox, source } = await createDatalistCombobox();
                const changeSpy = vi.fn();
                const inputSpy = vi.fn();

                source.addEventListener('input', inputSpy);
                source.addEventListener('change', changeSpy);

                input(source, 'adel');
                expect(source.value).toBe('adel');
                expect(optionEls(combobox).map((el) => el.textContent)).toEqual(['Adelaide']);

                click(optionEls(combobox)[0]);

                expect(source.value).toBe('adelaide');
                expect(inputSpy).toHaveBeenCalledTimes(2);
                expect(changeSpy).toHaveBeenCalledTimes(1);
            });

            it('preserves arbitrary text on Tab', async () => {
                const { combobox, source } = await createDatalistCombobox();

                input(source, 'mel');
                expect(source.getAttribute('aria-expanded')).toBe('true');

                const tab = new KeyboardEvent('keydown', {
                    key: 'Tab',
                    bubbles: true,
                    cancelable: true,
                });
                source.dispatchEvent(tab);

                expect(tab.defaultPrevented).toBe(false);
                expect(source.getAttribute('aria-expanded')).toBe('false');
                expect(source.value).toBe('mel');
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Melbourne',
                ]);
            });

            it('emits events for exact values', async () => {
                const { source } = await createDatalistCombobox();
                const inputSpy = vi.fn();
                const changeSpy = vi.fn();

                source.addEventListener('input', inputSpy);
                source.addEventListener('change', changeSpy);

                input(source, 'adelaide');
                pressKey(source, 'Enter');

                expect(inputSpy).toHaveBeenCalledTimes(2);
                expect(changeSpy).toHaveBeenCalledTimes(1);
            });

            it('respects readonly inputs', async () => {
                const { source } = await createDatalistCombobox();

                source.value = 'original';
                source.readOnly = true;
                await flushMicrotasks();

                source.focus();
                pressKey(source, 'ArrowDown');
                pressKey(source, 'Enter');

                expect(source.getAttribute('aria-expanded')).toBe('false');
                expect(source.value).toBe('original');
            });

            it('respects hidden inputs', async () => {
                const { combobox, source } = await createDatalistCombobox();

                source.focus();
                expect(listbox(combobox).matches(':popover-open')).toBe(true);

                source.hidden = true;
                await flushMicrotasks();
                expect(listbox(combobox).matches(':popover-open')).toBe(false);
                expect(source.getAttribute('aria-expanded')).toBe('false');

                input(source, 'mel');
                source.focus();
                expect(listbox(combobox).matches(':popover-open')).toBe(false);
            });
        });

        describe('native input integration', () => {
            it('preserves author ARIA', async () => {
                const { combobox, source } = await createDatalistCombobox();

                source.setAttribute('aria-label', 'Localized city');
                source.setAttribute('role', 'searchbox');
                source.setAttribute('aria-controls', 'city-help');
                combobox.refresh();
                combobox.remove();

                expect(source.getAttribute('aria-label')).toBe('Localized city');
                expect(source.getAttribute('role')).toBe('searchbox');
                expect(source.getAttribute('aria-controls')).toBe('city-help');
                expect(source.hasAttribute('aria-autocomplete')).toBe(false);
            });

            it('preserves native validation', async () => {
                const { source } = await createDatalistCombobox();
                const invalidEvent = new Event('invalid', {
                    bubbles: false,
                    cancelable: true,
                });

                source.setAttribute('aria-invalid', 'grammar');
                source.setCustomValidity('Choose a supported city');
                source.dispatchEvent(invalidEvent);

                expect(invalidEvent.defaultPrevented).toBe(false);
                expect(source.validity.valid).toBe(false);
                expect(source.getAttribute('aria-invalid')).toBe('grammar');

                source.removeAttribute('aria-invalid');
                source.dispatchEvent(new Event('invalid', { cancelable: true }));
                expect(source.hasAttribute('aria-invalid')).toBe(false);
            });
        });

        describe('source changes', () => {
            it('reflects option changes', async () => {
                const { combobox, source, datalist } = await createDatalistCombobox();

                datalist.options[0].hidden = true;
                await flushMicrotasks();
                source.focus();
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Melbourne',
                    'Sydney',
                ]);

                datalist.options[0].hidden = false;
                await flushMicrotasks();
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Adelaide',
                    'Melbourne',
                    'Sydney',
                ]);

                datalist.options[0].firstChild!.nodeValue = 'Adelaide city';
                await flushMicrotasks();

                expect(optionEls(combobox)[0].textContent).toBe('Adelaide city');
            });

            it('refreshes datalist relationships', async () => {
                const { combobox, source } = await createDatalistCombobox();
                const replacement = document.createElement('datalist');

                replacement.id = 'other-cities';
                replacement.append(option('perth', 'Perth'));
                document.body.append(replacement);

                source.setAttribute('list', replacement.id);
                await flushMicrotasks();
                input(source, 'per');
                expect(optionEls(combobox)).toHaveLength(0);

                combobox.refresh();
                await flushMicrotasks();

                input(source, 'per');
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual(['Perth']);

                source.removeAttribute('list');
                combobox.refresh();
                expect(source.hasAttribute('role')).toBe(false);
                expect(combobox.querySelector('[role="listbox"]')).toBeNull();

                source.setAttribute('list', replacement.id);
                combobox.refresh();
                input(source, 'per');
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual(['Perth']);

                source.setAttribute('list', 'late-cities');
                combobox.refresh();
                input(source, 'adel');
                await flushMicrotasks();
                expect(optionEls(combobox)).toHaveLength(0);

                const datalist = document.createElement('datalist');
                datalist.id = 'late-cities';
                datalist.append(option('adelaide', 'Adelaide'));
                document.body.append(datalist);
                combobox.refresh();
                await flushMicrotasks();

                input(source, 'adel');
                expect(optionEls(combobox).map((option) => option.textContent)).toEqual([
                    'Adelaide',
                ]);

                combobox.remove();
                expect(source.getAttribute('list')).toBe('late-cities');
            });
        });
    });
});
