import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import AnchoredHarness from '../../../tests/fixtures/AnchoredHarness.svelte';

const box = (id: 'anchor' | 'floating') => page.getByTestId(id).element().getBoundingClientRect();

/** Waits until the floating element sits where `check` wants it. */
async function settles(check: (anchor: DOMRect, floating: DOMRect) => void) {
	await expect
		.poll(() => {
			try {
				check(box('anchor'), box('floating'));
				return true;
			} catch {
				return false;
			}
		})
		.toBe(true);
	check(box('anchor'), box('floating'));
}

const near = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 0);

// Room on every side of the anchor, so only the flip test flips.
const original = { width: 0, height: 0 };
beforeAll(async () => {
	original.width = window.innerWidth;
	original.height = window.innerHeight;
	await page.viewport(1280, 800);
});
afterAll(async () => {
	await page.viewport(original.width, original.height);
});

// Both paths must place the element the same way.
describe.each([
	['natively', false],
	['with the fallback script', true]
])('anchored %s', (_, fallback) => {
	it('sits below the anchor, from its start edge, 5px away', async () => {
		await render(AnchoredHarness, { fallback });
		await settles((anchor, floating) => {
			near(floating.top, anchor.bottom + 5);
			near(floating.left, anchor.left);
		});
	});

	it('aligns to the end and to the centre', async () => {
		const screen = await render(AnchoredHarness, { fallback, placement: { align: 'end' } });
		await settles((anchor, floating) => near(floating.right, anchor.right));
		await screen.rerender({ fallback, placement: { align: 'center' } });
		await settles((anchor, floating) =>
			near(floating.left + floating.width / 2, anchor.left + anchor.width / 2)
		);
	});

	it('places above and at the end side', async () => {
		const screen = await render(AnchoredHarness, { fallback, placement: { side: 'top' } });
		await settles((anchor, floating) => near(floating.bottom, anchor.top - 5));
		await screen.rerender({ fallback, placement: { side: 'end' } });
		await settles((anchor, floating) => {
			near(floating.left, anchor.right + 5);
			near(floating.top, anchor.top);
		});
	});

	it('flips above when there is no room below', async () => {
		await render(AnchoredHarness, { fallback, low: true });
		await settles((anchor, floating) => near(floating.bottom, anchor.top - 5));
	});

	it('follows the writing direction', async () => {
		await render(AnchoredHarness, { fallback, dir: 'rtl' });
		await settles((anchor, floating) => near(floating.right, anchor.right));
	});
});

describe('anchored path choice', () => {
	const floating = () => page.getByTestId('floating').element() as HTMLElement;

	it('stays native on a fully right-to-left page', async () => {
		document.documentElement.dir = 'rtl';
		try {
			await render(AnchoredHarness, { dir: 'rtl' });
			await settles((anchor, box) => near(box.right, anchor.right));
			expect(floating().style.getPropertyValue('position-area')).not.toBe('');
			expect(floating().style.getPropertyValue('translate')).toBe('');
		} finally {
			document.documentElement.removeAttribute('dir');
		}
	});

	it('uses the script where the direction differs from the page, which Firefox misplaces', async () => {
		await render(AnchoredHarness, { dir: 'rtl' });
		await settles((anchor, box) => near(box.right, anchor.right));
		expect(floating().style.getPropertyValue('position-area')).toBe('');
		expect(floating().style.getPropertyValue('translate')).not.toBe('');
	});
});

describe('anchored cleanup', () => {
	it('removes its anchor name when the floating element goes away', async () => {
		const screen = await render(AnchoredHarness);
		const anchor = page.getByTestId('anchor').element() as HTMLElement;
		await expect.poll(() => anchor.style.getPropertyValue('anchor-name')).toMatch(/--sv-anchor-/);
		screen.unmount();
		expect(anchor.style.getPropertyValue('anchor-name')).toBe('');
	});
});
