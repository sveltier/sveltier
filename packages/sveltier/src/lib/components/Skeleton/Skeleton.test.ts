import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Skeleton from './Skeleton.svelte';

// Runs in Node: the markup the server sends.
describe('Skeleton on the server', () => {
	it('renders its lines, hidden from assistive technology', () => {
		const { body } = render(Skeleton, { props: { lines: 2 } });
		expect(body).toContain('aria-hidden="true"');
		expect(body.match(/sv-skeleton__line/g)).toHaveLength(2);
	});
});
