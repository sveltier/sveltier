import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import OtpInput from './OtpInput.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('OtpInput on the server', () => {
	it('renders one labelled input over a box per character, showing the code it starts with', () => {
		const { body } = render(OtpInput, {
			props: { label: 'Code', id: 'code', name: 'code', length: 4, value: '12' }
		});
		expect(body).toContain('<label class="sv-otp-input__label" for="code">Code');
		expect(body).toMatch(/<input[^>]*autocomplete="one-time-code"/);
		expect(body).toMatch(/<input[^>]*inputmode="numeric"/);
		expect(body).toMatch(/<input[^>]*value="12"/);
		expect(body.match(/class="sv-otp-input__box/g)).toHaveLength(4);
		expect(body).toMatch(/sv-otp-input__box--filled[^>]*aria-hidden="true">1</);
	});
});
