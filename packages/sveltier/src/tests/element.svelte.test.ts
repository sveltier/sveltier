import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import PatternHarness from './fixtures/PatternHarness.svelte';

// The root element pattern every component follows (see PatternField).
describe('root element pattern', () => {
	const field = () => page.getByRole('textbox');

	it('spreads attributes and callbacks onto the root element', async () => {
		const oninput = vi.fn();
		await render(PatternHarness, {
			field: { 'aria-label': 'Amount', placeholder: '0.00', 'data-row': '3', oninput }
		});
		await expect.element(page.getByRole('textbox', { name: 'Amount' })).toBeVisible();
		await expect.element(field()).toHaveAttribute('placeholder', '0.00');
		await expect.element(field()).toHaveAttribute('data-row', '3');
		await userEvent.type(field(), '12');
		expect(oninput).toHaveBeenCalled();
	});

	it('merges class after its own classes, in any form', async () => {
		await render(PatternHarness, { field: { class: ['mine', { active: true, off: false }] } });
		await expect
			.element(field())
			.toHaveClass('pattern-field', 'pattern-field--md', 'mine', 'active');
		await expect.element(field()).not.toHaveClass('off');
	});

	it('binds ref to the root element', async () => {
		await render(PatternHarness);
		await expect.element(page.getByTestId('ref')).toHaveTextContent('INPUT');
	});

	it('keeps own props off the element, so a shared size never becomes the size attribute', async () => {
		await render(PatternHarness, { field: { size: 'lg', invalid: true } });
		await expect.element(field()).toHaveClass('pattern-field--lg');
		await expect.element(field()).not.toHaveAttribute('size');
		await expect.element(field()).not.toHaveAttribute('invalid');
	});

	it('lets attributes the component controls win over the spread', async () => {
		await render(PatternHarness, { field: { invalid: true, 'aria-invalid': false } });
		await expect.element(field()).toHaveAttribute('aria-invalid', 'true');
	});
});
