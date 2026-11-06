import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import SecureMask from './SecureMask.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown>) =>
	render(SecureMask, { props: props as never }).body.replace(/<!--.*?-->/g, '');

describe('SecureMask on the server', () => {
	it('sends only the last characters of a masked value', () => {
		const out = html({ label: 'Card', value: '4111111111114821' });
		expect(out).toContain('4821');
		expect(out).not.toContain('411111111111');
		expect(out).toContain('role="group"');
		expect(out).toContain('aria-label="Card"');
	});

	it('sends the whole value when revealed', () => {
		expect(html({ label: 'Card', value: '4111111111114821', revealed: true })).toContain(
			'4111111111114821'
		);
	});
});
