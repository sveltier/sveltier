import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import PortalHarness from '../../../tests/fixtures/PortalHarness.svelte';

describe('Portal on the server', () => {
	it('renders nothing where it is used; the content appears in the browser', () => {
		const { body } = render(PortalHarness);
		expect(body).toContain('data-testid="host"');
		expect(body).not.toContain('portaled');
	});
});
