import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ButtonGroupHarness from '../../../tests/fixtures/ButtonGroupHarness.svelte';

const button = (id: 'first' | 'middle' | 'last') => page.getByTestId(id).element() as HTMLElement;
const radius = (id: 'first' | 'middle' | 'last') => {
	const style = getComputedStyle(button(id));
	return [style.borderTopLeftRadius, style.borderTopRightRadius];
};

describe('ButtonGroup', () => {
	it('is a named group', async () => {
		await render(ButtonGroupHarness, {});
		await expect.element(page.getByRole('group', { name: 'Period' })).toBeVisible();
	});

	it('gives its Buttons its props, and a Button keeps its own', async () => {
		await render(ButtonGroupHarness, { size: 'sm', color: 'success' });
		for (const id of ['first', 'middle'] as const) {
			expect([...button(id).classList]).toEqual(
				expect.arrayContaining(['sv-variant-outlined', 'sv-size-sm', 'sv-color-success'])
			);
		}
		expect(button('last').classList).toContain('sv-variant-flat');
		expect(button('last').classList).toContain('sv-size-sm');
	});

	it('squares the inner corners and keeps the outer ones', async () => {
		await render(ButtonGroupHarness, { rounded: 'full' });
		expect(radius('first')).toEqual(['9999px', '0px']);
		expect(radius('middle')).toEqual(['0px', '0px']);
		expect(radius('last')).toEqual(['0px', '9999px']);
	});

	it('shares one border between neighbours', async () => {
		await render(ButtonGroupHarness, {});
		const first = button('first').getBoundingClientRect();
		const middle = button('middle').getBoundingClientRect();
		expect(middle.left).toBeCloseTo(first.right - 1, 1);
	});
});
