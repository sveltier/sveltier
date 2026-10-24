import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import type { TriggerAttributes } from '../../core/overlay/types.js';
import Menu from './Menu.svelte';
import type { MenuItem } from './types.js';

// Runs in Node: the markup the server sends before any script runs.
describe('Menu on the server', () => {
	const trigger = createRawSnippet((attributes: () => TriggerAttributes) => ({
		render: () =>
			`<button aria-haspopup="${attributes()['aria-haspopup']}" aria-expanded="${attributes()['aria-expanded']}">Actions</button>`
	}));
	const items: MenuItem[] = [
		{ label: 'Rename' },
		{ separator: true },
		{ heading: 'Export' },
		{ label: 'PDF' }
	];

	it('renders its trigger as a collapsed menu button, and no menu while closed', () => {
		const { body } = render(Menu, { props: { items, trigger } });
		expect(body).toContain('aria-haspopup="menu" aria-expanded="false"');
		expect(body).not.toContain('role="menu"');
	});

	it('renders the items, the separator and the named group while open', () => {
		const { body } = render(Menu, { props: { items, trigger, open: true } });
		expect(body).toMatch(/<div[^>]*role="menu"[^>]*popover="manual"/);
		expect(body.match(/role="menuitem"/g)).toHaveLength(2);
		expect(body).toContain('role="separator"');
		// The group is named by its heading; hydration markers may sit between the two.
		expect(body).toMatch(
			/role="group" aria-labelledby="([^"]+)"[^>]*>(?:\s|<!--[^>]*-->)*<div[^>]*id="\1"/
		);
	});
});
