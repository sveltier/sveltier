import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Odometer from './Odometer.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown>) =>
	render(Odometer, { props: props as never }).body.replace(/<!--.*?-->/g, '');

describe('Odometer on the server', () => {
	it('renders each digit at its place, so nothing rolls on load', () => {
		const out = html({ value: 42, decimals: 0 });
		expect(out).toContain('--sv-odometer-digit: 4');
		expect(out).toContain('--sv-odometer-digit: 2');
		expect(out).toContain('<span class="sv-visually-hidden">42</span>');
	});
});
