import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { monolith } from '../lib/themes/monolith.js';
import FigureFonts from './fixtures/FigureFonts.svelte';

const face = (element: Element) => getComputedStyle(element).fontFamily;
const byId = (id: string) => page.getByTestId(id).element();
/** The family as the browser serialises it, for comparing with computed styles. */
function serialised(family: string): string {
	const probe = document.createElement('span');
	probe.style.fontFamily = family;
	return probe.style.fontFamily;
}

const DATA = serialised(String(monolith['monolith-light'].variables['font-data']));
const UI = serialised(String(monolith['monolith-light'].variables['font-ui']));

describe('figures', () => {
	it("are in the theme's data face, in text set in its UI face", async () => {
		await render(FigureFonts, {});
		expect(face(byId('text'))).toBe(UI);
		// A Delta's figure is an Amount; the arrow beside it keeps the text face.
		const delta = byId('delta').querySelector('.sv-amount')!;
		for (const element of [byId('amount'), delta, byId('odometer')])
			expect(face(element)).toBe(DATA);
		const field = page.getByRole('spinbutton', { name: 'Quantity' }).element();
		expect(face(field)).toBe(DATA);
	});

	it('in a table, the numbers it shows; other values keep the text face', async () => {
		await render(FigureFonts, {});
		expect(face(page.getByRole('cell', { name: '131.26' }).element())).toBe(DATA);
		expect(face(page.getByRole('cell', { name: 'AAPL' }).element())).toBe(UI);
	});

	it('take the font of the text around them with font="inherit", or under a provider', async () => {
		await render(FigureFonts, { font: 'inherit' });
		for (const id of [
			'amount',
			'delta',
			'odometer',
			'prose-amount',
			'prose-delta',
			'prose-odometer'
		]) {
			const figure = byId(id).querySelector('.sv-amount') ?? byId(id);
			expect(face(figure), id).toBe(UI);
		}
	});
});
