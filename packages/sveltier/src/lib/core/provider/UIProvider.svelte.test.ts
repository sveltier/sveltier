import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import UIHarness from '../../../tests/fixtures/UIHarness.svelte';

const probe = () => page.getByTestId('ui');

describe('UIProvider', () => {
	const original = { width: 0, height: 0 };
	beforeAll(() => {
		original.width = window.innerWidth;
		original.height = window.innerHeight;
	});
	afterAll(async () => {
		await page.viewport(original.width, original.height);
	});

	it('provides theme, defaults, display and locale to everything below it', async () => {
		await page.viewport(1300, 800);
		await render(UIHarness, {
			theme: 'monolith-dark',
			defaults: { global: { size: 'sm' } },
			locale: { currency: 'JPY' }
		});
		await expect.element(probe()).toHaveTextContent('monolith-dark|sm|lg|¥5|Close');
		expect(document.documentElement.getAttribute('data-sv-theme')).toBe('monolith-dark');
	});

	it('applies locale changes at once', async () => {
		const screen = await render(UIHarness, { theme: 'monolith-dark', locale: { currency: 'USD' } });
		await expect.element(probe()).toMatchTextContent('|$5.00|');
		await screen.rerender({ theme: 'monolith-dark', locale: { currency: 'EUR' } });
		await expect.element(probe()).toMatchTextContent('|€5.00|');
	});

	it('uses its display options for every useDisplay below it', async () => {
		await page.viewport(1000, 800);
		await render(UIHarness, { theme: 'monolith-dark', display: { thresholds: { md: 1024 } } });
		await expect.element(probe()).toHaveTextContent('monolith-dark|md|sm|$5.00|Close');
	});
});
