import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import MenuHarness from '../../../tests/fixtures/MenuHarness.svelte';

const trigger = () => page.getByRole('button', { name: 'Actions' });
const menu = () => page.getByRole('menu', { name: 'Actions' });
const item = (name: string) => page.getByRole('menuitem', { name, exact: true });
const shown = (testId: string) => page.getByTestId(testId);

describe('Menu', () => {
	it('opens from its trigger as a menu named by it, with focus on the first item', async () => {
		await render(MenuHarness);
		await expect.element(trigger()).toHaveAttribute('aria-haspopup', 'menu');
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false');
		await trigger().click();
		await expect.element(menu()).toBeVisible();
		await expect.element(item('Rename F2')).toHaveFocus();
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(trigger()).toHaveAttribute('aria-controls', menu().element().id);
	});

	it('moves with the arrow keys, wrapping and skipping disabled items', async () => {
		await render(MenuHarness);
		await trigger().click();
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Duplicate')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('PDF')).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(item('Delete')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(item('Delete')).toHaveFocus();
		await userEvent.keyboard('{Home}');
		await expect.element(item('Rename F2')).toHaveFocus();
	});

	it('opens at the first item on ArrowDown and at the last on ArrowUp', async () => {
		await render(MenuHarness);
		trigger().element().focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(trigger()).toHaveFocus();
		await expect.element(shown('reason')).toHaveTextContent('escape');
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(item('Delete')).toHaveFocus();
	});

	it('chooses with Enter: closes, gives focus back, then reports the item', async () => {
		await render(MenuHarness);
		await trigger().click();
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{Enter}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('chosen')).toHaveTextContent('duplicate');
		await expect.element(shown('reason')).toHaveTextContent('action');
		await expect.element(trigger()).toHaveFocus();
	});

	it('moves to the item whose label starts with what is typed', async () => {
		await render(MenuHarness);
		await trigger().click();
		await userEvent.keyboard('c');
		await expect.element(item('CSV')).toHaveFocus();
		// A pause starts a new search; one letter again moves on to the next item with it.
		await new Promise((resolve) => setTimeout(resolve, 600));
		await userEvent.keyboard('d');
		await expect.element(item('Delete')).toHaveFocus();
		await userEvent.keyboard('d');
		await expect.element(item('Duplicate')).toHaveFocus();
	});

	it('names its groups by their headings, and draws separators', async () => {
		await render(MenuHarness);
		await trigger().click();
		const group = page.getByRole('group', { name: 'Export' });
		await expect.element(group).toBeVisible();
		await expect.element(group.getByRole('menuitem', { name: 'PDF' })).toBeVisible();
		await expect.element(menu().getByRole('separator')).toBeInTheDocument();
		await expect.element(item('Archive')).toBeDisabled();
	});

	it('closes on Tab, and focus moves on to what follows its trigger', async () => {
		await render(MenuHarness);
		await trigger().click();
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'After' })).toHaveFocus();
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('focus');
	});

	it('gives focus to the item under the pointer, and closes on a press outside', async () => {
		await render(MenuHarness);
		await trigger().click();
		await userEvent.hover(item('CSV'));
		await expect.element(item('CSV')).toHaveFocus();
		await page.getByRole('button', { name: 'Before' }).click();
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('outside');
		await expect.element(shown('chosen')).toHaveTextContent('');
	});
});
