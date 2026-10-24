import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import SegmentedControl from './SegmentedControl.svelte';

// Runs in Node: the markup the server sends.
describe('SegmentedControl on the server', () => {
	it('renders a radio group with the checked option', () => {
		const { body } = render(SegmentedControl, {
			props: {
				'aria-label': 'View',
				options: [
					{ value: 'list', label: 'List' },
					{ value: 'grid', label: 'Grid' }
				],
				value: 'grid'
			}
		});
		expect(body).toContain('role="radiogroup"');
		expect(body.match(/role="radio"/g)).toHaveLength(2);
		expect(body).toMatch(/aria-checked="true"[^>]*>\s*Grid/);
	});
});
