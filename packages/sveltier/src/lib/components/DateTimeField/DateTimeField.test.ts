import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import DateTimeFieldHarness from '../../../tests/fixtures/DateTimeFieldHarness.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const strip = (body: string) => body.replace(/<!--.*?-->/g, '');

describe('DateTimeField on the server', () => {
	it('writes the date and the time in the locale format, names both, and submits the value', () => {
		const body = strip(render(DateTimeFieldHarness, { props: { value: '2026-10-26T21:05' } }).body);
		expect(body).toContain('value="10/26/2026"');
		expect(body).toContain('value="09:05 PM"');
		expect(body).toMatch(/aria-labelledby="(\w+)-label \1-date"/);
		expect(body).toMatch(/aria-labelledby="(\w+)-label \1-time"/);
		expect(body).toContain('role="spinbutton"');
		expect(body).toContain('<input type="hidden" name="opened" value="2026-10-26T21:05"/>');
	});

	it('shows nothing for a value it cannot read', () => {
		const body = strip(render(DateTimeFieldHarness, { props: { value: '2026-10-26' } }).body);
		expect(body).not.toContain('value="10/26/2026"');
	});
});
