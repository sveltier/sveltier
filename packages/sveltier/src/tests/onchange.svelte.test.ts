import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ChipHarness from './fixtures/ChipHarness.svelte';
import NativeSelectHarness from './fixtures/NativeSelectHarness.svelte';
import NumberFieldHarness from './fixtures/NumberFieldHarness.svelte';
import OtpInputHarness from './fixtures/OtpInputHarness.svelte';
import SliderHarness from './fixtures/SliderHarness.svelte';
import TextareaHarness from './fixtures/TextareaHarness.svelte';
import TextFieldHarness from './fixtures/TextFieldHarness.svelte';
import TicketHarness from './fixtures/TicketHarness.svelte';

// Every field calls onchange with its value, typed as `value` is, once the user has changed it:
// a text when they leave the field, a number when it is committed, a choice when it is made.
// Never when the value is set from code.
describe('onchange of every field', () => {
	it('TextField: the text, when the user leaves the field after changing it', async () => {
		const onchange = vi.fn();
		const screen = await render(TextFieldHarness, { onchange });
		await page.getByRole('textbox', { name: 'Email' }).fill('ana@example.com');
		expect(onchange).not.toHaveBeenCalled();
		await userEvent.keyboard('{Tab}');
		expect(onchange).toHaveBeenCalledExactlyOnceWith('ana@example.com');
		await screen.rerender({ value: 'bo@example.com' });
		expect(onchange).toHaveBeenCalledTimes(1);
	});

	it('Textarea: the text, when the user leaves it after changing it', async () => {
		const onchange = vi.fn();
		await render(TextareaHarness, { onchange });
		await page.getByRole('textbox', { name: 'Note' }).fill('Paid twice');
		await userEvent.keyboard('{Tab}');
		expect(onchange).toHaveBeenCalledExactlyOnceWith('Paid twice');
	});

	it('NumberField: the number on leaving and on each step, null once emptied', async () => {
		const onchange = vi.fn();
		const screen = await render(NumberFieldHarness, { onchange });
		const field = page.getByRole('spinbutton', { name: 'Amount' });
		await field.fill('1234.5');
		await userEvent.keyboard('{Tab}');
		expect(onchange).toHaveBeenLastCalledWith(1234.5);
		await field.click();
		await userEvent.keyboard('{ArrowUp}');
		expect(onchange).toHaveBeenLastCalledWith(1235);
		// Leaving after a step reports nothing new.
		await userEvent.keyboard('{Tab}');
		expect(onchange).toHaveBeenCalledTimes(2);
		await field.fill('');
		await userEvent.keyboard('{Tab}');
		expect(onchange).toHaveBeenLastCalledWith(null);
		await screen.rerender({ value: 7 });
		expect(onchange).toHaveBeenCalledTimes(3);
	});

	it('PriceInput and AmountInput: the price on leaving, the quantity a share sets', async () => {
		const price = vi.fn();
		const quantity = vi.fn();
		await render(TicketHarness, {
			priceProps: { onchange: price },
			quantityProps: { onchange: quantity }
		});
		await page.getByRole('spinbutton', { name: 'Price' }).fill('10.05');
		await userEvent.keyboard('{Tab}');
		expect(price).toHaveBeenCalledExactlyOnceWith(10.05);
		await page.getByRole('button', { name: '50% of the maximum' }).click();
		expect(quantity).toHaveBeenCalledExactlyOnceWith(1100);
	});

	it('Slider: the number, as the user moves it', async () => {
		const onchange = vi.fn();
		await render(SliderHarness, { onchange });
		const slider = page.getByRole('slider', { name: 'Risk' });
		(slider.element() as HTMLInputElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		const now = Number((slider.element() as HTMLInputElement).value);
		expect(onchange).toHaveBeenCalledExactlyOnceWith(now);
	});

	it('NativeSelect: the value chosen', async () => {
		const onchange = vi.fn();
		await render(NativeSelectHarness, { onchange });
		await userEvent.selectOptions(page.getByRole('combobox', { name: 'Country' }), 'vn');
		expect(onchange).toHaveBeenCalledExactlyOnceWith('vn');
	});

	it('OtpInput: the code, when the user leaves it; oncomplete as soon as it is full', async () => {
		const onchange = vi.fn();
		const oncomplete = vi.fn();
		await render(OtpInputHarness, { onchange, oncomplete });
		await page.getByRole('textbox', { name: 'Verification code' }).fill('123456');
		expect(oncomplete).toHaveBeenCalledWith('123456');
		await userEvent.keyboard('{Tab}');
		expect(onchange).toHaveBeenCalledExactlyOnceWith('123456');
	});

	it('Chip: whether it is selected, when the user toggles it', async () => {
		const onchange = vi.fn();
		await render(ChipHarness, { selected: false, onchange });
		await page.getByTestId('chip').click();
		expect(onchange).toHaveBeenCalledExactlyOnceWith(true);
		await page.getByTestId('chip').click();
		expect(onchange).toHaveBeenLastCalledWith(false);
	});
});
