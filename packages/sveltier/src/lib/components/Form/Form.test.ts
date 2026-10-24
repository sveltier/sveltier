import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Form from './Form.svelte';

const fields = createRawSnippet(() => ({ render: () => '<input name="email" />' }));

// Runs in Node: the markup the server sends before any script runs.
describe('Form on the server', () => {
	it('renders a form the browser does not validate on its own, with its attributes', () => {
		const { body } = render(Form, {
			props: { method: 'POST', action: '?/signup', class: 'signup', children: fields }
		});
		expect(body).toMatch(/<form[^>]*method="POST"[^>]*action="\?\/signup"[^>]*novalidate/);
		expect(body).toContain('class="sv-form signup"');
		expect(body).toContain('<input name="email" />');
	});
});
