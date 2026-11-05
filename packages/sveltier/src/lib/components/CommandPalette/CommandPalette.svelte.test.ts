import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CommandPaletteHarness from '../../../tests/fixtures/CommandPaletteHarness.svelte';

const palette = () => page.getByRole('dialog', { name: 'Go to' });
const search = () => page.getByRole('combobox', { name: 'Go to' });
const options = () => page.getByRole('option');
const shown = (testId: string) => page.getByTestId(testId);
const notes = () => page.getByRole('textbox', { name: 'Notes' });
const openIt = () => page.getByRole('button', { name: 'Search' }).click();
// The text of the active option, as the search box names it.
const active = () => {
	const id = search().element().getAttribute('aria-activedescendant');
	return id ? document.getElementById(id)?.textContent?.trim() : undefined;
};

describe('CommandPalette', () => {
	it('opens from its trigger as a modal dialog, with focus in the search box', async () => {
		await render(CommandPaletteHarness);
		await openIt();
		await expect.element(palette()).toBeVisible();
		expect((palette().element() as HTMLDialogElement).matches(':modal')).toBe(true);
		await expect.element(search()).toHaveFocus();
		await expect.element(search()).toHaveAttribute('aria-expanded', 'true');
		expect(options().elements()).toHaveLength(4);
		expect(page.getByRole('group', { name: 'Markets' }).elements()).toHaveLength(1);
		expect(active()).toContain('BTC/USDT');
	});

	it('opens with its shortcut from anywhere, and gives focus back on Escape', async () => {
		await render(CommandPaletteHarness);
		await notes().click();
		const mod = /Mac|iPhone|iPad/.test(navigator.userAgent) ? 'Meta' : 'Control';
		await userEvent.keyboard(`{${mod}>}k{/${mod}}`);
		await expect.element(palette()).toBeVisible();
		await expect.element(search()).toHaveFocus();
		// Pressed again while open, it selects what is typed, to type over it.
		await userEvent.keyboard('eth');
		await userEvent.keyboard(`{${mod}>}k{/${mod}}`);
		const input = search().element() as HTMLInputElement;
		expect([input.selectionStart, input.selectionEnd]).toEqual([0, 3]);
		await userEvent.keyboard('{Escape}');
		await expect.element(palette()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('escape');
		await expect.element(notes()).toHaveFocus();
		// Opened from its trigger next, focus goes back to the trigger.
		await openIt();
		await expect.element(search()).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByRole('button', { name: 'Search' })).toHaveFocus();
	});

	it('binds no shortcut when it is false', async () => {
		await render(CommandPaletteHarness, { shortcut: false });
		await notes().click();
		await userEvent.keyboard('{Control>}k{/Control}{Meta>}k{/Meta}');
		await expect.element(shown('open')).toHaveTextContent('false');
	});

	it('filters as it is typed, by words and keywords, without diacritics', async () => {
		await render(CommandPaletteHarness);
		await openIt();
		await userEvent.keyboard('eth');
		expect(options().elements()).toHaveLength(1);
		expect(active()).toContain('ETH/USDT');
		await userEvent.fill(search(), 'prefer');
		expect(options().elements()).toHaveLength(1);
		expect(active()).toContain('Settings');
		await userEvent.fill(search(), 'ha noi');
		expect(options().elements()).toHaveLength(1);
		// The only match cannot run, so nothing is active.
		expect(active()).toBeUndefined();
		await userEvent.fill(search(), 'nothing like it');
		await expect.element(page.getByRole('status')).toHaveTextContent('No matches');
		expect(page.getByRole('listbox').elements()).toHaveLength(0);
	});

	it('moves past disabled commands, and runs the active one with Enter after closing', async () => {
		await render(CommandPaletteHarness);
		await openIt();
		await userEvent.keyboard('{ArrowDown}');
		expect(active()).toContain('ETH/USDT');
		// Past the disabled page to Settings, and no further.
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		expect(active()).toContain('Settings');
		await userEvent.keyboard('{ArrowUp}');
		expect(active()).toContain('ETH/USDT');
		await userEvent.keyboard('{Enter}');
		await expect.element(palette()).not.toBeInTheDocument();
		await expect.element(shown('ran')).toHaveTextContent('/m/eth');
		await expect.element(shown('reason')).toHaveTextContent('action');
	});

	it('runs a command clicked, and not a disabled one', async () => {
		await render(CommandPaletteHarness);
		await openIt();
		// aria-disabled: the click goes through, and nothing runs.
		await page.getByRole('option', { name: /Hà Nội/ }).click({ force: true });
		await expect.element(palette()).toBeVisible();
		await expect.element(search()).toHaveFocus();
		await page.getByRole('option', { name: /Settings/ }).click();
		await expect.element(shown('ran')).toHaveTextContent('/settings');
	});

	it('starts afresh each time it opens', async () => {
		await render(CommandPaletteHarness);
		await openIt();
		await userEvent.keyboard('sett');
		await expect.element(shown('query')).toHaveTextContent('sett');
		await userEvent.keyboard('{Escape}');
		await expect.element(palette()).not.toBeInTheDocument();
		await openIt();
		await expect.element(search()).toHaveValue('');
		expect(options().elements()).toHaveLength(4);
		expect(active()).toContain('BTC/USDT');
	});

	it('shows the commands as given with filter={false}, and Loading while there are none', async () => {
		await render(CommandPaletteHarness, { filter: false, loading: true, items: [] });
		await openIt();
		await expect.element(page.getByRole('status')).toHaveTextContent('Loading');
		await userEvent.keyboard('btc');
		await expect.element(shown('query')).toHaveTextContent('btc');
	});
});
