import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ResetField from './fixtures/ResetField.svelte';

// An app's own CSS outside any layer wins over the library's layers, by design. A common reset
// sets p { margin: 0 }, so the space above a hint must not be a margin.
describe('under an app reset', () => {
	it('keeps the space between a field and its hint', async () => {
		await render(ResetField);
		const hint = page.getByText('Receipts go here').element();
		const box = hint.parentElement!.querySelector('.sv-field__box')!;
		expect(getComputedStyle(hint).marginTop).toBe('0px');
		const gap =
			hint.getBoundingClientRect().top +
			parseFloat(getComputedStyle(hint).paddingTop) -
			box.getBoundingClientRect().bottom;
		expect(gap).toBeGreaterThanOrEqual(4);
	});
});
