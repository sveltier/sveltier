import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TextareaHarness from '../../../tests/fixtures/TextareaHarness.svelte';

const textarea = () => page.getByRole('textbox', { name: 'Note' });
const element = () => textarea().element() as HTMLTextAreaElement;
const box = (control: Element) => control.closest('.sv-field__box') as HTMLElement;
const lines = (count: number) =>
	Array.from({ length: count }, (_, i) => `Line ${i + 1}`).join('\n');

describe('Textarea', () => {
	it('is a labelled textarea whose value binds both ways', async () => {
		const screen = await render(TextareaHarness, { value: 'Rent for May' });
		expect(element().tagName).toBe('TEXTAREA');
		expect(element().value).toBe('Rent for May');
		await textarea().fill('Rent for June');
		await expect.element(page.getByTestId('value')).toHaveTextContent('Rent for June');
		await screen.rerender({ value: 'Deposit' });
		expect(element().value).toBe('Deposit');
	});

	it('gives the textarea its attributes and rows, and the field its class', async () => {
		await render(TextareaHarness, { name: 'note', rows: 5, class: 'payment-note' });
		expect(element().name).toBe('note');
		expect(element().rows).toBe(5);
		expect(element().closest('.sv-field')?.classList).toContain('payment-note');
	});

	it('lines up with a TextField: one row is as tall as a one-line field', async () => {
		await render(TextareaHarness, { rows: 1 });
		const reference = page.getByRole('textbox', { name: 'Reference' }).element();
		expect(box(element()).getBoundingClientRect().height).toBeCloseTo(
			box(reference).getBoundingClientRect().height,
			0
		);
	});

	it('validates like a TextField', async () => {
		await render(TextareaHarness, { minlength: 10 });
		await textarea().fill('Too short');
		await userEvent.keyboard('{Tab}');
		await expect.element(textarea()).toHaveAccessibleDescription('Enter at least 10 characters');
	});

	it('grows with its text from its rows to maxRows, then scrolls', async () => {
		await render(TextareaHarness, { autoGrow: true, rows: 2, maxRows: 4 });
		const start = element().getBoundingClientRect().height;
		await textarea().fill(lines(3));
		await expect.poll(() => element().getBoundingClientRect().height).toBeGreaterThan(start);
		const three = element().getBoundingClientRect().height;
		await textarea().fill(lines(10));
		await expect.poll(() => element().getBoundingClientRect().height).toBeGreaterThan(three);
		const capped = element().getBoundingClientRect().height;
		await textarea().fill(lines(20));
		expect(element().getBoundingClientRect().height).toBeCloseTo(capped, 0);
		expect(element().scrollHeight).toBeGreaterThan(element().clientHeight);
	});

	it('keeps the size the user drags it to when it does not grow', async () => {
		await render(TextareaHarness);
		expect(getComputedStyle(element()).resize).toBe('vertical');
	});
});
