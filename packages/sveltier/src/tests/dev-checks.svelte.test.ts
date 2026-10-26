import { afterAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AppLayoutHarness from './fixtures/AppLayoutHarness.svelte';
import ButtonHarness from './fixtures/ButtonHarness.svelte';
import CheckboxHarness from './fixtures/CheckboxHarness.svelte';
import NumberFieldHarness from './fixtures/NumberFieldHarness.svelte';
import SelectHarness from './fixtures/SelectHarness.svelte';
import TableHarness from './fixtures/TableHarness.svelte';
import TextFieldHarness from './fixtures/TextFieldHarness.svelte';
import TooltipHarness from './fixtures/TooltipHarness.svelte';

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

	it('warn about a tooltip on a control without a name, and not on a named one', async () => {
		await render(TooltipHarness, { iconOnly: true });
		expect(logged()).not.toContain('SV4002');
		await render(TooltipHarness, { iconOnly: true, label: '' });
		await expect
			.poll(logged)
			.toContain('[sveltier SV4002] <Tooltip> describes a control that has no accessible name.');
	});

	it('warn about a layout part wrapped in another element, and not about direct children', async () => {
		await render(AppLayoutHarness);
		expect(logged()).not.toContain('SV4004');
		await render(AppLayoutHarness, { wrapMain: true });
		await expect
			.poll(logged)
			.toContain(
				"[sveltier SV4004] <Main> is not directly inside <AppLayout>, so the layout's grid cannot place it."
			);
		expect(logged()).not.toContain('<AppBar> is not directly inside');
	});

	it('warn about a table without a name, and not about one with a caption', async () => {
		await render(TableHarness);
		expect(logged()).not.toContain('<Table> has no accessible name');
		await render(TableHarness, { caption: undefined });
		await expect
			.poll(logged)
			.toContain(
				'[sveltier SV5001] <Table> has no accessible name. Give it a caption, or name it with aria-label or aria-labelledby.'
			);
	});

	it('warn about two table columns with the same key', async () => {
		await render(TableHarness, {
			columns: [
				{ key: 'price', label: 'Price' },
				{ key: 'price', label: 'Price again' }
			]
		});
		await expect
			.poll(logged)
			.toContain(
				"[sveltier SV4005] <Table> has two columns with the key 'price'. Give each column its own key, or an id with a value function for a computed one."
			);
	});

	it('list the sortable columns when a table is sorted by another one', async () => {
		await render(TableHarness, { sortBy: { column: 'status', direction: 'ascending' } });
		await expect
			.poll(logged)
			.toContain(
				`<Table> got sortBy.column="status". Valid values: 'symbol' | 'quantity' | 'price' | 'value'. Sort by a column with sort.`
			);
	});
	it('warn about two select items with the same value', async () => {
		await render(SelectHarness, {
			items: [
				{ value: 'btc', label: 'BTC/USDT' },
				{ value: 'btc', label: 'BTC/USD' }
			]
		});
		await expect
			.poll(logged)
			.toContain(
				"[sveltier SV4005] <Select> has two items with the key 'btc'. Give each item its own value."
			);
	});
});
