import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import PopoverHarness from '../../../tests/fixtures/PopoverHarness.svelte';

const trigger = () => page.getByRole('button', { name: 'Amount' });
const popover = () => page.getByRole('dialog', { name: 'Amount range' });
const field = () => page.getByRole('textbox', { name: 'From' });
const reason = () => page.getByTestId('reason');

describe('Popover', () => {
	it('opens beside its trigger as a named non-modal dialog, with focus on its field', async () => {
		await render(PopoverHarness);
		await expect.element(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false');
		await trigger().click();
		await expect.element(popover()).toBeVisible();
		const element = popover().element() as HTMLElement;
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(trigger()).toHaveAttribute('aria-controls', element.id);
		await expect.element(field()).toHaveFocus();
		expect(element.matches(':popover-open')).toBe(true);
		await expect
			.poll(() => {
				const control = trigger().element().getBoundingClientRect();
				const box = element.getBoundingClientRect();
				return [Math.round(box.top - control.bottom), Math.round(box.left - control.left)];
			})
			.toEqual([8, 0]);
	});

	it('closes on Escape and gives focus back to its trigger', async () => {
		await render(PopoverHarness);
		await trigger().click();
		await expect.element(field()).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(popover()).not.toBeInTheDocument();
		await expect.element(reason()).toHaveTextContent('escape');
		await expect.element(trigger()).toHaveFocus();
	});

	it('closes on a press outside', async () => {
		await render(PopoverHarness);
		await trigger().click();
		await expect.element(popover()).toBeVisible();
		await page.getByRole('button', { name: 'After' }).click();
		await expect.element(popover()).not.toBeInTheDocument();
		await expect.element(reason()).toHaveTextContent('outside');
	});

	it('stays open while focus moves back to its trigger, and closes when focus leaves', async () => {
		await render(PopoverHarness);
		await trigger().click();
		await expect.element(field()).toHaveFocus();
		await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
		await expect.element(trigger()).toHaveFocus();
		await expect.element(popover()).toBeVisible();
		await userEvent.keyboard('{Tab}');
		await expect.element(field()).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'After' })).toHaveFocus();
		await expect.element(popover()).not.toBeInTheDocument();
		await expect.element(reason()).toHaveTextContent('focus');
	});

	it('toggles from its trigger, and closes from its actions', async () => {
		await render(PopoverHarness);
		await trigger().click();
		await expect.element(popover()).toBeVisible();
		await trigger().click();
		await expect.element(popover()).not.toBeInTheDocument();
		await expect.element(reason()).toHaveTextContent('action');
		await trigger().click();
		await page.getByRole('button', { name: 'Apply' }).click();
		await expect.element(popover()).not.toBeInTheDocument();
		await expect.element(trigger()).toHaveFocus();
	});

	it('stays open when persistent, until an action closes it', async () => {
		await render(PopoverHarness, { persistent: true });
		await trigger().click();
		await expect.element(field()).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await page.getByRole('button', { name: 'Before' }).click();
		await expect.element(popover()).toBeVisible();
		await page.getByRole('button', { name: 'Apply' }).click();
		await expect.element(popover()).not.toBeInTheDocument();
	});

	it('takes focus itself when it holds nothing that does', async () => {
		await render(PopoverHarness, { fields: false, withActions: false });
		await trigger().click();
		await expect.element(popover()).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(trigger()).toHaveFocus();
	});
});
