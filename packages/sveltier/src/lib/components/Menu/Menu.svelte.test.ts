import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import MenuHarness from '../../../tests/fixtures/MenuHarness.svelte';
import ItemIconsHarness from '../../../tests/fixtures/ItemIconsHarness.svelte';
import type { MenuItem } from './types.js';

const trigger = () => page.getByRole('button', { name: 'Actions' });
const menu = () => page.getByRole('menu', { name: 'Actions' });
const item = (name: string) => page.getByRole('menuitem', { name, exact: true });
const shown = (testId: string) => page.getByTestId(testId);

describe('Menu', () => {
	it('opens from its trigger as a menu named by it, with focus on the first item', async () => {
		await render(MenuHarness);
		await expect.element(trigger()).toHaveAttribute('aria-haspopup', 'menu');
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false');
		await trigger().click();
		await expect.element(menu()).toBeVisible();
		await expect.element(item('Rename F2')).toHaveFocus();
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true');
		await expect.element(trigger()).toHaveAttribute('aria-controls', menu().element().id);
	});

	it('moves with the arrow keys, wrapping and skipping disabled items', async () => {
		await render(MenuHarness);
		await trigger().click();
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Duplicate')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('PDF')).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(item('Delete')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(item('Delete')).toHaveFocus();
		await userEvent.keyboard('{Home}');
		await expect.element(item('Rename F2')).toHaveFocus();
	});

	it('opens at the first item on ArrowDown and at the last on ArrowUp', async () => {
		await render(MenuHarness);
		trigger().element().focus();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(trigger()).toHaveFocus();
		await expect.element(shown('reason')).toHaveTextContent('escape');
		await userEvent.keyboard('{ArrowUp}');
		await expect.element(item('Delete')).toHaveFocus();
	});

	it('chooses with Enter: closes, gives focus back, then reports the item', async () => {
		await render(MenuHarness);
		await trigger().click();
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{Enter}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('chosen')).toHaveTextContent('duplicate');
		await expect.element(shown('reason')).toHaveTextContent('action');
		await expect.element(trigger()).toHaveFocus();
	});

	it('moves to the item whose label starts with what is typed', async () => {
		await render(MenuHarness);
		await trigger().click();
		await userEvent.keyboard('c');
		await expect.element(item('CSV')).toHaveFocus();
		// A pause starts a new search; one letter again moves on to the next item with it.
		await new Promise((resolve) => setTimeout(resolve, 600));
		await userEvent.keyboard('d');
		await expect.element(item('Delete')).toHaveFocus();
		await userEvent.keyboard('d');
		await expect.element(item('Duplicate')).toHaveFocus();
	});

	it('names its groups by their headings, and draws separators', async () => {
		await render(MenuHarness);
		await trigger().click();
		const group = page.getByRole('group', { name: 'Export' });
		await expect.element(group).toBeVisible();
		await expect.element(group.getByRole('menuitem', { name: 'PDF' })).toBeVisible();
		await expect.element(menu().getByRole('separator')).toBeInTheDocument();
		await expect.element(item('Archive')).toBeDisabled();
	});

	it('closes on Tab, and focus moves on to what follows its trigger', async () => {
		await render(MenuHarness);
		await trigger().click();
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(page.getByRole('button', { name: 'After' })).toHaveFocus();
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('focus');
	});

	it('gives focus to the item under the pointer, and closes on a press outside', async () => {
		await render(MenuHarness);
		await trigger().click();
		await userEvent.hover(item('CSV'));
		await expect.element(item('CSV')).toHaveFocus();
		await page.getByRole('button', { name: 'Before' }).click();
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('outside');
		await expect.element(shown('chosen')).toHaveTextContent('');
	});

	it('gives focus to its first item again when opened while it is still closing', async () => {
		await render(MenuHarness);
		await trigger().click();
		await expect.element(item('Rename F2')).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await expect.element(trigger()).toHaveFocus();
		// Still on its way out: the same menu comes back, and focus goes into it again.
		(trigger().element() as HTMLElement).click();
		await expect.element(item('Rename F2')).toHaveFocus();
		await expect.element(menu()).toBeVisible();
	});
});

const CHECKABLE: MenuItem[] = [
	{ label: 'Rename', value: 'rename' },
	{ label: 'Show volume', value: 'volume', checked: true },
	{ label: 'Show grid', value: 'grid', checked: false },
	{ heading: 'Layout' },
	{ label: 'One chart', value: 'one', radio: true },
	{ label: 'Two side by side', value: 'columns', radio: true, checked: true },
	{ label: 'Four charts', value: 'four', radio: true }
];

