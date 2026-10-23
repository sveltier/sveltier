import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import LayeredBox from './fixtures/LayeredBox.svelte';

// Runs in Node: rendering must not touch window or document.
describe('server rendering', () => {
	it('renders a component without browser globals', () => {
		expect(typeof window).toBe('undefined');

		const { body } = render(LayeredBox, {
			props: { children: createRawSnippet(() => ({ render: () => '<span>Ledger</span>' })) }
		});

		expect(body).toContain('class="sv-layered-box"');
		expect(body).toContain('<span>Ledger</span>');
	});
});
