import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CardHarness from '../../../tests/fixtures/CardHarness.svelte';

const card = () => page.getByTestId('card').element() as HTMLElement;

/** How the page paints `value` as a colour, for comparing serialised colours. */
function paint(value: string): string {
	const probe = document.createElement('span');
	probe.style.color = value;
	card().append(probe);
	const painted = getComputedStyle(probe).color;
	probe.remove();
	return painted;
}

describe('Card', () => {
	it('is a raised neutral surface by default', async () => {
		await render(CardHarness, {});
		expect([...card().classList]).toEqual(
			expect.arrayContaining(['sv-variant-elevated', 'sv-color-neutral', 'sv-rounded'])
		);
		expect(getComputedStyle(card()).boxShadow).not.toBe('none');
		expect(getComputedStyle(card()).backgroundColor).toBe(paint('var(--sv-color-surface)'));
		expect(getComputedStyle(card()).color).toBe(paint('var(--sv-color-text)'));
	});

	it('has a header with its parts, the content and actions, in order', async () => {
		await render(CardHarness, {});
		const sections = [...card().children].map((child) => child.className || child.tagName);
		expect(sections).toEqual(['sv-card__header', 'P', 'sv-card__actions']);
		expect(card().querySelector('.sv-card__title')?.textContent?.trim()).toBe('Savings');
		expect(card().querySelector('.sv-card__subtitle')?.textContent).toBe('Instant access');
		await expect.element(page.getByTestId('prepend')).toBeVisible();
		await expect.element(page.getByRole('button', { name: 'More' })).toBeVisible();
		await expect.element(page.getByRole('button', { name: 'Send money' })).toBeVisible();
	});

	it('makes the title a heading of the level asked for', async () => {
		const screen = await render(CardHarness, {});
		expect(card().querySelector('.sv-card__title')?.tagName).toBe('DIV');
		await screen.rerender({ level: 3 });
		await expect.element(page.getByRole('heading', { level: 3, name: 'Savings' })).toBeVisible();
	});

	it('leaves the header out when it has nothing to show', async () => {
		await render(CardHarness, { full: false });
		expect(card().querySelector('.sv-card__header')).toBeNull();
		expect(card().children).toHaveLength(1);
	});

	it('outlines a neutral card in the border colour, not the text colour', async () => {
		await render(CardHarness, { variant: 'outlined' });
		expect(getComputedStyle(card()).borderTopColor).toBe(paint('var(--sv-color-border)'));
		expect(getComputedStyle(card()).boxShadow).toBe('none');
	});

	it('pads by density', async () => {
		const screen = await render(CardHarness, {});
		const padding = () => Number.parseFloat(getComputedStyle(card()).paddingTop);
		expect(padding()).toBeCloseTo(21, 1);
		await screen.rerender({ density: 'compact' });
		expect(padding()).toBeCloseTo(21 * 0.8867, 1);
	});
});
