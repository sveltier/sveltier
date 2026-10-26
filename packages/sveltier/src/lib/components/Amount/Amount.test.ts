import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import FiguresHarness from '../../../tests/fixtures/FiguresHarness.svelte';
import Amount from './Amount.svelte';
import { figureOptions, figureSegments } from './format.js';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown>) =>
	render(Amount, { props: props as never }).body.replace(/<!--.*?-->/g, '');
const figure = (value: number | bigint, format?: Intl.NumberFormatOptions, decimals?: number) =>
	figureSegments(new Intl.NumberFormat('en-US', figureOptions(format, decimals, 'USD')), value)
		.map((segment) => segment.text)
		.join('');

describe('figureOptions', () => {
	it('keeps the data where Intl would round it away', () => {
		expect(figure(0.00012345)).toBe('0.00012345');
		expect(figure(0.0125, { style: 'percent' })).toBe('1.25%');
		expect(figure(0.1 + 0.2)).toBe('0.3');
	});

	it('fixes the fraction digits with decimals, over the format', () => {
		expect(figure(61.2, undefined, 2)).toBe('61.20');
		expect(figure(61.2, { maximumFractionDigits: 0 }, 3)).toBe('61.200');
	});

	it("gives money the locale's currency and its digits, unless the format names one", () => {
		expect(figure(18084, { style: 'currency' })).toBe('$18,084.00');
		expect(figure(18084, { style: 'currency', currency: 'EUR' })).toBe('€18,084.00');
		expect(figure(1500, { style: 'currency', currency: 'JPY' })).toBe('¥1,500');
	});

	it("leaves compact notation and a value already in percent to Intl's rules", () => {
		expect(figure(1234567, { notation: 'compact' })).toBe('1.2M');
		expect(figure(1.25, { style: 'unit', unit: 'percent' })).toBe('1.25%');
	});
});

describe('figureSegments', () => {
	it('writes a true minus, as wide as the plus', () => {
		expect(figure(-639)).toBe('−639');
		expect(figure(-0.5, { style: 'percent' })).toBe('−50%');
	});

	it('sets the decimal separator and the fraction digits apart', () => {
		const format = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
		expect(figureSegments(format, 1234.5)).toEqual([
			{ text: '1.234', dim: false },
			{ text: ',50', dim: true },
			{ text: ' €', dim: false }
		]);
	});

	it('formats big integers', () => {
		expect(figure(12345678901234567890n)).toBe('12,345,678,901,234,567,890');
	});
});

describe('Amount on the server', () => {
	it('renders the figure in one piece, or a dash for a missing value', () => {
		expect(html({ value: 1234.5, decimals: 2 })).toBe('<span class="sv-amount">1,234.50</span>');
		expect(html({ value: null })).toBe('<span class="sv-amount">—</span>');
	});

	it('dims the fraction when asked', () => {
		expect(html({ value: 1234.5, decimals: 2, dimFraction: true })).toBe(
			'<span class="sv-amount"><span>1,234</span><span class="sv-amount__fraction">.50</span></span>'
		);
	});

	it('masks the figure, telling screen readers it is hidden', () => {
		const body = html({ value: 1234.5, masked: true });
		expect(body).toContain('<span aria-hidden="true">••••</span>');
		expect(body).toContain('<span class="sv-visually-hidden">Amount hidden</span>');
		expect(body).not.toContain('1,234');
	});

	it('renders the flash layer only when asked', () => {
		expect(html({ value: 1 })).not.toContain('sv-amount__flash');
		expect(html({ value: 1, flash: true })).toContain(
			'<span class="sv-amount__flash" aria-hidden="true"></span>'
		);
	});

	it('masks every figure of a subtree through the defaults, changes included', () => {
		const body = render(FiguresHarness, { props: { masked: true } }).body;
		expect(body.match(/Amount hidden/g)).toHaveLength(2);
		expect(body).not.toContain('131.26');
		expect(body).toContain('sv-delta--flat');
		expect(body).not.toContain('sv-delta__arrow');
	});
});
