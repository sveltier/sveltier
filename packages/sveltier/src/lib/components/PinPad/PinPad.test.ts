import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import PinPad from './PinPad.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown>) =>
	render(PinPad, { props: props as never }).body.replace(/<!--.*?-->/g, '');

describe('PinPad on the server', () => {
	it('renders the keys in the phone order, shuffled or not, and no digit entered', () => {
		const out = html({ label: 'PIN', value: '1234', shuffle: true, name: 'pin' });
		const keys = [...out.matchAll(/class="sv-pin-pad__key">(\d)</g)].map((match) => match[1]);
		expect(keys).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
		expect(out).toContain('4 of 6 digits entered');
		expect(out).toContain('role="group"');
	});
});
