import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DialogHarness from '../../../tests/fixtures/DialogHarness.svelte';
import DialogReopenHarness from '../../../tests/fixtures/DialogReopenHarness.svelte';

const trigger = () => page.getByRole('button', { name: 'Rename' });
const dialog = () => page.getByRole('dialog', { name: 'Rename the account' });
const shown = (testId: string) => page.getByTestId(testId);

describe('Dialog', () => {
	it('opens from its trigger as a modal dialog named by its title, with focus inside', async () => {
		await render(DialogHarness);
		await expect.element(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
		await trigger().click();
		await expect.element(dialog()).toBeVisible();
		const element = dialog().element() as HTMLDialogElement;
		expect(element.tagName).toBe('DIALOG');
		expect(element.matches(':modal')).toBe(true);
		await expect.element(trigger()).toHaveAttribute('aria-controls', element.id);
		await expect.element(shown('open')).toHaveTextContent('true');
		expect(element.contains(document.activeElement)).toBe(true);
	});

	it('closes on Escape and gives focus back to its trigger', async () => {
		await render(DialogHarness);
		await trigger().click();
		await expect.element(dialog()).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('escape');
		await expect.element(trigger()).toHaveFocus();
	});

	it('takes focus inside again when it opens while it is still closing', async () => {
		const screen = await render(DialogReopenHarness);
		await screen.rerender({ open: true });
		const name = page.getByRole('textbox', { name: 'Name' });
		await expect.element(name).toHaveFocus();
		const element = dialog().element();
		await expect.poll(() => element.getAnimations({ subtree: true }).length).toBe(0);
		// The closing transition makes it inert, which takes focus out of it to the page.
		await screen.rerender({ open: false });
		await expect.poll(() => document.activeElement, { interval: 5 }).toBe(document.body);
		// Opened again before the transition ends, the same dialog comes back.
		await screen.rerender({ open: true });
		expect(dialog().element()).toBe(element);
		await expect.element(name).toHaveFocus();
	});

	it('closes on a press on the backdrop, not on a press in the panel', async () => {
		await render(DialogHarness);
		await trigger().click();
		await page.getByText('Name').click();
		await expect.element(dialog()).toBeVisible();
		await userEvent.click(dialog(), { position: { x: 4, y: 4 } });
		await expect.element(dialog()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('outside');
	});

	it('stays open on Escape and on the backdrop when persistent, and closes from an action', async () => {
		await render(DialogHarness, { persistent: true });
		await trigger().click();
		await userEvent.keyboard('{Escape}');
		await userEvent.click(dialog(), { position: { x: 4, y: 4 } });
		await expect.element(dialog()).toBeVisible();
		await page.getByRole('button', { name: 'Cancel' }).click();
		await expect.element(dialog()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('action');
	});

	it('keeps Tab inside, and the page still under it', async () => {
		await render(DialogHarness);
		await trigger().click();
		await expect.element(dialog()).toBeVisible();
		expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
		for (let press = 0; press < 6; press++) {
			await userEvent.keyboard('{Tab}');
			expect(dialog().element().contains(document.activeElement)).toBe(true);
		}
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog()).not.toBeInTheDocument();
		expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
	});

	it('closes from its labelled close button when closable', async () => {
		await render(DialogHarness, { closable: true });
		await trigger().click();
		await page.getByRole('button', { name: 'Close' }).click();
		await expect.element(dialog()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('action');
	});

	it('closes one layer at a time when dialogs are nested', async () => {
		await render(DialogHarness);
		await trigger().click();
		await page.getByRole('button', { name: 'Check' }).click();
		const inner = page.getByRole('dialog', { name: 'Are you sure?' });
		await expect.element(inner).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(inner).not.toBeInTheDocument();
		await expect.element(dialog()).toBeVisible();
		await expect.element(page.getByRole('button', { name: 'Check' })).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog()).not.toBeInTheDocument();
	});
});
