import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import IconHarness from '../../../tests/fixtures/IconHarness.svelte';

const icon = (id = 'icon') => page.getByTestId(id).element() as HTMLElement;
const box = (id = 'icon') => icon(id).getBoundingClientRect();

/** How the page paints `value` as a text colour, for comparing serialised colours. */
function paint(value: string): string {
	const probe = document.createElement('span');
	probe.style.color = value;
	icon().append(probe);
	const painted = getComputedStyle(probe).color;
	probe.remove();
	return painted;
}

describe('Icon', () => {
	it('draws its path, hidden from assistive technology', async () => {
		await render(IconHarness, { path: 'M1 1h2v2H1z M5 5h2v2H5z' });
		expect(icon().querySelector('path')?.getAttribute('d')).toBe('M1 1h2v2H1z M5 5h2v2H5z');
		expect(icon().getAttribute('aria-hidden')).toBe('true');
		expect(icon().hasAttribute('role')).toBe(false);
	});

	it('is an image with a name when labelled', async () => {
		await render(IconHarness, { label: 'Add' });
		expect(icon().hasAttribute('aria-hidden')).toBe(false);
		await expect.element(page.getByRole('img', { name: 'Add' })).toBeVisible();
	});

	it('follows the text around it, φ^½ larger', async () => {
		await render(IconHarness, {});
		expect(box().width).toBeCloseTo(20 * 1.272, 1);
		expect(box().height).toBeCloseTo(20 * 1.272, 1);
		const button = Number.parseFloat(getComputedStyle(icon('button')).fontSize);
		expect(box('in-button').width).toBeCloseTo(button * 1.272, 1);
	});

	it('takes a shared size of its own', async () => {
		await render(IconHarness, { size: 'xl' });
		const text = Number.parseFloat(getComputedStyle(icon()).fontSize);
		expect(text).not.toBe(20);
		expect(box().width).toBeCloseTo(text * 1.272, 1);
	});

	it('takes the text colour, or its own', async () => {
		const screen = await render(IconHarness, {});
		expect(getComputedStyle(icon()).color).toBe(getComputedStyle(icon('text')).color);
		await screen.rerender({ color: 'success' });
		expect(getComputedStyle(icon()).color).toBe(paint('var(--sv-color-success)'));
	});

	it('sizes an SVG of your own like a path', async () => {
		await render(IconHarness, {});
		const svg = page.getByTestId('svg').element().getBoundingClientRect();
		expect(svg.width).toBeCloseTo(box('custom').width, 1);
		await expect.element(page.getByRole('img', { name: 'Bank' })).toBeVisible();
	});

	it('passes attributes and classes through', async () => {
		await render(IconHarness, { class: 'brand', id: 'plus', title: 'Plus' });
		expect(icon().className).toMatch(/^sv-icon .*brand$/);
		expect(icon().id).toBe('plus');
		expect(icon().title).toBe('Plus');
	});
});
