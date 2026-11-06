import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import LedgerHarness from '../../../tests/fixtures/LedgerHarness.svelte';

const receipt = () => page.getByRole('region', { name: 'Transfer sent' });
const row = (testId: string) => page.getByTestId(testId).element() as HTMLElement;
const part = (element: Element, selector: string) => element.querySelector(selector) as HTMLElement;

afterEach(() => vi.restoreAllMocks());

describe('Ledger and LedgerRow', () => {
	it('pairs each label with its figure in a description list', async () => {
		await render(LedgerHarness);
		const list = receipt().element().querySelector('dl')!;
		const terms = [...list.querySelectorAll(':scope > div > dt')].map((dt) => dt.textContent);
		const values = [...list.querySelectorAll(':scope > div > dd')].map((dd) =>
			dd.textContent?.trim()
		);
		expect(terms).toEqual(['Amount', 'Fee', 'Arrives', 'Total']);
		expect(values).toEqual(['$1,000.00', '$2.50', 'Today', '$1,002.50']);
		await expect.element(page.getByRole('term').first()).toHaveTextContent('Amount');
	});

	it('runs a dotted leader from the label to the figure, at the end of the row', async () => {
		await render(LedgerHarness);
		const fee = page.getByText('Fee').element().parentElement!;
		const leader = getComputedStyle(part(fee, 'dt'), '::after');
		expect(leader.borderBottomStyle).toBe('dotted');
		expect(Number.parseFloat(leader.width)).toBeGreaterThan(20);
		const value = part(fee, 'dd').getBoundingClientRect();
		expect(Math.abs(value.right - fee.getBoundingClientRect().right)).toBeLessThan(1);
	});

	it('wraps a long label and keeps the figure on one line', async () => {
		await render(LedgerHarness);
		const label = part(row('row'), 'dt');
		const value = part(row('row'), 'dd');
		const lineHeight = Number.parseFloat(getComputedStyle(label).lineHeight);
		expect(label.getBoundingClientRect().height).toBeGreaterThan(lineHeight * 1.5);
		expect(value.getBoundingClientRect().height).toBeLessThan(lineHeight * 1.5);
	});

	it('rules off the total with a double rule and a heavier figure', async () => {
		await render(LedgerHarness);
		const total = getComputedStyle(row('total'));
		expect(total.borderTopStyle).toBe('double');
		const fee = page.getByText('$2.50').element().closest('dd')!;
		const sum = part(row('total'), 'dd');
		expect(Number(getComputedStyle(sum).fontWeight)).toBeGreaterThan(
			Number(getComputedStyle(fee).fontWeight)
		);
	});

	it("hides the figures with Amount's masked default", async () => {
		await render(LedgerHarness, { defaults: { Amount: { masked: true } } });
		expect(part(row('total'), 'dd').textContent).toContain('••••');
		expect(receipt().element().textContent).not.toContain('1,002.50');
	});

	it('spaces the rows by density', async () => {
		await render(LedgerHarness);
		const gap = (testId: string) => Number.parseFloat(getComputedStyle(row(testId)).rowGap);
		expect(gap('ledger')).toBeLessThan(
			Number.parseFloat(getComputedStyle(receipt().element().querySelector('dl')!).rowGap)
		);
	});

	it('warns in development about a row outside a list', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await render(LedgerHarness, { stray: true });
		await expect
			.poll(() => warn.mock.calls.flat().join(' '))
			.toContain('[sveltier SV4006] <LedgerRow> is not inside a <dl>');
		expect(warn).toHaveBeenCalledTimes(1);
	});
});

describe('Receipt', () => {
	it('is a section named by its title, with a subtitle and a footer', async () => {
		await render(LedgerHarness);
		await expect.element(receipt()).toBeVisible();
		await expect.element(page.getByText('Ref. TX-0042')).toBeVisible();
		await expect.element(page.getByTestId('footer')).toBeVisible();
		expect(receipt().element().querySelector('footer')).not.toBeNull();
	});

	it('makes the title a heading of its level', async () => {
		const screen = await render(LedgerHarness);
		expect(page.getByRole('heading').elements()).toHaveLength(0);
		await screen.rerender({ level: 2 });
		await expect
			.element(page.getByRole('heading', { level: 2, name: 'Transfer sent' }))
			.toBeVisible();
	});
});
