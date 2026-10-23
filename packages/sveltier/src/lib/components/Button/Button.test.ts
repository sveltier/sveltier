import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Button from './Button.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Pay now</span>' }));

// Runs in Node: the markup the server sends before any script runs.
describe('Button on the server', () => {
	it('renders a button with its shared classes and type', () => {
		const { body } = render(Button, { props: { children: label } });
		expect(body).toContain('<button');
		expect(body).toContain('type="button"');
		expect(body).toContain(
			'class="sv-button sv-variant-flat sv-density-default sv-size-md sv-color-primary sv-rounded"'
		);
		expect(body).toContain('Pay now');
	});

	it('renders a link for href, and an inert one when disabled', () => {
		const link = render(Button, { props: { href: '/pay', children: label } }).body;
		expect(link).toContain('<a');
		expect(link).toContain('href="/pay"');
		expect(link).not.toContain('type=');
		const disabled = render(Button, {
			props: { href: '/pay', disabled: true, children: label }
		}).body;
		expect(disabled).not.toContain('href=');
		expect(disabled).toContain('role="link"');
		expect(disabled).toContain('aria-disabled="true"');
	});

	it('renders the loading state with its message', () => {
		const { body } = render(Button, { props: { loading: true, children: label } });
		expect(body).toContain('aria-disabled="true"');
		expect(body).toContain('sv-button--loading');
		expect(body).toContain('Loading');
	});
});
