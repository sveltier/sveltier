import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Chip from './Chip.svelte';

const label = createRawSnippet(() => ({ render: () => '<span>Euro</span>' }));

// Runs in Node: the markup the server sends.
describe('Chip on the server', () => {
	it('renders a span, a toggle button or a link', () => {
		expect(render(Chip, { props: { children: label } }).body).toContain('<span class="sv-chip');
		const toggle = render(Chip, { props: { selected: true, children: label } }).body;
		expect(toggle).toContain('<button');
		expect(toggle).toContain('aria-pressed="true"');
		expect(toggle).toContain('sv-variant-flat');
		expect(render(Chip, { props: { href: '/eur', children: label } }).body).toContain(
			'href="/eur"'
		);
	});

	it('says what is wrong with a closable button', () => {
		expect(
			() => render(Chip, { props: { closable: true, href: '/eur', children: label } }).body
		).toThrow('[sveltier] Chip: a closable chip cannot also be a button or a link.');
	});
});
