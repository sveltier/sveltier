import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { firstFrame, type Frame } from './animations.js';
import ContextMenuHarness from './fixtures/ContextMenuHarness.svelte';
import DialogHarness from './fixtures/DialogHarness.svelte';
import MenuHarness from './fixtures/MenuHarness.svelte';
import PopoverHarness from './fixtures/PopoverHarness.svelte';
import SelectHarness from './fixtures/SelectHarness.svelte';

// An overlay grows out of what opened it, so the eye can follow where it came from.

const scaleOf = (frame: Frame) => Number(/scale\(([\d.]+)\)/.exec(String(frame.transform))?.[1]);

const centre = (element: Element) => {
	const box = element.getBoundingClientRect();
	return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

// The transform origin sits on the source's centre, in the element's box.
function expectOriginAt(frame: Frame, element: Element, source: { x: number; y: number }) {
	const [x, y] = String(frame.transformOrigin).split(' ').map(parseFloat);
	const box = element.getBoundingClientRect();
	expect(Math.abs(x! - (source.x - box.x))).toBeLessThan(2);
	expect(Math.abs(y! - (source.y - box.y))).toBeLessThan(2);
}

describe('overlays grow out of what opened them', () => {
	it('Dialog grows from its trigger, from no less than 38.2%', async () => {
		await render(DialogHarness);
		const trigger = page.getByRole('button', { name: 'Rename' }).element();
		const from = centre(trigger);
		await page.getByRole('button', { name: 'Rename' }).click();
		const panel = document.querySelector('.sv-modal__panel')!;
		const frame = await firstFrame(panel);
		expect(frame.opacity).toBe('0');
		expect(scaleOf(frame)).toBe(0.382);
		expectOriginAt(frame, panel, from);
	});

	it('Popover grows from its trigger', async () => {
		await render(PopoverHarness);
		const trigger = page.getByRole('button', { name: 'Amount' }).element();
		await page.getByRole('button', { name: 'Amount' }).click();
		const panel = page.getByRole('dialog', { name: 'Amount range' }).element();
		const frame = await firstFrame(panel);
		expect(scaleOf(frame)).toBeGreaterThanOrEqual(0.382);
		expect(scaleOf(frame)).toBeLessThan(0.944);
		expectOriginAt(frame, panel, centre(trigger));
	});

	it('Menu grows from its button', async () => {
		await render(MenuHarness);
		const trigger = page.getByRole('button', { name: 'Actions' }).element();
		await page.getByRole('button', { name: 'Actions' }).click();
		const menu = page.getByRole('menu').element();
		expectOriginAt(await firstFrame(menu), menu, centre(trigger));
	});

	it('ContextMenu grows from the point it opened at', async () => {
		await render(ContextMenuHarness);
		const row = page.getByRole('button', { name: 'Order A-2' });
		await row.click({ button: 'right', position: { x: 40, y: 10 } });
		// Playwright's position counts from the padding box.
		const { clientLeft, clientTop } = row.element();
		const box = row.element().getBoundingClientRect();
		const menu = page.getByRole('menu', { name: 'Order actions' }).element();
		const frame = await firstFrame(menu);
		expect(scaleOf(frame)).toBe(0.382);
		expectOriginAt(frame, menu, { x: box.x + clientLeft + 40, y: box.y + clientTop + 10 });
	});

	it("Select's list grows out of the field", async () => {
		await render(SelectHarness);
		await page.getByRole('combobox', { name: 'Market' }).click();
		const list = page.getByRole('listbox').element();
		const frame = await firstFrame(list);
		// As wide as the field, it barely scales: it unfolds from the field's centre.
		expect(scaleOf(frame)).toBe(0.944);
		expect(String(frame.transformOrigin)).not.toBe('center');
	});
});
