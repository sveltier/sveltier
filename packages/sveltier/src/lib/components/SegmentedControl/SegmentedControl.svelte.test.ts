import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SegmentedHarness from '../../../tests/fixtures/SegmentedHarness.svelte';
import SegmentedOwnedHarness from '../../../tests/fixtures/SegmentedOwnedHarness.svelte';

const group = () => page.getByRole('radiogroup', { name: 'Chart range' });
const option = (name: string) => group().getByRole('radio', { name, exact: true });
const text = (id: string) => page.getByTestId(id).element().textContent;
const thumb = () => page.getByTestId('control').element().querySelector('.sv-segmented__thumb')!;

describe('SegmentedControl', () => {
	it('is a radio group with one tab stop, on the checked option', async () => {
		await render(SegmentedHarness, {});
		await expect.element(option('1M')).toHaveAttribute('aria-checked', 'true');
		expect(group().element().querySelectorAll('[tabindex="0"]')).toHaveLength(1);
		expect((option('1M').element() as HTMLElement).tabIndex).toBe(0);
	});

	it('passes an option its attributes, keeping its role and state', async () => {
		await render(SegmentedHarness, {});
		const all = page.getByRole('radio', { name: 'All time' });
		await expect.element(all).toHaveAttribute('title', 'Since listing');
		await expect.element(all).toHaveAttribute('aria-checked', 'false');
		await expect.element(all).toHaveClass('sv-segmented__option');
	});

	it('picks an option on click, and reports it', async () => {
		await render(SegmentedHarness, {});
		await option('1W').click();
		await expect.element(option('1W')).toHaveAttribute('aria-checked', 'true');
		expect(text('value')).toBe('1W');
		expect(text('changed')).toBe('1W');
	});

	it('moves and picks with the arrow keys, skipping disabled options', async () => {
		await render(SegmentedHarness, { disabledYear: true });
		(option('1M').element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(text('value')).toBe('All');
		await userEvent.keyboard('{Home}');
		expect(text('value')).toBe('1D');
		await userEvent.keyboard('{ArrowLeft}');
		expect(text('value')).toBe('All');
	});

	it('follows the writing direction with the arrows', async () => {
		await render(SegmentedHarness, { dir: 'rtl' });
		(option('1M').element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(text('value')).toBe('1Y');
	});

	it('slides the thumb under the checked option, in either direction', async () => {
		const screen = await render(SegmentedHarness, {});
		const aligned = () => {
			const a = thumb().getBoundingClientRect();
			const b = option(text('value')!).element().getBoundingClientRect();
			return Math.abs(a.left - b.left) < 1 && Math.abs(a.width - b.width) < 1;
		};
		await expect.poll(aligned).toBe(true);
		await option('1D').click();
		await expect.poll(aligned).toBe(true);
		await screen.rerender({ dir: 'rtl' });
		await expect.poll(aligned).toBe(true);
	});

	it('wraps onto more lines in a narrow box, painting the checked option in place', async () => {
		await render(SegmentedHarness, { wrap: true });
		const control = page.getByTestId('control').element();
		expect(control.getBoundingClientRect().width).toBeLessThanOrEqual(160);
		const tops = new Set(
			[...control.querySelectorAll('[role="radio"]')].map((radio) =>
				Math.round(radio.getBoundingClientRect().top)
			)
		);
		expect(tops.size).toBeGreaterThan(1);
		expect(control.querySelector('.sv-segmented__thumb')).toBeNull();
		const checked = getComputedStyle(option('1M').element()).backgroundColor;
		expect(checked).not.toBe(getComputedStyle(option('1D').element()).backgroundColor);
		// Every arrow moves, as the options sit in rows.
		(option('1M').element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowDown}');
		expect(text('value')).toBe('1Y');
		await userEvent.keyboard('{ArrowUp}');
		expect(text('value')).toBe('1M');
	});
	describe('whose value the app owns', () => {
		const language = (name: string) =>
			page.getByRole('radiogroup', { name: 'Language' }).getByRole('radio', { name });

		it('with manual activation, moves with the arrows and picks on Enter', async () => {
			await render(SegmentedOwnedHarness, {});
			(language('EN · English').element() as HTMLElement).focus();
			await userEvent.keyboard('{ArrowRight}');
			await expect.element(language('VI · Tiếng Việt')).toHaveFocus();
			await expect.element(language('EN · English')).toHaveAttribute('aria-checked', 'true');
			expect(text('asked')).toBe('');
			await userEvent.keyboard('{Enter}');
			expect(text('asked')).toBe('vi');
		});

		it('checks only the value the app gives, through a getter and setter binding', async () => {
			await render(SegmentedOwnedHarness, { activation: 'automatic' });
			await language('VI · Tiếng Việt').click();
			expect(text('asked')).toBe('vi');
			// The app has not changed its value, so the check stays where the app put it.
			await expect.element(language('EN · English')).toHaveAttribute('aria-checked', 'true');
			await expect.element(language('VI · Tiếng Việt')).toHaveAttribute('aria-checked', 'false');
			await page.getByRole('button', { name: 'Apply' }).click();
			await expect.element(language('VI · Tiếng Việt')).toHaveAttribute('aria-checked', 'true');
		});
	});
});

describe('SegmentedControl option tooltips', () => {
	const radio = (name: string) => page.getByRole('radio', { name });
	const tip = (name: string) => page.getByRole('tooltip').filter({ hasText: name });

	it('shows an option tooltip on keyboard focus, as its description', async () => {
		await render(SegmentedOwnedHarness, {});
		await userEvent.keyboard('{Tab}');
		await expect.element(radio('EN · English')).toHaveFocus();
		await expect.element(tip('English')).toBeVisible();
		const ids = radio('EN · English').element().getAttribute('aria-describedby')!.split(' ');
		// The tooltip adds to the option's own description instead of replacing it.
		const english = tip('English').element();
		expect(ids).toContain(english.id);
		expect(ids).toContain('language-note');
		await expect.element(radio('EN · English')).toHaveAccessibleName('EN · English');

		await userEvent.keyboard('{ArrowRight}');
		await expect.element(radio('VI · Tiếng Việt')).toHaveFocus();
		await expect.element(tip('Tiếng Việt')).toBeVisible();
		expect(english.matches(':popover-open')).toBe(false);
		await expect.element(radio('VI · Tiếng Việt')).toHaveAccessibleDescription('Tiếng Việt');
	});

	it('shows it on hover, and keeps the radios one group with one tab stop', async () => {
		await render(SegmentedOwnedHarness, {});
		await radio('VI · Tiếng Việt').hover();
		await expect.element(tip('Tiếng Việt')).toBeVisible();
		const group = page.getByRole('radiogroup', { name: 'Language' }).element();
		expect(group.querySelectorAll('[role="radio"]')).toHaveLength(2);
		expect(group.querySelectorAll('[role="radio"][tabindex="0"]')).toHaveLength(1);
	});
});
