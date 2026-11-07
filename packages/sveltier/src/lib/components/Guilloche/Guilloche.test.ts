import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { rosette, wave } from './curves.js';
import Guilloche from './Guilloche.svelte';

describe('Guilloche curves', () => {
	it('are the same every time, closed for the rosette, with numbers to a tenth', () => {
		expect(rosette()).toBe(rosette());
		expect(rosette().endsWith('Z')).toBe(true);
		expect(wave().endsWith('Z')).toBe(false);
		expect(rosette()).not.toMatch(/\d\.\d\d/);
	});
});

describe('Guilloche on the server', () => {
	it('renders the curve once and a line per turn, hidden from assistive technology', () => {
		const out = render(Guilloche, { props: { lines: 8 } }).body;
		expect(out).toContain('aria-hidden="true"');
		expect(out.match(/<path/g)).toHaveLength(1);
		expect(out.match(/<use/g)).toHaveLength(8);
	});
});
