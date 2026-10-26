import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Delta from './Delta.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown>) =>
	render(Delta, { props: props as never }).body.replace(/<!--.*?-->/g, '');

describe('Delta on the server', () => {
	it('signs a rise and colours it up', () => {
		const body = html({ value: 4183.2, decimals: 2 });
		expect(body).toContain('sv-delta--up');
		expect(body).toContain('+4,183.20');
	});

	it('signs a fall with a true minus and colours it down', () => {
		const body = html({ value: -0.0125, format: { style: 'percent' } });
		expect(body).toContain('sv-delta--down');
		expect(body).toContain('−1.25%');
	});

	it('leaves no change and a missing value unsigned and muted', () => {
		expect(html({ value: 0, decimals: 2 })).toContain('sv-delta--flat');
		expect(html({ value: 0, decimals: 2 })).toContain('>0.00<');
		expect(html({ value: null })).toContain('sv-delta--flat');
		expect(html({ value: null })).toContain('—');
	});

	it('adds an arrow for a rise or a fall, never for no change', () => {
		expect(html({ value: 1, arrow: true })).toContain('sv-delta__arrow');
		expect(html({ value: -1, arrow: true })).toContain('sv-delta__arrow');
		expect(html({ value: 0, arrow: true })).not.toContain('sv-delta__arrow');
	});

	it('keeps a sign that the format asks for', () => {
		expect(html({ value: 0, format: { signDisplay: 'always' } })).toContain('+0');
	});

	it('takes big integers', () => {
		expect(html({ value: -5n })).toContain('sv-delta--down');
	});
});