describe('Menu checked items', () => {
	const checkbox = (name: string) => page.getByRole('menuitemcheckbox', { name, exact: true });
	const radio = (name: string) => page.getByRole('menuitemradio', { name, exact: true });
	const ticked = (element: Element) =>
		getComputedStyle(element.querySelector('.sv-menu__mark')!).visibility === 'visible';
	const labelStart = (element: Element) =>
		element.querySelector('.sv-menu__label')!.getBoundingClientRect().left;

	it('says which items are on: checkboxes, and the one radio of its group, ticked', async () => {
		await render(MenuHarness, { items: CHECKABLE });
		await trigger().click();
		await expect.element(checkbox('Show volume')).toHaveAttribute('aria-checked', 'true');
		await expect.element(checkbox('Show grid')).toHaveAttribute('aria-checked', 'false');
		await expect.element(radio('Two side by side')).toHaveAttribute('aria-checked', 'true');
		await expect.element(radio('One chart')).toHaveAttribute('aria-checked', 'false');
		const layout = page.getByRole('group', { name: 'Layout' });
		await expect.element(layout.getByRole('menuitemradio', { name: 'Four charts' })).toBeVisible();

		expect(ticked(checkbox('Show volume').element())).toBe(true);
		expect(ticked(radio('Two side by side').element())).toBe(true);
		expect(ticked(checkbox('Show grid').element())).toBe(false);
		expect(ticked(radio('One chart').element())).toBe(false);
		expect(ticked(item('Rename').element())).toBe(false);
	});

	it('lines up the labels of every item, plain ones too, once one can be checked', async () => {
		await render(MenuHarness, { items: CHECKABLE });
		await trigger().click();
		const plain = labelStart(item('Rename').element());
		expect(labelStart(checkbox('Show volume').element())).toBeCloseTo(plain, 0);
		expect(labelStart(checkbox('Show grid').element())).toBeCloseTo(plain, 0);
		expect(labelStart(radio('One chart').element())).toBeCloseTo(plain, 0);
	});

	it('moves and chooses as any item: closes and reports it, its state left to the app', async () => {
		await render(MenuHarness, { items: CHECKABLE });
		await trigger().click();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(checkbox('Show volume')).toHaveFocus();
		await userEvent.keyboard('{End}');
		await expect.element(radio('Four charts')).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('chosen')).toHaveTextContent('four');
		await trigger().click();
		await expect.element(radio('Two side by side')).toHaveAttribute('aria-checked', 'true');
	});

	it('keeps a plain menu without a slot for marks', async () => {
		await render(MenuHarness);
		await trigger().click();
		await expect.element(item('Duplicate')).toBeVisible();
		const mark = item('Duplicate').element().querySelector('.sv-menu__mark')!;
		expect(getComputedStyle(mark).display).toBe('none');
	});
});

describe('Menu radios that are not one choice', () => {
	const warned = (warn: { mock: { calls: unknown[][] } }, pattern: RegExp) =>
		warn.mock.calls.some(([text]) => pattern.test(String(text)));

	it('warns in development when a group mixes radios with other items', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await render(MenuHarness, {
			items: [{ label: 'One chart', radio: true, checked: true }, { label: 'Reset layout' }]
		});
		await expect
			.poll(() => warned(warn, /SV4009.*'One chart'.*also has items that are not radios/))
			.toBe(true);
		warn.mockRestore();
	});

	it('warns in development when a group checks more than one radio, not when it checks none', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const first = await render(MenuHarness, {
			items: [
				{ label: 'Grid A', radio: true },
				{ label: 'Grid B', radio: true }
			]
		});
		await expect.element(trigger()).toBeVisible();
		expect(warned(warn, /SV4009/)).toBe(false);
		first.unmount();
		await render(MenuHarness, {
			items: [
				{ label: 'Lines A', radio: true, checked: true },
				{ separator: true },
				{ label: 'Lines B', radio: true, checked: true },
				{ label: 'Lines C', radio: true, checked: true }
			]
		});
		await expect
			.poll(() => warned(warn, /SV4009.*'Lines B', 'Lines C'.*checks more than one/))
			.toBe(true);
		expect(warned(warn, /'Lines A'/)).toBe(false);
		warn.mockRestore();
	});
});

describe('Menu size', () => {
	it('sets the text and the rows a step larger or smaller, from md by default', async () => {
		const measure = () => {
			const item = page.getByRole('menuitem', { name: 'Duplicate' }).element() as HTMLElement;
			return { text: parseFloat(getComputedStyle(item).fontSize), row: item.offsetHeight };
		};
		const plain = await render(MenuHarness, { open: true });
		await expect.element(page.getByRole('menu')).toBeVisible();
		const md = measure();
		plain.unmount();
		await render(MenuHarness, { open: true, size: 'lg' });
		await expect.element(page.getByRole('menu')).toBeVisible();
		const lg = measure();
		expect(lg.text).toBeGreaterThan(md.text);
		expect(lg.row).toBeGreaterThan(md.row);
	});
});

