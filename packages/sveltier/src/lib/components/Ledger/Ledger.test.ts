import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import LedgerHarness from '../../../tests/fixtures/LedgerHarness.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown> = {}) =>
	render(LedgerHarness, { props: props as never }).body.replace(/<!--.*?-->/g, '');

describe('Ledger and Receipt on the server', () => {
	it('render the rows as terms and descriptions in a list, the receipt named by its title', () => {
		const out = html({ level: 2 });
		expect(out).toMatch(/<section[^>]*aria-labelledby="([^"]+)-title"/);
		expect(out).toMatch(/<h2[^>]*class="sv-receipt__title"/);
		expect(out).toContain('<dt class="sv-ledger-row__label">Amount</dt>');
		expect(out).toContain('$1,002.50');
		expect(out.match(/<dl/g)).toHaveLength(2);
	});
});
