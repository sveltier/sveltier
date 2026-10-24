import { afterAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ButtonHarness from './fixtures/ButtonHarness.svelte';
import CheckboxHarness from './fixtures/CheckboxHarness.svelte';
import NumberFieldHarness from './fixtures/NumberFieldHarness.svelte';
import TextFieldHarness from './fixtures/TextFieldHarness.svelte';

// Tests resolve #dev to the development checks, as an app's dev server does. Each message is
// logged once per page, so every case here uses its own message.
const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
const logged = () => warn.mock.calls.flat().join('\n');
afterAll(() => warn.mockRestore());

describe('development checks in components', () => {
	it('name the intent when a colour is given as the variant', async () => {
		await render(ButtonHarness, { variant: 'primary' as never });
		expect(logged()).toContain(
			`[sveltier SV2002] <Button> got variant="primary". Valid values: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'. To colour it, use color="primary". https://sveltier.com/errors#SV2002`
		);
	});

	it('check a field variant against the variants fields take', async () => {
		await render(TextFieldHarness, { variant: 'flat' as never });
		expect(logged()).toContain(
			`<Field> got variant="flat". Valid values: 'outlined' | 'tonal' | 'elevated' | 'text' | 'plain'.`
		);
	});

	it('point a currency format of a number field to prepend', async () => {
		await render(NumberFieldHarness, { format: { style: 'currency', currency: 'USD' } });
		expect(logged()).toContain(
			`<NumberField> got format.style="currency". Valid values: 'decimal'. Put a currency or a unit in prepend or append.`
		);
	});

	it('warn about a field without an accessible name, and not about a labelled one', async () => {
		await render(TextFieldHarness);
		expect(logged()).not.toContain('SV5001');
		await render(TextFieldHarness, { label: undefined });
		await expect.poll(logged).toContain('[sveltier SV5001] <TextField> has no accessible name.');
	});

	it('warn about a checkbox whose label holds no text, though the label element is there', async () => {
		await render(CheckboxHarness);
		expect(logged()).not.toContain('<Checkbox> has no accessible name');
		await render(CheckboxHarness, { label: undefined });
		await expect.poll(logged).toContain('[sveltier SV5001] <Checkbox> has no accessible name.');
	});
});
