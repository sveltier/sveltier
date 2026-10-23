import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DividerHarness from '../../../tests/fixtures/DividerHarness.svelte';

const divider = (id: string) => page.getByTestId(id).element() as HTMLElement;

describe('Divider', () => {
	it('is a separator one hairline thick, across its container', async () => {
		await render(DividerHarness);
		const hr = divider('horizontal');
		expect(hr.tagName).toBe('HR');
		await expect.element(page.getByRole('separator').first()).toBeVisible();
		const box = hr.getBoundingClientRect();
		expect(box.width).toBe(300);
		expect(box.height).toBe(1);
		expect(hr.className).toBe('sv-divider extra');
	});

	it('runs top to bottom when vertical, as tall as its row', async () => {
		await render(DividerHarness);
		const hr = divider('vertical');
		expect(hr.getAttribute('aria-orientation')).toBe('vertical');
		const box = hr.getBoundingClientRect();
		expect(box.width).toBe(1);
		expect(box.height).toBe(40);
	});

	it('is painted in the border colour of the theme', async () => {
		await render(DividerHarness);
		const probe = document.createElement('span');
		probe.style.color = 'var(--sv-color-border)';
		divider('horizontal').parentElement!.append(probe);
		expect(getComputedStyle(divider('horizontal')).borderTopColor).toBe(
			getComputedStyle(probe).color
		);
		probe.remove();
	});
});
