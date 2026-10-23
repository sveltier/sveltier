import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ButtonGroupHarness from '../../../tests/fixtures/ButtonGroupHarness.svelte';

// Runs in Node: the group's defaults reach its Buttons in the server markup too.
describe('ButtonGroup on the server', () => {
	it('renders a group whose Buttons take its props', () => {
		const { body } = render(ButtonGroupHarness, { props: { size: 'lg' } });
		expect(body).toContain('role="group"');
		expect(body.match(/sv-size-lg/g)?.length).toBe(3);
		expect(body).toContain('sv-variant-outlined');
	});
});
