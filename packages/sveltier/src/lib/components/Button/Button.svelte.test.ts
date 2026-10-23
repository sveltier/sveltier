import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ButtonHarness from '../../../tests/fixtures/ButtonHarness.svelte';

const button = () => page.getByTestId('button');
const element = () => button().element() as HTMLElement;
const style = (pseudo?: string) => getComputedStyle(element(), pseudo);
const px = (value: string) => Number.parseFloat(value);
const PX_PER_REM = 16;

/** How the page paints `value` as a background, for comparing serialised colours. */
function paint(value: string): string {
	const probe = document.createElement('div');
	probe.style.backgroundColor = value;
	element().append(probe);
	const painted = getComputedStyle(probe).backgroundColor;
	probe.remove();
	return painted;
}

describe('Button', () => {
	it('is a button that does not submit its form', async () => {
		const onsubmit = vi.fn();
		await render(ButtonHarness, { inForm: true, onsubmit });
		expect(element().tagName).toBe('BUTTON');
		expect(element().getAttribute('type')).toBe('button');
		await button().click();
		expect(onsubmit).not.toHaveBeenCalled();
	});

	it('submits its form when it is a submit button', async () => {
		const onsubmit = vi.fn();
		await render(ButtonHarness, { inForm: true, onsubmit, type: 'submit' });
		await button().click();
		expect(onsubmit).toHaveBeenCalledOnce();
	});

	it('is pressed by click, Enter and Space', async () => {
		const onclick = vi.fn();
		await render(ButtonHarness, { onclick });
		await button().click();
		element().focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard('[Space]');
		expect(onclick).toHaveBeenCalledTimes(3);
	});

	it('cannot be focused or pressed when disabled', async () => {
		const onclick = vi.fn();
		await render(ButtonHarness, { onclick, disabled: true, inForm: true });
		expect(element().hasAttribute('disabled')).toBe(true);
		element().click();
		expect(onclick).not.toHaveBeenCalled();
		page.getByRole('textbox', { name: 'Amount' }).element().focus();
		await userEvent.keyboard('{Tab}');
		expect(document.activeElement).not.toBe(element());
	});

	it('keeps focus and ignores presses while loading, and says it is loading', async () => {
		const onclick = vi.fn();
		const onsubmit = vi.fn();
		await render(ButtonHarness, { onclick, onsubmit, loading: true, inForm: true, type: 'submit' });
		expect(element().hasAttribute('disabled')).toBe(false);
		expect(element().getAttribute('aria-disabled')).toBe('true');
		await expect.element(button()).toHaveAccessibleName('Pay now Loading');
		element().focus();
		expect(document.activeElement).toBe(element());
		element().click();
		await userEvent.keyboard('{Enter}');
		expect(onclick).not.toHaveBeenCalled();
		expect(onsubmit).not.toHaveBeenCalled();
	});

	it('keeps the width of its label while loading', async () => {
		const screen = await render(ButtonHarness, {});
		const width = element().getBoundingClientRect().width;
		await screen.rerender({ loading: true });
		expect(element().getBoundingClientRect().width).toBeCloseTo(width, 1);
		expect(element().querySelector('.sv-button__loader')?.getAttribute('aria-hidden')).toBe('true');
	});

	it('ignores presses when aria-disabled, and stays focusable', async () => {
		const onclick = vi.fn();
		await render(ButtonHarness, { onclick, 'aria-disabled': 'true' });
		element().focus();
		expect(document.activeElement).toBe(element());
		element().click();
		expect(onclick).not.toHaveBeenCalled();
	});

	it('is a link when given href', async () => {
		await render(ButtonHarness, { href: '/pay' });
		expect(element().tagName).toBe('A');
		expect(element().getAttribute('href')).toBe('/pay');
		// Button-only attributes stay off the link, even as "false".
		expect(element().hasAttribute('type')).toBe(false);
		expect(element().hasAttribute('disabled')).toBe(false);
		await expect.element(page.getByRole('link', { name: 'Pay now' })).toBeVisible();
		await expect.element(page.getByTestId('ref')).toHaveTextContent('A');
	});

	it('is a link that goes nowhere when disabled', async () => {
		const onclick = vi.fn();
		await render(ButtonHarness, { href: '/pay', disabled: true, onclick });
		expect(element().hasAttribute('href')).toBe(false);
		expect(element().getAttribute('role')).toBe('link');
		expect(element().getAttribute('aria-disabled')).toBe('true');
		element().click();
		expect(onclick).not.toHaveBeenCalled();
	});

	it('is the element `as` names', async () => {
		await render(ButtonHarness, { as: 'button', href: '/pay' });
		expect(element().tagName).toBe('BUTTON');
		expect(element().hasAttribute('href')).toBe(false);
		await expect.element(page.getByTestId('ref')).toHaveTextContent('BUTTON');
	});

	it('passes other attributes and classes through', async () => {
		await render(ButtonHarness, {
			id: 'pay',
			title: 'Pay the invoice',
			class: ['cta', { wide: true }],
			'data-kind': 'primary'
		});
		expect(element().id).toBe('pay');
		expect(element().title).toBe('Pay the invoice');
		expect(element().dataset.kind).toBe('primary');
		expect(element().className).toMatch(/^sv-button .* cta wide$/);
	});
});

