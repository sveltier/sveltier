import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Divider from './Divider.svelte';

// Runs in Node: the markup the server sends.
describe('Divider on the server', () => {
	it('renders an hr, with its orientation when vertical', () => {
		expect(render(Divider).body).toContain('<hr class="sv-divider"');
		const vertical = render(Divider, { props: { vertical: true } }).body;
		expect(vertical).toContain('aria-orientation="vertical"');
		expect(vertical).toContain('sv-divider--vertical');
	});
});
