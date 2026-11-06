import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Timeline from './Timeline.svelte';

// Runs in Node. Hydration markers are left out of the HTML the tests read.
const html = (props: Record<string, unknown>) =>
	render(Timeline, { props: props as never }).body.replace(/<!--.*?-->/g, '');

describe('Timeline on the server', () => {
	it('renders the events as a list, with their times', () => {
		const out = html({
			'aria-label': 'Transfer',
			items: [
				{ title: 'Sent', time: '2026-11-07T09:30:00Z' },
				{ title: 'Settled', pending: true }
			]
		});
		expect(out).toContain('<ol');
		expect(out).toContain('aria-label="Transfer"');
		expect(out).toContain('datetime="2026-11-07T09:30:00.000Z"');
		expect(out).toContain('Pending');
	});
});
