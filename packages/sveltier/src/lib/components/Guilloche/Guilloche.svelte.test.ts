import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Guilloche from './Guilloche.svelte';

afterEach(() => vi.restoreAllMocks());

const svg = () => document.querySelector<SVGSVGElement>('svg.sv-guilloche')!;

describe('Guilloche', () => {
	it('is decoration: hidden from assistive technology, filling its box', async () => {
		await render(Guilloche, { style: 'inline-size: 300px; block-size: 120px' });
		expect(svg().getAttribute('aria-hidden')).toBe('true');
		const box = svg().getBoundingClientRect();
		expect(box.width).toBeCloseTo(300, 0);
		expect(box.height).toBeCloseTo(120, 0);
	});

	it('draws one curve and reuses it for every line', async () => {
		const screen = await render(Guilloche, { lines: 12 });
		expect(svg().querySelectorAll('path')).toHaveLength(1);
		expect(svg().querySelectorAll('use')).toHaveLength(12);
		await screen.rerender({ lines: 30, pattern: 'waves' });
		expect(svg().querySelectorAll('path')).toHaveLength(1);
		expect(svg().querySelectorAll('use')).toHaveLength(30);
		// Every line is drawn: its box is not empty.
		const line = svg().querySelectorAll('use')[3]!.getBBox();
		expect(line.width).toBeGreaterThan(100);
	});

	it('keeps the path small, however many lines', async () => {
		await render(Guilloche, { lines: 60 });
		expect(svg().outerHTML.length).toBeLessThan(9000);
	});

	it('draws hairlines in the colour, faint', async () => {
		await render(Guilloche, { color: 'success' });
		expect(getComputedStyle(svg()).strokeOpacity).toBe('0.236');
		expect(getComputedStyle(svg().querySelector('path')!).vectorEffect).toBe('non-scaling-stroke');
		expect(svg().classList).toContain('sv-color-success');
	});

	it('warns in development about a pattern it does not have', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await render(Guilloche, { pattern: 'spiral' as never });
		const message = warn.mock.calls.flat().join(' ');
		expect(message).toContain('[sveltier SV2002] <Guilloche>');
		expect(message).toContain('rosette');
	});
});
