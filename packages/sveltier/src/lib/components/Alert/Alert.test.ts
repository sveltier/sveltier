import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Alert from './Alert.svelte';

const message = createRawSnippet(() => ({ render: () => '<span>Payment received.</span>' }));

// Runs in Node: the markup the server sends.
describe('Alert on the server', () => {
	it('renders the message with its role, colour and title', () => {
		const { body } = render(Alert, {
			props: { type: 'success', title: 'Done', children: message }
		});
		expect(body).toContain('role="status"');
		expect(body).toContain('sv-color-success');
		expect(body).toContain('Done');
		expect(body).toContain('Payment received.');
	});

	it('renders nothing when closed', () => {
		expect(render(Alert, { props: { open: false, children: message } }).body).not.toContain(
			'sv-alert'
		);
	});
});