describe('Menu icons', () => {
	it('draws an icon component of another set in the box of a path icon, hidden from assistive technology', async () => {
		await render(ItemIconsHarness, { kind: 'menu' });
		const glyph = page.getByTestId('glyph');
		await expect.element(glyph).toBeVisible();
		await expect.element(page.getByRole('menuitem', { name: 'Settings' })).toBeVisible();
		const path = page
			.getByRole('menuitem', { name: 'Rename' })
			.element()
			.querySelector('svg:not(.sv-menu__mark)')!
			.getBoundingClientRect();
		const box = glyph.element().getBoundingClientRect();
		// The component draws itself at 32px; the list sizes it like its other icons.
		expect(box.width).not.toBe(32);
		expect(box.width).toBeCloseTo(path.width, 1);
		expect(box.height).toBeCloseTo(path.height, 1);
		expect(glyph.element().closest('[aria-hidden="true"]')).not.toBeNull();
	});
});

describe('Menu links', () => {
	const LINKS: MenuItem[] = [
		{ label: 'Markets', value: 'markets', href: '#markets', current: true },
		{ label: 'Tools', value: 'tools', href: '#tools' },
		{ label: 'Agent', value: 'agent', href: '#agent', disabled: true }
	];
	const ticked = (element: Element) =>
		getComputedStyle(element.querySelector('.sv-menu__mark')!).visibility === 'visible';
	const hash = () => location.hash;
	const reset = () => history.replaceState(null, '', location.pathname + location.search);

	it('makes an item with href a link to its page, the current one marked and ticked', async () => {
		await render(MenuHarness, {
			items: [
				...LINKS,
				{ separator: true },
				{ label: 'Docs', href: '#docs', target: '_blank', rel: 'external' }
			]
		});
		await trigger().click();
		const markets = item('Markets').element();
		expect(markets.tagName).toBe('A');
		await expect.element(item('Markets')).toHaveAttribute('href', '#markets');
		await expect.element(item('Markets')).toHaveAttribute('aria-current', 'page');
		await expect.element(item('Tools')).not.toHaveAttribute('aria-current');
		await expect.element(item('Docs')).toHaveAttribute('target', '_blank');
		await expect.element(item('Docs')).toHaveAttribute('rel', 'external');
		expect(ticked(markets)).toBe(true);
		expect(ticked(item('Tools').element())).toBe(false);
		// A disabled link leads nowhere and is said to be disabled.
		await expect.element(item('Agent')).toHaveAttribute('aria-disabled', 'true');
		await expect.element(item('Agent')).not.toHaveAttribute('href');
		expect(getComputedStyle(markets).textDecorationLine).toBe('none');
	});

	it('follows a link on Enter, Space or a click: closes, gives focus back, reports it', async () => {
		reset();
		await render(MenuHarness, { items: LINKS });
		await trigger().click();
		await expect.element(item('Markets')).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.poll(hash).toBe('#markets');
		await expect.element(trigger()).toHaveFocus();
		await expect.element(shown('chosen')).toHaveTextContent('markets');

		await trigger().click();
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Tools')).toHaveFocus();
		// The disabled link is skipped, as a disabled button is.
		await userEvent.keyboard('{ArrowDown}');
		await expect.element(item('Markets')).toHaveFocus();
		await userEvent.keyboard('{ArrowUp}');
		await userEvent.keyboard(' ');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.poll(hash).toBe('#tools');
		await expect.element(shown('chosen')).toHaveTextContent('tools');

		await trigger().click();
		await item('Markets').click();
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.poll(hash).toBe('#markets');
		reset();
	});

	it('moves to a link whose label starts with what is typed', async () => {
		await render(MenuHarness, { items: LINKS });
		await trigger().click();
		await userEvent.keyboard('t');
		await expect.element(item('Tools')).toHaveFocus();
	});

	it('leaves a click with a modifier key to the browser, and stays open', async () => {
		await render(MenuHarness, { items: LINKS });
		await trigger().click();
		// The test stops the browser from opening a tab; the menu must not act on it either way.
		const stop = (event: Event) => event.preventDefault();
		window.addEventListener('click', stop, { capture: true });
		for (const modifier of ['ctrlKey', 'metaKey', 'shiftKey'] as const) {
			item('Tools')
				.element()
				.dispatchEvent(
					new MouseEvent('click', { bubbles: true, cancelable: true, [modifier]: true })
				);
		}
		window.removeEventListener('click', stop, { capture: true });
		await expect.element(menu()).toBeVisible();
		await expect.element(shown('chosen')).toHaveTextContent('');
	});

	it('warns in development about a checked link, and a current item that is no link', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const warned = (pattern: RegExp) =>
			warn.mock.calls.some(([text]) => pattern.test(String(text)));
		await render(MenuHarness, {
			items: [
				{ label: 'Markets', href: '#markets', radio: true, checked: true },
				{ label: 'Tools', href: '#tools', checked: false },
				{ label: 'Grid', current: true }
			]
		});
		await expect.poll(() => warned(/SV4011.*'Markets' with radio.*current: true/)).toBe(true);
		expect(warned(/SV4011.*'Tools' with checked/)).toBe(true);
		expect(warned(/SV4011.*'Grid' with current but no href/)).toBe(true);
		// Links are not radios, so their group is not checked as one choice.
		expect(warned(/SV4009/)).toBe(false);
		warn.mockRestore();
	});
});
