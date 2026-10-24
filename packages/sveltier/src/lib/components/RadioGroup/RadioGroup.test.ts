import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import RadioGroup from './RadioGroup.svelte';

const OPTIONS = [
	{ value: 'daily', label: 'Every day' },
	{ value: 'weekly', label: 'Every week' }
];

// Runs in Node: the markup the server sends before any script runs.
describe('RadioGroup on the server', () => {
	it('renders a fieldset with its legend and named radios, the chosen one checked', () => {
		const { body } = render(RadioGroup, {
			props: { label: 'Pay out', name: 'payout', options: OPTIONS, value: 'weekly' }
		});
		expect(body).toMatch(/<fieldset[^>]*class="[^"]*sv-radio-group/);
		expect(body).toMatch(/<fieldset[^>]*role="radiogroup"/);
		expect(body).toMatch(/<legend class="sv-radio-group__legend" id="[^"]+">Pay out/);
		expect(body.match(/<input[^>]*type="radio"[^>]*name="payout"/g)).toHaveLength(2);
		expect(body).toMatch(/<input[^>]*value="weekly"[^>]*checked/);
		expect(body).not.toMatch(/<input[^>]*value="daily"[^>]*checked/);
	});

	it('gives the radios a shared name of their own when none is given', () => {
		const { body } = render(RadioGroup, { props: { label: 'Pay out', options: OPTIONS } });
		const names = [...body.matchAll(/<input[^>]*name="([^"]+)"/g)].map((match) => match[1]);
		expect(names).toHaveLength(2);
		expect(names[0]).toBeTruthy();
		expect(names[0]).toBe(names[1]);
	});
});
