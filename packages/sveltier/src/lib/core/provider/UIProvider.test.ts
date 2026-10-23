import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import UIHarness from '../../../tests/fixtures/UIHarness.svelte';

describe('UIProvider on the server', () => {
	it('renders the theme stylesheet and gives every context its options', () => {
		const { head, body } = render(UIHarness, {
			props: {
				theme: 'monolith-dark',
				defaults: { global: { size: 'lg' } },
				display: { ssrWidth: 1300 },
				locale: { currency: 'EUR', messages: { close: 'Fermer' } }
			}
		});
		expect(head).toContain('<style id="sv-theme">');
		expect(body).toContain('monolith-dark|lg|lg|€5.00|Fermer');
	});

	it('works with only its themes', () => {
		const { body } = render(UIHarness);
		expect(body).toContain('monolith-light|md|xs|$5.00|Close');
	});
});
