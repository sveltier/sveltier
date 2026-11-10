import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { firstFrame, scripted, twoFrames } from '../../../tests/animations.js';
import TabsFillHarness from '../../../tests/fixtures/TabsFillHarness.svelte';
import TabsHarness from '../../../tests/fixtures/TabsHarness.svelte';

const tablist = () => page.getByRole('tablist', { name: 'Account' });
const tab = (name: string) => tablist().getByRole('tab', { name });
const tabElement = (name: string) => tab(name).element() as HTMLElement;
const panelText = () => page.getByTestId('panel-content').element().textContent;
const value = () => page.getByTestId('value').element().textContent;

describe('Tabs', () => {
	it('selects the first tab when nothing is chosen, with its panel', async () => {
		await render(TabsHarness, {});
		await expect.element(tab('Overview')).toHaveAttribute('aria-selected', 'true');
		const panel = page.getByRole('tabpanel', { name: 'Overview' });
		await expect.element(panel).toBeVisible();
		expect(tabElement('Overview').getAttribute('aria-controls')).toBe(
			panel.element().getAttribute('id')
		);
		expect(tabElement('Activity').hasAttribute('aria-controls')).toBe(false);
		expect(panel.element().getAttribute('tabindex')).toBe('0');
		expect(panelText()).toBe('Overview panel');
	});

	it('has one tab stop, on the selected tab', async () => {
		await render(TabsHarness, { value: 'activity' });
		expect(tabElement('Activity').tabIndex).toBe(0);
		expect(tabElement('Overview').tabIndex).toBe(-1);
	});

	it('selects on click and binds the value', async () => {
		await render(TabsHarness, {});
		await tab('Settings').click();
		await expect.element(tab('Settings')).toHaveAttribute('aria-selected', 'true');
		expect(value()).toBe('settings');
		expect(panelText()).toBe('Settings panel');
	});

	it('selects as the arrow keys move, skipping disabled tabs', async () => {
		await render(TabsHarness, { value: 'activity' });
		tabElement('Activity').focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(value()).toBe('settings');
		await expect.element(tab('Settings')).toHaveFocus();
		await userEvent.keyboard('{Home}');
		expect(value()).toBe('overview');
		await userEvent.keyboard('{End}');
		expect(value()).toBe('settings');
	});

	it('waits for Enter or Space with manual activation', async () => {
		await render(TabsHarness, { activation: 'manual', value: 'overview' });
		tabElement('Overview').focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tab('Activity')).toHaveFocus();
		expect(value()).toBe('overview');
		await userEvent.keyboard('{Enter}');
		expect(value()).toBe('activity');
	});

	it('underlines the selected tab only', async () => {
		await render(TabsHarness, {});
		const underline = (name: string) => getComputedStyle(tabElement(name), '::after').transform;
		await expect.poll(() => underline('Overview')).toBe('matrix(1, 0, 0, 1, 0, 0)');
		expect(underline('Activity')).toBe('matrix(0, 0, 0, 1, 0, 0)');
	});

	it('renders no panel without a panel snippet', async () => {
		await render(TabsHarness, { withPanel: false });
		expect(page.getByRole('tabpanel').query()).toBeNull();
		expect(tabElement('Overview').hasAttribute('aria-controls')).toBe(false);
	});

	it('fills its box with fill: the list and filters stay, the table scrolls', async () => {
		await render(TabsFillHarness, {});
		const frame = page.getByTestId('frame').element().getBoundingClientRect();
		const panel = document.querySelector('.sv-tabs__panel')!.getBoundingClientRect();
		const table = document.querySelector<HTMLElement>('.sv-table')!;
		expect(Math.abs(panel.bottom - frame.bottom)).toBeLessThan(1);
		// The table, not the page or the panel, holds the overflow.
		expect(table.scrollHeight).toBeGreaterThan(table.clientHeight);
		expect(table.getBoundingClientRect().bottom).toBeLessThanOrEqual(frame.bottom + 1);
		table.scrollTop = 400;
		const filters = page.getByTestId('filters').element().getBoundingClientRect();
		expect(filters.top).toBeGreaterThanOrEqual(frame.top);
		expect(page.getByRole('tab', { name: 'Tickers' }).element().getBoundingClientRect().top).toBe(
			frame.top
		);
	});
});

describe('Tabs underline', () => {
	it('slides from the old tab to the new one', async () => {
		await render(TabsHarness, {});
		const from = tabElement('Overview').getBoundingClientRect();
		const to = tabElement('Settings').getBoundingClientRect();
		await tab('Settings').click();
		const frame = await firstFrame(tabElement('Settings'), '::after');
		// It starts over the old tab: moved between the centres, scaled between the widths.
		const [, dx, scale] = /translateX\((-?[\d.]+)px\) scaleX\(([\d.]+)\)/.exec(
			String(frame.transform)
		)!;
		expect(Number(dx)).toBeCloseTo(from.x + from.width / 2 - to.x - to.width / 2, 0);
		expect(Number(scale)).toBeCloseTo(from.width / to.width, 2);
	});

	it('does not move on first render', async () => {
		await render(TabsHarness, { value: 'activity' });
		expect(scripted()).toHaveLength(0);
	});

	it('jumps under reduced motion', async () => {
		await render(TabsHarness, {});
		(tablist().element() as HTMLElement).style.setProperty('--sv-duration-normal', '0.01ms');
		await userEvent.click(tab('Settings'));
		await twoFrames();
		expect(scripted()).toHaveLength(0);
	});
});
