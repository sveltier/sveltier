import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Switch from './Switch.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Switch on the server', () => {
	it('renders a checkbox with the switch role inside its label, on as given', () => {
		const { body } = render(Switch, {
			props: { label: 'Sign in with biometrics', name: 'biometrics', checked: true }
		});
		expect(body).toContain('sv-switch');
		expect(body).toMatch(/<label class="sv-choice__row">/);
		expect(body).toMatch(/<input[^>]*type="checkbox"/);
		expect(body).toMatch(/<input[^>]*role="switch"/);
		expect(body).toMatch(/<input[^>]*\bchecked\b/);
		expect(body).toContain('Sign in with biometrics');
	});
});
