import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import GridHarness from '../../../tests/fixtures/GridHarness.svelte';

type Screen = Awaited<ReturnType<typeof render>>;
const element = (screen: Screen, id: string) => screen.getByTestId(id).element() as HTMLElement;
const box = (screen: Screen, id: string) => element(screen, id).getBoundingClientRect();
const THIRDS = [
	{ cols: 12, md: 4 },
	{ cols: 12, md: 4 },
	{ cols: 12, md: 4 }
] as const;

describe('Container, Row and Col', () => {
	const original = { width: 0, height: 0 };
	beforeAll(() => {
		original.width = window.innerWidth;
		original.height = window.innerHeight;
	});
	afterAll(async () => {
		await page.viewport(original.width, original.height);
	});

	it('lays three columns on one line from md up, and stacks them below', async () => {
		await page.viewport(1280, 800);
		const screen = await render(GridHarness, { cols: [...THIRDS] });
		const row = box(screen, 'row');
		const [first, second, third] = ['col-0', 'col-1', 'col-2'].map((id) => box(screen, id));
		expect(second!.top).toBe(first!.top);
		expect(third!.top).toBe(first!.top);
		// Three equal thirds with two gaps of 21px between them.
		expect(first!.width).toBeCloseTo((row.width - 2 * 21) / 3, 0);
		expect(second!.left - first!.right).toBeCloseTo(21, 0);

		await page.viewport(600, 800);
		await expect.poll(() => box(screen, 'col-0').width).toBeCloseTo(box(screen, 'row').width, 0);
		expect(box(screen, 'col-1').top).toBeCloseTo(box(screen, 'col-0').bottom + 21, 0);
	});

	it('takes the span of the widest breakpoint the screen reaches', async () => {
		await page.viewport(700, 800);
		const screen = await render(GridHarness, {
			cols: [{ cols: 12, sm: 6, lg: 3 }, { sm: 6 }, { cols: 4 }]
		});
		const row = box(screen, 'row');
		expect(box(screen, 'col-0').width).toBeCloseTo((row.width - 21) / 2, 0);
		expect(box(screen, 'col-1').top).toBe(box(screen, 'col-0').top);
		// cols alone applies on every screen: four columns and the three gaps between them.
		expect(box(screen, 'col-2').width).toBeCloseTo((row.width - 11 * 21) / 3 + 3 * 21, 0);
	});

	it('keeps the spans of a column off the columns of a row inside it', async () => {
		await page.viewport(1280, 800);
		const screen = await render(GridHarness, { cols: [...THIRDS] });
		// The inner column names no span, so it takes the whole inner row, not a third of it.
		expect(box(screen, 'inner-col').width).toBeCloseTo(box(screen, 'inner-row').width, 0);
	});

	it('puts a gap from the space scale between columns and between lines', async () => {
		await page.viewport(1280, 800);
		const screen = await render(GridHarness, {
			row: { gap: 8 },
			cols: [{ cols: 6 }, { cols: 6 }, { cols: 6 }]
		});
		expect(box(screen, 'col-1').left - box(screen, 'col-0').right).toBeCloseTo(8, 0);
		expect(box(screen, 'col-2').top - box(screen, 'col-0').bottom).toBeCloseTo(8, 0);
	});

	it('takes a gap of 0', async () => {
		await page.viewport(1280, 800);
		const screen = await render(GridHarness, { row: { gap: 0 }, cols: [{ cols: 6 }, { cols: 6 }] });
		expect(box(screen, 'col-1').left).toBeCloseTo(box(screen, 'col-0').right, 0);
	});

	it('aligns the columns in their line, and their content across their span', async () => {
		await page.viewport(1280, 800);
		const screen = await render(GridHarness, {
			row: { align: 'center', justify: 'end' },
			cols: [{ cols: 6, style: 'block-size: 200px' }, { cols: 6 }]
		});
		const [tall, short] = [box(screen, 'col-0'), box(screen, 'col-1')];
		expect(short.height).toBeLessThan(tall.height);
		expect(short.top + short.height / 2).toBeCloseTo(tall.top + tall.height / 2, 0);
		// The second column sits at the end of its half, as wide as its text.
		expect(short.right).toBeCloseTo(box(screen, 'row').right, 0);
		expect(short.width).toBeLessThan(box(screen, 'row').width / 4);
	});

	it('centres the content, as wide as its size at most', async () => {
		await page.viewport(1600, 800);
		const screen = await render(GridHarness);
		const container = element(screen, 'container');
		const space = container.parentElement!.getBoundingClientRect();
		const own = container.getBoundingClientRect();
		expect(own.width).toBeCloseTo(87.19 * 16, 0);
		expect(own.left - space.left).toBeCloseTo((space.width - own.width) / 2, 0);
	});

	it('takes the width of its size', async () => {
		await page.viewport(1600, 800);
		const screen = await render(GridHarness, { container: { size: 'xs' } });
		expect(box(screen, 'container').width).toBeCloseTo(42.36 * 16, 0);
	});

	it('takes the full width when fluid', async () => {
		await page.viewport(1600, 800);
		const screen = await render(GridHarness, { container: { fluid: true } });
		const container = element(screen, 'container');
		expect(container.getBoundingClientRect().width).toBeCloseTo(
			container.parentElement!.getBoundingClientRect().width,
			0
		);
	});
});
