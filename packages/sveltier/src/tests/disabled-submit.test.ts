import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ComboboxHarness from './fixtures/ComboboxHarness.svelte';
import DatePickerHarness from './fixtures/DatePickerHarness.svelte';
import DateRangePickerHarness from './fixtures/DateRangePickerHarness.svelte';
import DateTimeFieldHarness from './fixtures/DateTimeFieldHarness.svelte';
import NumberFieldHarness from './fixtures/NumberFieldHarness.svelte';
import SelectHarness from './fixtures/SelectHarness.svelte';
import TimeFieldHarness from './fixtures/TimeFieldHarness.svelte';

// Runs in Node. A field that submits through a hidden input must leave the form data when it is
// disabled, as a disabled native control does; a read-only one still submits.
const FIELDS: [string, Component<Record<string, unknown>>, Record<string, unknown>][] = [
	['Select', SelectHarness as never, { value: 'eth-usdt' }],
	['Combobox', ComboboxHarness as never, { value: 'dn' }],
	['NumberField', NumberFieldHarness as never, { name: 'amount', value: 12 }],
	['DatePicker', DatePickerHarness as never, { value: '2026-10-26' }],
	['DateRangePicker', DateRangePickerHarness as never, { start: '2026-10-01', end: '2026-10-26' }],
	['TimeField', TimeFieldHarness as never, { value: '09:30' }],
	['DateTimeField', DateTimeFieldHarness as never, { value: '2026-10-26T09:30' }]
];

const hidden = (body: string) => body.match(/<input type="hidden"[^>]*>/g) ?? [];

describe('disabled fields and the form', () => {
	it.each(FIELDS)('a disabled %s does not submit its value', (_, harness, props) => {
		const inputs = hidden(render(harness, { props: { ...props, disabled: true } }).body);
		expect(inputs.length).toBeGreaterThan(0);
		for (const input of inputs) expect(input).toMatch(/\sdisabled(=""|\s|\/|>)/);
	});

	it.each(FIELDS)('a read-only %s still submits its value', (_, harness, props) => {
		const inputs = hidden(render(harness, { props: { ...props, readonly: true } }).body);
		expect(inputs.length).toBeGreaterThan(0);
		for (const input of inputs) expect(input).not.toMatch(/\sdisabled/);
	});
});
