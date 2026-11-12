import { afterAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Badge from '../lib/components/Badge/Badge.svelte';
import Card from '../lib/components/Card/Card.svelte';

// The development check for a page with no theme runs once a page, so this file has a page of
// its own. The test setup marks every page as themed; this one is not.
const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
const unthemed = () =>
	warn.mock.calls.flat().filter((message) => String(message).includes('SV1008'));
afterAll(() => warn.mockRestore());

describe('a page with no theme', () => {
	it('is named once, by the first component, with the setup that fixes it', async () => {
		document.documentElement.style.removeProperty('--sv-color-scrim');
		await render(Card, { title: 'Savings' });
		await render(Badge, { content: 3 });
		expect(unthemed()).toEqual([
			"[sveltier SV1008] <Card> renders with no theme: there is no <UIProvider> above it, so it has none of the theme's colours, type and spacing, and toasts have nowhere to show. Wrap the app in <UIProvider themes={monolith}> once, in the root layout (src/routes/+layout.svelte, or App.svelte with Vite alone), with UIProvider from '@sveltier/ui' and monolith from '@sveltier/ui/themes/monolith'. https://sveltier.com/errors#SV1008"
		]);
	});
});
