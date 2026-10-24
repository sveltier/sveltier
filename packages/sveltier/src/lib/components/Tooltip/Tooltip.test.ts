import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import type { TriggerAttributes } from '../../core/overlay/types.js';
import Tooltip from './Tooltip.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Tooltip on the server', () => {
	it('renders the text hidden, as the description of its control', () => {
		const trigger = createRawSnippet((attributes: () => TriggerAttributes) => ({
			render: () => `<button aria-describedby="${attributes()['aria-describedby']}">C</button>`
		}));
		const { body } = render(Tooltip, { props: { text: 'Copy the IBAN', trigger } });
		const id = /aria-describedby="([^"]+)"/.exec(body)?.[1];
		expect(id).toBeTruthy();
		expect(body).toMatch(
			new RegExp(
				`<div[^>]*id="${id}"[^>]*role="tooltip"[^>]*popover="manual"[^>]*>Copy the IBAN</div>`
			)
		);
	});
});
