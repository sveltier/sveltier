import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ContextMenuHarness from '../../../tests/fixtures/ContextMenuHarness.svelte';

const row = (id: string) => page.getByText(`Order ${id}`);
const menu = () => page.getByRole('menu', { name: 'Order actions' });
const item = (name: string) => page.getByRole('menuitem', { name, exact: true });
const shown = (testId: string) => page.getByTestId(testId);

// A right click at a point of the element, in viewport px.
function rightClick(element: Element, x: number, y: number) {
	element.dispatchEvent(
		new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			button: 2,
			clientX: x,
			clientY: y
		})
	);
}

// Where the menu's corner settles once its opening transition, which scales it, is over.
async function corner(): Promise<[number, number]> {
	const read = () => {
		const box = menu().element().getBoundingClientRect();
		return [box.left, box.top] as [number, number];
	};
	let last = read();
	await expect
		.poll(() => {
			const now = read();
			const still = Math.abs(now[0] - last[0]) < 0.01 && Math.abs(now[1] - last[1]) < 0.01;
			last = now;
			return still && !menu().element().getAnimations().length;
		})
		.toBe(true);
	return last;
}

// Within a pixel; a real click lands within a few, as the test frame may be scaled.
const near = (actual: [number, number], expected: [number, number], within = 1) => {
	expect(Math.abs(actual[0] - expected[0])).toBeLessThanOrEqual(within);
	expect(Math.abs(actual[1] - expected[1])).toBeLessThanOrEqual(within);
};

describe('ContextMenu', () => {
	it('opens at the pointer on a right click, named by its label, on the row clicked', async () => {
		await render(ContextMenuHarness);
		const box = row('A-2').element().getBoundingClientRect();
		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			button: 2,
			clientX: box.left + 40,
			clientY: box.top + 10
		});
		row('A-2').element().dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		await expect.element(menu()).toBeVisible();
		await expect.element(shown('row')).toHaveTextContent('A-2');
		await expect.element(item('Copy id')).toHaveFocus();
		near(await corner(), [box.left + 40, box.top + 10]);
	});

	it('chooses an item, closes, and gives focus back to the row', async () => {
		await render(ContextMenuHarness);
		(row('A-3').element() as HTMLElement).focus();
		const box = row('A-3').element().getBoundingClientRect();
		rightClick(row('A-3').element(), box.left + 4, box.top + 4);
		await expect.element(item('Copy id')).toHaveFocus();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('chosen')).toHaveTextContent('chart A-3');
		await expect.element(shown('reason')).toHaveTextContent('action');
		await expect.element(row('A-3')).toHaveFocus();
	});

	it('opens below a focused row with Shift+F10, and closes on Escape', async () => {
		await render(ContextMenuHarness);
		(row('A-1').element() as HTMLElement).focus();
		await userEvent.keyboard('{Shift>}{F10}{/Shift}');
		await expect.element(menu()).toBeVisible();
		await expect.element(shown('row')).toHaveTextContent('A-1');
		const box = row('A-1').element().getBoundingClientRect();
		near(await corner(), [box.left, box.bottom]);
		await userEvent.keyboard('{Escape}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('escape');
		await expect.element(row('A-1')).toHaveFocus();
	});

	it('opens with the ContextMenu key too', async () => {
		await render(ContextMenuHarness);
		(row('A-2').element() as HTMLElement).focus();
		await userEvent.keyboard('{ContextMenu}');
		await expect.element(menu()).toBeVisible();
		await expect.element(item('Copy id')).toHaveFocus();
	});

	it('stays inside the viewport when opened near its corner', async () => {
		await render(ContextMenuHarness);
		const width = document.documentElement.clientWidth;
		const height = window.innerHeight;
		rightClick(row('A-1').element(), width - 2, height - 2);
		await expect.element(menu()).toBeVisible();
		await corner();
		const placed = menu().element().getBoundingClientRect();
		expect(placed.right).toBeLessThanOrEqual(width);
		expect(placed.bottom).toBeLessThanOrEqual(height);
	});

	it('moves to a row right-clicked while it is open', async () => {
		await render(ContextMenuHarness);
		await userEvent.click(row('A-3'), { button: 'right', position: { x: 10, y: 10 } });
		await expect.element(menu()).toBeVisible();
		await expect.element(item('Copy id')).toHaveFocus();
		await userEvent.click(row('A-1'), { button: 'right', position: { x: 10, y: 10 } });
		await expect.element(shown('row')).toHaveTextContent('A-1');
		await expect.element(item('Copy id')).toHaveFocus();
		const first = row('A-1').element().getBoundingClientRect();
		near(await corner(), [first.left + 10, first.top + 10], 4);
		await userEvent.keyboard('{Escape}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(row('A-1')).toHaveFocus();
	});

	it('closes on a press outside and on Tab', async () => {
		await render(ContextMenuHarness);
		rightClick(row('A-1').element(), 120, 80);
		await expect.element(menu()).toBeVisible();
		await page.getByRole('button', { name: 'Before' }).click();
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('outside');
		rightClick(row('A-1').element(), 120, 80);
		await expect.element(item('Copy id')).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(shown('reason')).toHaveTextContent('focus');
	});
});
