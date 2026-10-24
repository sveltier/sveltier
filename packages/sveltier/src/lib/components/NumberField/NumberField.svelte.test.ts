import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import NumberFieldHarness from '../../../tests/fixtures/NumberFieldHarness.svelte';

const input = () => page.getByRole('spinbutton', { name: 'Amount' });
const element = () => input().element() as HTMLInputElement;
const value = () => page.getByTestId('value');
const press = async (key: string) => {
	element().focus();
	await userEvent.keyboard(key);
};

describe('NumberField', () => {
	it('is a labelled spinbutton that reads what is typed in the locale', async () => {
		await render(NumberFieldHarness);
		expect(element().type).toBe('text');
		await input().fill('1,234.5');
		await expect.element(value()).toHaveTextContent('1234.5');
		await userEvent.keyboard('{Tab}');
		expect(element().value).toBe('1,234.5');
		expect(element().getAttribute('aria-valuenow')).toBe('1234.5');
		expect(element().getAttribute('aria-valuetext')).toBe('1,234.5');
	});

	it('shows a value set from outside in the locale format, and empties to null', async () => {
		const screen = await render(NumberFieldHarness, { value: 9876.5 });
		expect(element().value).toBe('9,876.5');
		await screen.rerender({ value: 12 });
		expect(element().value).toBe('12');
		await input().fill('');
		await expect.element(value()).toHaveTextContent('null');
	});

	it('steps with the arrow and page keys, and goes to the ends with Home and End', async () => {
		await render(NumberFieldHarness, { value: 5, min: 0, max: 100, step: 5 });
		await press('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('10');
		await press('{PageUp}');
		await expect.element(value()).toHaveTextContent('60');
		await press('{ArrowDown}');
		await expect.element(value()).toHaveTextContent('55');
		await press('{End}');
		await expect.element(value()).toHaveTextContent('100');
		await press('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('100');
		await press('{Home}');
		await expect.element(value()).toHaveTextContent('0');
	});

	it('steps from a value between two steps to the next one, without rounding errors', async () => {
		await render(NumberFieldHarness, { value: 0.25, step: 0.1 });
		await press('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('0.3');
		await press('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('0.4');
		await press('{ArrowDown}');
		await expect.element(value()).toHaveTextContent('0.3');
	});

	it('has decrease and increase buttons that keep focus in the field', async () => {
		await render(NumberFieldHarness, { value: 1, min: 1 });
		const decrease = page.getByRole('button', { name: 'Decrease' });
		expect((decrease.element() as HTMLButtonElement).disabled).toBe(true);
		element().focus();
		await page.getByRole('button', { name: 'Increase' }).click();
		await expect.element(value()).toHaveTextContent('2');
		await expect.element(input()).toHaveFocus();
		expect(decrease.element().getAttribute('tabindex')).toBe('-1');
	});

	it('says what is wrong with text, range and step, once the user leaves', async () => {
		await render(NumberFieldHarness, { min: 10, max: 1000, step: 10 });
		await input().fill('12a');
		await userEvent.keyboard('{Tab}');
		await expect.element(input()).toHaveAccessibleDescription('Enter a number');
		await input().fill('5');
		await expect.element(input()).toHaveAccessibleDescription('Enter 10 or more');
		await input().fill('2000');
		await expect.element(input()).toHaveAccessibleDescription('Enter 1,000 or less');
		await input().fill('15');
		await expect.element(input()).toHaveAccessibleDescription('Enter a value in steps of 10');
		await input().fill('20');
		expect(element().hasAttribute('aria-invalid')).toBe(false);
	});

	it('submits the plain number under its name', async () => {
		await render(NumberFieldHarness, { name: 'amount', format: { minimumFractionDigits: 2 } });
		await input().fill('1,234.5');
		await userEvent.keyboard('{Tab}');
		expect(element().value).toBe('1,234.50');
		expect(element().name).toBe('');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(page.getByTestId('submitted')).toHaveTextContent('amount=1234.5');
	});

	it('turns its buttons and keys off when read-only', async () => {
		await render(NumberFieldHarness, { value: 3, readonly: true });
		await press('{ArrowUp}');
		await expect.element(value()).toHaveTextContent('3');
		const increase = page.getByRole('button', { name: 'Increase' }).element() as HTMLButtonElement;
		expect(increase.disabled).toBe(true);
	});
});

describe('NumberField in a form', () => {
	it('goes back to the number it started with on a form reset', async () => {
		await render(NumberFieldHarness, { value: 1234.5 });
		await input().fill('99');
		await expect.element(value()).toHaveTextContent('99');
		element().form?.reset();
		await expect.element(value()).toHaveTextContent('1234.5');
		expect(element().value).toBe('1,234.5');
	});
});
