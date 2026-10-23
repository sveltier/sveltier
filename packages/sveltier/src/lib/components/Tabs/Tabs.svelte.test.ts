import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
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
});
