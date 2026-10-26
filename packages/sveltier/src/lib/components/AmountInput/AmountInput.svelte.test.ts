import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TicketHarness from '../../../tests/fixtures/TicketHarness.svelte';

const quantity = () => page.getByRole('spinbutton', { name: 'Quantity' });
const bound = () => page.getByTestId('quantity');
const share = (name: string) => page.getByRole('button', { name });

describe('AmountInput', () => {
	it('offers shares of the maximum, named for screen readers', async () => {
		await render(TicketHarness, {});
		for (const percent of ['25%', '50%', '75%', '100%']) {
			await expect.element(share(`${percent} of the maximum`)).toHaveTextContent(percent);
		}
		const id = (quantity().element() as HTMLInputElement).id;
		expect(share('25% of the maximum').element().getAttribute('aria-controls')).toBe(id);
	});

	it('sets a share rounded down to whole steps, never more than there is', async () => {
		await render(TicketHarness, {});
		await share('50% of the maximum').click();
		await expect.element(bound()).toHaveTextContent('1100');
		expect((quantity().element() as HTMLInputElement).value).toBe('1,100');
		await share('100% of the maximum').click();
		await expect.element(bound()).toHaveTextContent('2300');
	});

	it('counts a hair under a step from binary rounding as the step', async () => {
		await render(TicketHarness, {
			quantityProps: { step: 0.1, min: 0, max: 1, shares: [0.3] }
		});
		await share('30% of the maximum').click();
		await expect.element(bound()).toHaveTextContent('0.3');
	});

	it('has no shares to press when read-only', async () => {
		await render(TicketHarness, { quantityProps: { readonly: true } });
		await expect.element(share('25% of the maximum')).toBeDisabled();
	});

	it('has no shares without a maximum', async () => {
		await render(TicketHarness, { quantityProps: { max: undefined } });
		await expect.element(quantity()).toBeVisible();
		expect(page.getByRole('button', { name: /of the maximum/ }).elements()).toHaveLength(0);
	});
});
