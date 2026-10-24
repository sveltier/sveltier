import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Sheet from './Sheet.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Sheet on the server', () => {
	it('renders a modal dialog placed against its edge while open', () => {
		const { body } = render(Sheet, { props: { title: 'Filters', side: 'bottom', open: true } });
		expect(body).toMatch(/<dialog[^>]*class="[^"]*sv-modal--bottom/);
		expect(body).toContain('sv-sheet');
		expect(body).toContain('>Filters</h2>');
	});
});
