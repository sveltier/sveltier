import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ProgressCircular from './ProgressCircular.svelte';
import ProgressLinear from './ProgressLinear.svelte';

// Runs in Node: the markup the server sends, value included.
describe('Progress on the server', () => {
	it('renders a progressbar with its value', () => {
		const bar = render(ProgressLinear, { props: { value: 30 } }).body;
		expect(bar).toContain('role="progressbar"');
		expect(bar).toContain('aria-valuenow="30"');
		expect(bar).toContain('scaleX(0.3)');
		const circle = render(ProgressCircular, { props: { indeterminate: true } }).body;
		expect(circle).not.toContain('aria-valuenow');
		expect(circle).toContain('aria-label="Loading"');
	});
});
