import { afterAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from '../lib/components/Card/Card.svelte';
import ThemedButton from './fixtures/ThemedButton.svelte';

// The development check for a page with no theme runs once a page, so this file has a page of
// its own, unmarked: the setup marks every page as themed.
const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
const unthemed = () =>
	warn.mock.calls.flat().filter((message) => String(message).includes('SV1008'));
afterAll(() => warn.mockRestore());

describe('a page with a theme', () => {
	it('says nothing inside a provider, or outside one while the theme is on the page', async () => {
		document.documentElement.style.removeProperty('--sv-color-scrim');
		await render(ThemedButton);
		// The provider's stylesheet themes the whole page, so a component outside it is themed too.
		await render(Card, { title: 'Savings' });
		expect(unthemed()).toEqual([]);
	});
});
