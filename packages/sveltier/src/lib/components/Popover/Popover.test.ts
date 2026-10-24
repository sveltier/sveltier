import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import type { TriggerAttributes } from '../../core/overlay/types.js';
import Popover from './Popover.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Popover on the server', () => {
	const trigger = createRawSnippet((attributes: () => TriggerAttributes) => ({
		render: () => `<button aria-expanded="${attributes()['aria-expanded']}">Amount</button>`
	}));

	it('renders its trigger collapsed, and no panel while closed', () => {
		const { body } = render(Popover, { props: { title: 'Amount range', trigger } });
		expect(body).toContain('aria-expanded="false"');
		expect(body).not.toContain('role="dialog"');
	});

	it('renders the panel as a named dialog in a manual popover while open', () => {
		const { body } = render(Popover, { props: { title: 'Amount range', trigger, open: true } });
		expect(body).toMatch(/<div[^>]*role="dialog"[^>]*popover="manual"/);
		expect(body).toMatch(/aria-labelledby="([^"]+)-title"/);
		expect(body).toContain('>Amount range</div>');
	});
});
