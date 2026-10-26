import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TicketHarness from '../../../tests/fixtures/TicketHarness.svelte';

const price = () => page.getByRole('spinbutton', { name: 'Price' });
const element = () => price().element() as HTMLInputElement;
const bound = () => page.getByTestId('price');
const press = async (key: string) => {
	element().focus();
	await userEvent.keyboard(key);
};

// A tick of 10 below 10,000, 50 up to 50,000, then 100, as a stock exchange sets them.
const BANDS = [
	{ from: 0, step: 10 },
	{ from: 10000, step: 50 },
	{ from: 50000, step: 100 }
];

describe('PriceInput', () => {
	it("shows the tick's decimals and steps by the tick", async () => {
		await render(TicketHarness, { price: 61.2 });
		expect(element().value).toBe('61.20');
		await press('{ArrowUp}');
		await expect.element(bound()).toHaveTextContent('61.25');
		expect(element().value).toBe('61.25');
	});

	it('starts at the smallest tick, never zero', async () => {
		await render(TicketHarness, {});
		await press('{ArrowUp}');
		await expect.element(bound()).toHaveTextContent('0.05');
		await press('{ArrowDown}');
		await expect.element(bound()).toHaveTextContent('0.05');
	});

	it('says a typed price off the ticks is an error', async () => {
		await render(TicketHarness, {});
		await price().fill('61.23');
		await userEvent.keyboard('{Tab}');
		await expect.element(price()).toHaveAccessibleDescription('Enter a value in steps of 0.05');
	});

	it('steps through ticks that change with the price', async () => {
		await render(TicketHarness, { price: 9990, priceProps: { tick: BANDS } });
		expect(element().value).toBe('9,990');
		await press('{ArrowUp}');
		await expect.element(bound()).toHaveTextContent('10000');
		await press('{ArrowUp}');
		await expect.element(bound()).toHaveTextContent('10050');
		await press('{ArrowDown}');
		await press('{ArrowDown}');
		await expect.element(bound()).toHaveTextContent('9990');
	});
});
