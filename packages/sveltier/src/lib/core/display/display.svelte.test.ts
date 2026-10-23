import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DisplayHarness from '../../../tests/fixtures/DisplayHarness.svelte';
import DisplayProbe from '../../../tests/fixtures/DisplayProbe.svelte';

const probe = () => page.getByTestId('display');

describe('useDisplay', () => {
	const original = { width: 0, height: 0 };
	beforeAll(() => {
		original.width = window.innerWidth;
		original.height = window.innerHeight;
	});
	afterAll(async () => {
		await page.viewport(original.width, original.height);
	});

	it('follows the viewport across thresholds', async () => {
		await page.viewport(1300, 800);
		await render(DisplayProbe);
		await expect.element(probe()).toHaveTextContent('lg|false|true|false');

		await page.viewport(500, 800);
		await expect.element(probe()).toHaveTextContent('xs|true|false|true');

		await page.viewport(960, 800);
		await expect.element(probe()).toHaveTextContent('md|false|true|false');
	});

	it('uses the options of the provider above it', async () => {
		await page.viewport(1000, 800);
		await render(DisplayHarness, {
			options: { thresholds: { md: 1024 }, mobileBreakpoint: 'lg' }
		});
		await expect.element(probe()).toHaveTextContent('sm|true|false|true');
	});
});
