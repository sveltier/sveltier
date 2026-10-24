import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TabsHarness from '../../../tests/fixtures/TabsHarness.svelte';

// Runs in Node: the server sends the tabs and the selected panel, linked by id.
describe('Tabs on the server', () => {
	it('renders the tab list and the selected panel', () => {
		const { body } = render(TabsHarness, { props: { value: 'activity' } });
		expect(body).toContain('role="tablist"');
		expect(body.match(/role="tab"/g)).toHaveLength(4);
		expect(body).toContain('role="tabpanel"');
		expect(body).toContain('Activity panel');
		const [, panel] = /role="tabpanel" id="([^"]+)"/.exec(body) ?? [];
		expect(body).toContain(`aria-controls="${panel}"`);
	});
});
