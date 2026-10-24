import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Avatar from './Avatar.svelte';

const initials = createRawSnippet(() => ({ render: () => '<span>AM</span>' }));

// Runs in Node: the markup the server sends.
describe('Avatar on the server', () => {
	it('renders the image when there is one, the fallback otherwise', () => {
		expect(render(Avatar, { props: { src: '/a.png', children: initials } }).body).toContain(
			'<img class="sv-avatar__image" src="/a.png" alt=""'
		);
		expect(render(Avatar, { props: { children: initials } }).body).toContain('<span>AM</span>');
	});

	it('renders a named image when given alt text', () => {
		const { body } = render(Avatar, { props: { alt: 'Alex Morgan', children: initials } });
		expect(body).toContain('role="img"');
		expect(body).toContain('aria-label="Alex Morgan"');
	});
});
