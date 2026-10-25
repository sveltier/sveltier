import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Dialog from './Dialog.svelte';

const body = createRawSnippet(() => ({ render: () => '<p>Body</p>' }));

// Runs in Node: the markup the server sends before any script runs.
describe('Dialog on the server', () => {
	it('renders nothing while closed', () => {
		const { body: html } = render(Dialog, { props: { title: 'Rename', children: body } });
		expect(html).not.toContain('<dialog');
	});

	it('renders the dialog, named by its title, while open', () => {
		const { body: html } = render(Dialog, {
			props: { title: 'Rename', id: 'rename', open: true, children: body }
		});
		expect(html).toMatch(/<dialog[^>]*aria-labelledby="rename-title"/);
		expect(html).toContain('<h2 class="sv-modal__title" id="rename-title">Rename</h2>');
		expect(html).toContain('<p>Body</p>');
	});
});
