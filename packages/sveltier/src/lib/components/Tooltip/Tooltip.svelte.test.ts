import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TooltipDialogHarness from '../../../tests/fixtures/TooltipDialogHarness.svelte';
import TooltipHarness from '../../../tests/fixtures/TooltipHarness.svelte';

const copy = () => page.getByRole('button', { name: 'Copy', exact: true });
const share = () => page.getByRole('button', { name: 'Share', exact: true });
// The tooltip a control is described by: hidden ones are outside the accessibility tree.
const tip = (control = copy()) =>
	document.getElementById(control.element().getAttribute('aria-describedby') ?? '') as HTMLElement;
const shown = (control = copy()) => tip(control).matches(':popover-open');
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Tooltip', () => {
	it('describes its control, and shows once the pointer has rested on it', async () => {
		await render(TooltipHarness);
		expect(tip().getAttribute('role')).toBe('tooltip');
		await expect.element(copy()).toHaveAccessibleDescription('Copy the IBAN');
		await userEvent.hover(copy());
		expect(shown()).toBe(false);
		await expect.poll(() => shown()).toBe(true);
		await expect.poll(() => getComputedStyle(tip()).opacity).toBe('1');
	});

	it('shows at once on keyboard focus, and Escape hides it with focus kept', async () => {
		await render(TooltipHarness, { delay: 5000 });
		await userEvent.keyboard('{Tab}');
		await expect.element(copy()).toHaveFocus();
		await expect.poll(() => shown()).toBe(true);
		await userEvent.keyboard('{Escape}');
		await expect.poll(() => shown()).toBe(false);
		await expect.element(copy()).toHaveFocus();
	});

	it('stays while the pointer moves onto it, and hides when the pointer leaves', async () => {
		await render(TooltipHarness, { delay: 0 });
		await userEvent.hover(copy());
		await expect.poll(() => shown()).toBe(true);
		await userEvent.hover(page.elementLocator(tip()));
		await pause(300);
		expect(shown()).toBe(true);
		await userEvent.hover(page.getByRole('button', { name: 'Elsewhere' }));
		await expect.poll(() => shown()).toBe(false);
	});

	it('hides on a press, and stays hidden while the pointer stays', async () => {
		await render(TooltipHarness, { delay: 0 });
		await userEvent.hover(copy());
		await expect.poll(() => shown()).toBe(true);
		await copy().click();
		await expect.poll(() => shown()).toBe(false);
		await pause(200);
		expect(shown()).toBe(false);
	});

	it('skips the delay while another tooltip shows, as across a toolbar', async () => {
		await render(TooltipHarness, { nextOpen: true, delay: 5000 });
		await expect.poll(() => shown(share())).toBe(true);
		await userEvent.hover(copy());
		await expect.poll(() => shown()).toBe(true);
	});

	it('sits above its control, centred, as wide as its text', async () => {
		await render(TooltipHarness, { open: true });
		await expect.poll(() => shown()).toBe(true);
		await expect
			.poll(() => {
				const control = copy().element().getBoundingClientRect();
				const box = tip().getBoundingClientRect();
				return [
					Math.round(control.top - box.bottom),
					Math.abs(Math.round(control.left + control.width / 2 - (box.left + box.width / 2))),
					box.width > control.width * 2
				];
			})
			.toEqual([8, 0, true]);
	});

	it('shares a control with a dialog it opens: both sets of attributes spread onto it', async () => {
		await render(TooltipDialogHarness);
		const rename = page.getByRole('button', { name: 'Rename' });
		await expect.element(rename).toHaveAccessibleDescription('Rename the account');
		await expect.element(rename).toHaveAttribute('aria-haspopup', 'dialog');
		await userEvent.hover(rename);
		await expect.poll(() => shown(rename)).toBe(true);
		await rename.click();
		await expect.poll(() => shown(rename)).toBe(false);
		const dialog = page.getByRole('dialog', { name: 'Rename the account' });
		await expect.element(dialog).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog).not.toBeInTheDocument();
		await expect.element(rename).toHaveFocus();
	});

	it('takes Escape before the dialog around it, then lets the dialog have it', async () => {
		await render(TooltipHarness, { inDialog: true, delay: 5000 });
		const dialog = page.getByRole('dialog', { name: 'Account' });
		await expect.element(dialog).toBeVisible();
		await share().element().focus();
		await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
		await expect.element(copy()).toHaveFocus();
		await expect.poll(() => shown()).toBe(true);
		await userEvent.keyboard('{Escape}');
		await expect.poll(() => shown()).toBe(false);
		await expect.element(dialog).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog).not.toBeInTheDocument();
	});
});
