import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import StepperHarness from '../../../tests/fixtures/StepperHarness.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Stepper on the server', () => {
	it('renders the steps with the current one marked', () => {
		const { body } = render(StepperHarness, { props: { value: 'identity' } });
		expect(body).toContain('<ol');
		expect(body.match(/aria-current="step"/g)).toHaveLength(1);
		expect(body).toContain('Completed');
		expect(body).toContain('Review');
	});
});
