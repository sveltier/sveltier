import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TreeHarness from '../../../tests/fixtures/TreeHarness.svelte';
import ItemIconsHarness from '../../../tests/fixtures/ItemIconsHarness.svelte';

const node = (name: string) => page.getByRole('treeitem', { name, exact: true });
const shown = (testId: string) => page.getByTestId(testId);
const names = () =>
	page
		.getByRole('treeitem')
		.elements()
		.map((element) => element.querySelector('.sv-tree__label')?.textContent);

// Tab into the tree from the button before it.
async function enter() {
	await page.getByRole('button', { name: 'Before' }).click();
	await userEvent.keyboard('{Tab}');
}

describe('Tree', () => {
	it('shows the top level as a named tree, with levels, sizes and places', async () => {
		await render(TreeHarness);
		await expect.element(page.getByRole('tree', { name: 'Watchlists' })).toBeVisible();
		expect(names()).toEqual(['Crypto', 'FX', 'Archived', 'Empty']);
		const crypto = node('Crypto');
		await expect.element(crypto).toHaveAttribute('aria-expanded', 'false');
		await expect.element(crypto).toHaveAttribute('aria-level', '1');
		await expect.element(crypto).toHaveAttribute('aria-setsize', '4');
		await expect.element(node('FX')).toHaveAttribute('aria-posinset', '2');
		await expect.element(node('Archived')).not.toHaveAttribute('aria-expanded');
		await expect.element(node('Archived')).toHaveAttribute('aria-disabled', 'true');
	});

	it('takes one tab stop, on the first node, and moves with the arrows without selecting', async () => {
		await render(TreeHarness);
		await enter();
		await expect.element(node('Crypto')).toHaveFocus();
		expect(
			page
				.getByRole('treeitem')
				.elements()
				.filter((e) => e.tabIndex === 0)
		).toHaveLength(1);
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(node('FX')).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(node('Empty')).toHaveFocus();
		await userEvent.keyboard('{Home}');
		await expect.element(node('Crypto')).toHaveFocus();
		await expect.element(shown('value')).toHaveTextContent('');
	});

	it('opens and closes with Right and Left, and moves to children and parents', async () => {
		await render(TreeHarness);
		await enter();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(node('Crypto')).toHaveAttribute('aria-expanded', 'true');
		await expect.element(node('Crypto')).toHaveFocus();
		await expect.element(shown('expanded')).toHaveTextContent('crypto');
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(node('BTC/USDT')).toHaveFocus();
		await expect.element(node('BTC/USDT')).toHaveAttribute('aria-level', '2');
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(node('Crypto')).toHaveFocus();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(node('Crypto')).toHaveAttribute('aria-expanded', 'false');
		await expect.element(node('BTC/USDT')).not.toBeInTheDocument();
		// An open parent with no children stays put on Right.
		await userEvent.keyboard('{End}{ArrowRight}{ArrowRight}');
		await expect.element(node('Empty')).toHaveFocus();
		await expect.element(node('Empty')).toHaveAttribute('aria-expanded', 'true');
	});

	it('swaps Right and Left in right-to-left text', async () => {
		await render(TreeHarness, { dir: 'rtl' });
		await enter();
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(node('Crypto')).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(node('Crypto')).toHaveAttribute('aria-expanded', 'false');
	});

	it('selects with Enter, Space or a click, and not a disabled node', async () => {
		await render(TreeHarness, { expanded: ['crypto'] });
		await enter();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect.element(shown('value')).toHaveTextContent('btc');
		await expect.element(node('BTC/USDT')).toHaveAttribute('aria-selected', 'true');
		await expect.element(node('Crypto')).toHaveAttribute('aria-selected', 'false');
		await userEvent.keyboard('{ArrowDown}{ }');
		await expect.element(shown('chosen')).toHaveTextContent('ETH/USDT');
		await node('FX').click();
		await expect.element(shown('value')).toHaveTextContent('fx');
		// A row click selects without opening.
		await expect.element(node('FX')).toHaveAttribute('aria-expanded', 'false');
		await node('Archived').click({ force: true });
		await expect.element(shown('value')).toHaveTextContent('fx');
		await expect.element(node('Archived')).toHaveFocus();
	});

	it('opens and closes a parent from its chevron', async () => {
		await render(TreeHarness);
		const chevron = () =>
			node('FX').element().querySelector<HTMLElement>(':scope > .sv-tree__row > .sv-tree__toggle')!;
		chevron().click();
		await expect.element(node('EUR/USD')).toBeVisible();
		chevron().click();
		await expect.element(node('EUR/USD')).not.toBeInTheDocument();
		await expect.element(shown('value')).toHaveTextContent('');
	});

	it('moves focus to a parent closed with the focus inside it', async () => {
		await render(TreeHarness, { expanded: ['crypto', 'alts'] });
		await node('SOL/USDT').click();
		await expect.element(node('SOL/USDT')).toHaveFocus();
		node('Crypto')
			.element()
			.querySelector<HTMLElement>(':scope > .sv-tree__row > .sv-tree__toggle')!
			.click();
		await expect.element(node('Crypto')).toHaveFocus();
		await expect.element(node('Crypto')).toHaveAttribute('tabindex', '0');
	});

	it('returns to the selected node when tabbing back in', async () => {
		await render(TreeHarness, { value: 'eurusd', expanded: ['fx'] });
		await enter();
		await expect.element(node('EUR/USD')).toHaveFocus();
	});

	it('opens the siblings with *, and moves by typed letters', async () => {
		await render(TreeHarness);
		await enter();
		await userEvent.keyboard('*');
		await expect.element(shown('expanded')).toHaveTextContent('crypto,fx,empty');
		await expect.element(node('Altcoins')).toHaveAttribute('aria-expanded', 'false');
		await userEvent.keyboard('e');
		await expect.element(node('ETH/USDT')).toHaveFocus();
		await userEvent.keyboard('e');
		await expect.element(node('EUR/USD')).toHaveFocus();
	});
});

describe('Tree icons', () => {
	it('draws an icon component of another set in the box of a path icon, hidden from assistive technology', async () => {
		await render(ItemIconsHarness, { kind: 'tree' });
		const glyph = page.getByTestId('glyph');
		await expect.element(glyph).toBeVisible();
		await expect.element(page.getByRole('treeitem', { name: 'Glyph' })).toBeVisible();
		const path = page
			.getByRole('treeitem', { name: 'Path' })
			.element()
			.querySelector('svg')!
			.getBoundingClientRect();
		const box = glyph.element().getBoundingClientRect();
		// The component draws itself at 32px; the list sizes it like its other icons.
		expect(box.width).not.toBe(32);
		expect(box.width).toBeCloseTo(path.width, 1);
		expect(box.height).toBeCloseTo(path.height, 1);
		expect(glyph.element().closest('[aria-hidden="true"]')).not.toBeNull();
	});
});
