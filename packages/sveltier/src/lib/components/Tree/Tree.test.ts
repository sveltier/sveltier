import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TreeHarness from '../../../tests/fixtures/TreeHarness.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Tree on the server', () => {
	it('renders the shown nodes, with one tab stop', () => {
		const { body } = render(TreeHarness, { props: { expanded: ['fx'], value: 'eurusd' } });
		expect(body).toContain('role="tree"');
		expect(body).toContain('EUR/USD');
		expect(body).not.toContain('BTC/USDT');
		expect(body.match(/tabindex="0"/g)).toHaveLength(1);
		expect(body).toContain('aria-selected="true"');
	});
});