describe('Button shared props', () => {
	it('has a class for every shared prop, defaults included', async () => {
		await render(ButtonHarness, {});
		expect([...element().classList]).toEqual(
			expect.arrayContaining([
				'sv-variant-flat',
				'sv-density-default',
				'sv-size-md',
				'sv-color-primary',
				'sv-rounded'
			])
		);
	});

	it('takes defaults from the nearest provider, and props win', async () => {
		await render(ButtonHarness, {
			variant: 'text',
			defaults: { global: { density: 'compact' }, Button: { variant: 'tonal', size: 'sm' } }
		});
		expect([...element().classList]).toEqual(
			expect.arrayContaining(['sv-variant-text', 'sv-size-sm', 'sv-density-compact'])
		);
	});

	it('is disabled by a provider for a whole section', async () => {
		await render(ButtonHarness, { defaults: { global: { disabled: true } } });
		expect(element().hasAttribute('disabled')).toBe(true);
	});

	it('paints the variant in the colour', async () => {
		await render(ButtonHarness, {});
		expect(style().backgroundColor).toBe(paint('var(--sv-color-primary)'));
		expect(style().color).toBe(paint('var(--sv-on-primary)'));
	});
});

describe('Button layout', () => {
	it('is as tall as its size and density, with golden padding', async () => {
		const screen = await render(ButtonHarness, {});
		const height = 2.618 * PX_PER_REM;
		expect(px(style().height)).toBeCloseTo(height, 1);
		expect(px(style().paddingInlineStart)).toBeCloseTo(height * 0.382, 1);
		await screen.rerender({ density: 'compact' });
		expect(px(style().height)).toBeCloseTo(height * 0.8867, 1);
	});

	it('is square with an icon only', async () => {
		await render(ButtonHarness, { icon: true, 'aria-label': 'Next' });
		const box = element().getBoundingClientRect();
		expect(box.width).toBeCloseTo(box.height, 1);
		await expect.element(button()).toHaveAccessibleName('Next');
	});

	it('sizes icons at φ^½ of the text', async () => {
		await render(ButtonHarness, { withPrepend: true, withAppend: true });
		const icons = element().querySelectorAll('svg');
		expect(icons).toHaveLength(2);
		const text = px(style().fontSize);
		for (const icon of icons) {
			expect(icon.getBoundingClientRect().width).toBeCloseTo(text * 1.272, 0);
		}
	});

	it('fills its container when block', async () => {
		await render(ButtonHarness, { block: true });
		const container = element().parentElement!.getBoundingClientRect();
		expect(element().getBoundingClientRect().width).toBeCloseTo(container.width, 1);
	});
});

describe('Button states', () => {
	it('shows hover on a state layer, and none for plain', async () => {
		const screen = await render(ButtonHarness, {});
		await button().hover();
		await expect.poll(() => style('::before').opacity).toBe('0.08');
		await screen.rerender({ variant: 'plain' });
		await expect.poll(() => style('::before').opacity).toBe('0');
	});

	it('is muted when disabled but not when loading', async () => {
		const screen = await render(ButtonHarness, { disabled: true });
		expect(style().opacity).toBe('0.382');
		await screen.rerender({ disabled: false, loading: true });
		expect(style().opacity).toBe('1');
	});
});
