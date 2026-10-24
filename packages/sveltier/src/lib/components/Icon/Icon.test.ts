import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Icon from './Icon.svelte';

// Runs in Node: the markup the server sends.
describe('Icon on the server', () => {
	it('renders its paths in an SVG, hidden when decorative', () => {
		const { body } = render(Icon, { props: { path: 'M1 1h2v2H1z' } });
		expect(body).toContain('aria-hidden="true"');
		expect(body).toContain('viewBox="0 0 24 24"');
		expect(body).toContain('<path d="M1 1h2v2H1z"');
	});

	it('renders a labelled icon as an image', () => {
		const { body } = render(Icon, { props: { path: 'M1 1h2v2H1z', label: 'Add' } });
		expect(body).toContain('role="img"');
		expect(body).toContain('aria-label="Add"');
	});
});
