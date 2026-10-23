import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DefaultsHarness from '../../../tests/fixtures/DefaultsHarness.svelte';

const probe = () => page.getByTestId('probe');

describe('defaults', () => {
	it('uses built-in values without a provider', async () => {
		await render(DefaultsHarness);
		await expect.element(probe()).toHaveTextContent('md|flat|default|initial');
	});

	it('resolves props over component defaults over global defaults', async () => {
		const outer = { global: { size: 'lg', density: 'compact' }, Probe: { size: 'sm' } } as const;
		const screen = await render(DefaultsHarness, { outer });
		await expect.element(probe()).toHaveTextContent('sm|flat|compact|initial');

		await screen.rerender({ outer, probe: { size: 'xl' } });
		await expect.element(probe()).toHaveTextContent('xl|flat|compact|initial');
	});

	it('follows provider and prop changes, and falls back when a prop is removed', async () => {
		const screen = await render(DefaultsHarness, { outer: { global: { variant: 'tonal' } } });
		await expect.element(probe()).toHaveTextContent('md|tonal|default|initial');

		await screen.rerender({ outer: { global: { variant: 'outlined' } } });
		await expect.element(probe()).toHaveTextContent('md|outlined|default|initial');

		await screen.rerender({
			outer: { global: { variant: 'outlined' } },
			probe: { variant: 'text' }
		});
		await expect.element(probe()).toHaveTextContent('md|text|default|initial');

		await screen.rerender({ outer: { global: { variant: 'outlined' } }, probe: {} });
		await expect.element(probe()).toHaveTextContent('md|outlined|default|initial');
	});

	it('merges nested providers key by key', async () => {
		await render(DefaultsHarness, {
			outer: { global: { density: 'compact' }, Probe: { size: 'sm', variant: 'tonal' } },
			inner: { Probe: { size: 'lg' } }
		});
		await expect.element(probe()).toHaveTextContent('lg|tonal|compact|initial');
	});

	it('never leaks undeclared global defaults to the element', async () => {
		await render(DefaultsHarness, { outer: { global: { color: 'error', disabled: true } } });
		const element = probe().element();
		await expect.element(probe()).toHaveTextContent('md|flat|default|initial');
		expect(element.hasAttribute('color')).toBe(false);
		expect(element.hasAttribute('disabled')).toBe(false);
	});

	it('leaves $bindable props working', async () => {
		await render(DefaultsHarness, { outer: { global: { size: 'sm' } } });
		await userEvent.click(page.getByRole('button', { name: 'change' }));
		await expect.element(probe()).toHaveTextContent('sm|flat|default|changed');
		await expect.element(page.getByTestId('parent-value')).toHaveTextContent('changed');
	});
});
