import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ToastHarness from '../../../tests/fixtures/ToastHarness.svelte';

const NAME = 'Notifications (F8)';
const region = () => page.getByRole('region', { name: NAME });
const toast = (text: string) => region().getByRole('listitem').filter({ hasText: text });
const button = (name: string) => page.getByRole('button', { name, exact: true });
// What the toast live regions read out, paragraph by paragraph: only the topmost outlet's
// have anything.
const live = (politeness: 'polite' | 'assertive') =>
	[...document.querySelectorAll(`.sv-visually-hidden[aria-live="${politeness}"] p`)].map(
		(paragraph) => paragraph.textContent
	);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Presses a button from the keyboard, so it keeps focus in every browser: WebKit does not
// focus a button that is clicked.
async function press(name: string) {
	(button(name).element() as HTMLElement).focus();
	await userEvent.keyboard('{Enter}');
}

describe('Toasts', () => {
	it('shows a toast in a named region in the top layer, and reads it out politely', async () => {
		await render(ToastHarness);
		await button('Save').click();
		await expect.element(toast('Saved 1')).toBeVisible();
		expect((region().element() as HTMLElement).matches(':popover-open')).toBe(true);
		await expect.poll(() => live('polite')).toContain('Saved 1');
		expect(live('assertive')).toEqual([]);
	});

	it('reads an error out at once', async () => {
		await render(ToastHarness);
		await button('Fail').click();
		await expect.element(toast('Payment failed')).toBeVisible();
		await expect.poll(() => live('assertive')).toContain('Payment failed');
		expect(live('polite')).toEqual([]);
	});

	it('reads the action out after the message', async () => {
		await render(ToastHarness);
		await button('Send').click();
		await expect.poll(() => live('polite')).toEqual(['Payment sent', 'Undo']);
	});

	it('runs its action, then closes', async () => {
		await render(ToastHarness);
		await button('Send').click();
		await toast('Payment sent').getByRole('button', { name: 'Undo' }).click();
		await expect.element(page.getByTestId('undone')).toHaveTextContent('1');
		await expect.element(toast('Payment sent')).not.toBeInTheDocument();
	});

	it('closes from its close button and from dismiss()', async () => {
		await render(ToastHarness);
		await button('Save').click();
		await toast('Saved 1').getByRole('button', { name: 'Close' }).click();
		await expect.element(toast('Saved 1')).not.toBeInTheDocument();
		await button('Save').click();
		await expect.element(toast('Saved 2')).toBeVisible();
		await button('Dismiss').click();
		await expect.element(toast('Saved 2')).not.toBeInTheDocument();
	});

	it('keeps at most three, newest first', async () => {
		await render(ToastHarness);
		for (let i = 0; i < 4; i++) await button('Save').click();
		await expect.element(toast('Saved 1')).not.toBeInTheDocument();
		const texts = [...region().element().querySelectorAll('.sv-toast__message')].map(
			(message) => message.textContent
		);
		expect(texts).toEqual(['Saved 4', 'Saved 3', 'Saved 2']);
	});

	it('leaves after its duration, which waits while the pointer is on the toasts', async () => {
		await render(ToastHarness, { duration: 400 });
		await button('Save').click();
		await toast('Saved 1').hover();
		await wait(700);
		await expect.element(toast('Saved 1')).toBeVisible();
		await button('Fail').hover();
		await expect.element(toast('Saved 1')).not.toBeInTheDocument();
	});

	it('takes its duration from the defaults', async () => {
		await render(ToastHarness, { defaults: { Toast: { duration: 300 } } });
		await button('Save').click();
		await expect.element(toast('Saved 1')).not.toBeInTheDocument();
	});

	it('stays with a duration of 0', async () => {
		await render(ToastHarness, { duration: 0 });
		await button('Save').click();
		await wait(500);
		await expect.element(toast('Saved 1')).toBeVisible();
	});

	it('moves focus to the toasts on F8, waits while it is there, and goes back on Escape', async () => {
		await render(ToastHarness, { duration: 600 });
		await press('Send');
		await expect.element(toast('Payment sent')).toBeVisible();
		await userEvent.keyboard('{F8}');
		await expect.element(region()).toHaveFocus();
		await wait(900);
		await expect.element(toast('Payment sent')).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(button('Send')).toHaveFocus();
		await expect.element(toast('Payment sent')).not.toBeInTheDocument();
	});

	it('gives focus back when the toast it was in closes', async () => {
		await render(ToastHarness);
		await press('Send');
		await userEvent.keyboard('{F8}');
		await userEvent.keyboard('{Tab}');
		await expect.element(toast('Payment sent').getByRole('button', { name: 'Undo' })).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByTestId('undone')).toHaveTextContent('1');
		await expect.element(button('Send')).toHaveFocus();
	});

	it('shows inside an open dialog, where its action works and the dialog stays open', async () => {
		await render(ToastHarness);
		await button('Transfer').click();
		const dialog = page.getByRole('dialog', { name: 'Transfer' });
		await dialog.getByRole('button', { name: 'Save transfer' }).click();
		const inside = dialog.getByRole('region', { name: NAME }).getByRole('listitem');
		await expect.element(inside.filter({ hasText: 'Transfer saved' })).toBeVisible();
		await expect.poll(() => live('polite')).toContain('Transfer saved');
		await inside.getByRole('button', { name: 'Undo' }).click();
		await expect.element(page.getByTestId('undone')).toHaveTextContent('1');
		await expect.element(dialog).toBeVisible();
	});

	it('keeps a dialog open when Escape leaves the toasts in it', async () => {
		await render(ToastHarness);
		await button('Transfer').click();
		const dialog = page.getByRole('dialog', { name: 'Transfer' });
		await press('Save transfer');
		await userEvent.keyboard('{F8}');
		await expect.element(dialog.getByRole('region', { name: NAME })).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog.getByRole('button', { name: 'Save transfer' })).toHaveFocus();
		await expect.element(dialog).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog).not.toBeInTheDocument();
	});

	it('moves its toasts into a dialog that opens, and back to the page as it closes', async () => {
		await render(ToastHarness, { duration: 0 });
		await button('Send').click();
		await button('Transfer').click();
		const dialog = page.getByRole('dialog', { name: 'Transfer' });
		const inside = dialog.getByRole('region', { name: NAME });
		await expect.element(inside.getByText('Payment sent')).toBeVisible();
		expect(document.querySelectorAll('.sv-toast')).toHaveLength(1);
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog).not.toBeInTheDocument();
		await expect.element(toast('Payment sent')).toBeVisible();
		expect(document.querySelectorAll('.sv-toast')).toHaveLength(1);
	});
});
