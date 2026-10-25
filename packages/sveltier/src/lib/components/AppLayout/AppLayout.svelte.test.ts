import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import AppLayoutHarness from '../../../tests/fixtures/AppLayoutHarness.svelte';

const BAR = 4.2361 * 16; // φ³rem
const DRAWER = 16.18 * 16; // 10φ rem

const part = (selector: string) => document.querySelector(selector) as HTMLElement;
const box = (selector: string) => part(selector).getBoundingClientRect();
// The width of the window without a classic scrollbar, if the browser shows one.
const windowWidth = () => document.documentElement.clientWidth;
// Hidden by CSS, the menu button is out of the accessibility tree, so the role query finds none.
const menu = () => page.getByRole('button', { name: 'Navigation' });
const modal = () => page.getByRole('dialog', { name: 'Navigation' });

describe('AppLayout', () => {
	const original = { width: 0, height: 0 };
	beforeAll(() => {
		original.width = window.innerWidth;
		original.height = window.innerHeight;
	});
	afterAll(async () => {
		await page.viewport(original.width, original.height);
	});
	afterEach(() => window.scrollTo(0, 0));

	describe('from the breakpoint up', () => {
		beforeAll(async () => {
			await page.viewport(1280, 800);
		});

		it('puts the bar across the top, the drawer under it and the content beside the drawer', async () => {
			await render(AppLayoutHarness);
			// The body's own margin is gone: the layout runs from edge to edge.
			const bar = box('.sv-app-bar');
			expect(bar.top).toBe(0);
			expect(bar.left).toBe(0);
			expect(bar.width).toBe(windowWidth());
			expect(bar.height).toBeCloseTo(BAR, 0);
			const drawer = box('.sv-navigation-drawer');
			expect(drawer.top).toBeCloseTo(BAR, 0);
			expect(drawer.left).toBe(0);
			expect(drawer.width).toBeCloseTo(DRAWER, 0);
			const main = box('.sv-main');
			expect(main.top).toBeCloseTo(BAR, 0);
			expect(main.left).toBeCloseTo(DRAWER, 0);
			await expect.element(menu()).not.toBeInTheDocument();
		});

		it('keeps the bar on top and the navigation below it while the page scrolls', async () => {
			await render(AppLayoutHarness);
			window.scrollTo(0, 1000);
			await expect.poll(() => box('.sv-main').top).toBeCloseTo(BAR - 1000, 0);
			expect(box('.sv-app-bar').top).toBe(0);
			const navigation = box('.sv-navigation-drawer__content');
			expect(navigation.top).toBeCloseTo(BAR, 0);
			// It fills the window below the bar.
			expect(navigation.bottom).toBeCloseTo(800, 0);
		});

		it('lets a bar that is not sticky scroll away, the navigation staying at the top', async () => {
			await render(AppLayoutHarness, { bar: { sticky: false } });
			window.scrollTo(0, 1000);
			await expect.poll(() => box('.sv-app-bar').top).toBeCloseTo(-1000, 0);
			expect(box('.sv-navigation-drawer__content').top).toBe(0);
		});

		it('gives the corner to a drawer written first: full height, with the bar beside it', async () => {
			await render(AppLayoutHarness, { drawerFirst: true });
			const drawer = box('.sv-navigation-drawer');
			expect(drawer.top).toBe(0);
			expect(drawer.height).toBeGreaterThanOrEqual(800);
			const bar = box('.sv-app-bar');
			expect(bar.left).toBeCloseTo(DRAWER, 0);
			expect(bar.width).toBeCloseTo(windowWidth() - DRAWER, 0);
			window.scrollTo(0, 1000);
			await expect.poll(() => box('.sv-main').top).toBeCloseTo(BAR - 1000, 0);
			expect(box('.sv-navigation-drawer__content').top).toBe(0);
			expect(box('.sv-app-bar').top).toBe(0);
		});

		it('follows the density of the bar, under it as in the drawer', async () => {
			await render(AppLayoutHarness, { bar: { density: 'compact' } });
			expect(box('.sv-app-bar').height).toBeCloseTo(BAR * 0.8867, 0);
			expect(box('.sv-navigation-drawer').top).toBeCloseTo(BAR * 0.8867, 0);
		});

		it('narrows to a rail of icons that keep their names', async () => {
			await render(AppLayoutHarness, { drawer: { rail: true } });
			expect(box('.sv-navigation-drawer').width).toBeCloseTo(BAR, 0);
			expect(box('.sv-main').left).toBeCloseTo(BAR, 0);
			const link = page.getByRole('link', { name: 'Payments' });
			await expect.element(link).toBeVisible();
			// Centred in the rail, beside its hairline border.
			const icon = link.element().querySelector('svg')!.getBoundingClientRect();
			expect(icon.left + icon.width / 2).toBeCloseTo(
				part('.sv-navigation-drawer').clientWidth / 2,
				0
			);
			expect(
				link.element().querySelector('.sv-list-item__text')!.getBoundingClientRect().width
			).toBe(1);
		});

		it('scrolls a target into view below a sticky bar, with room to spare', async () => {
			await render(AppLayoutHarness);
			part('#payments').scrollIntoView();
			// Within a pixel: browsers round the scroll position.
			await expect.poll(() => Math.abs(box('#payments').top - (BAR + 13))).toBeLessThan(1);
			expect(box('.sv-app-bar').top).toBe(0);
		});
	});

	describe('below the breakpoint', () => {
		beforeAll(async () => {
			await page.viewport(600, 800);
		});

		it('leaves the content the full width and shows the menu button', async () => {
			await render(AppLayoutHarness);
			await expect.element(menu()).toBeVisible();
			expect(part('.sv-navigation-drawer').getClientRects()).toHaveLength(0);
			expect(box('.sv-main').left).toBe(0);
			expect(box('.sv-main').width).toBe(windowWidth());
		});

		it('opens the drawer as a modal from the menu button, and gives focus back on Escape', async () => {
			await render(AppLayoutHarness);
			await expect.element(menu()).toHaveAttribute('aria-expanded', 'false');
			await menu().click();
			await expect.element(modal()).toBeVisible();
			expect((modal().element() as HTMLDialogElement).matches(':modal')).toBe(true);
			await expect.element(menu()).toHaveAttribute('aria-expanded', 'true');
			await expect.element(menu()).toHaveAttribute('aria-controls', modal().element().id);
			const navigation = page.getByRole('navigation', { name: 'Main' });
			await expect.element(navigation.getByRole('link', { name: 'Payments' })).toBeVisible();
			await expect
				.poll(() => {
					const { left, width } = modal()
						.element()
						.querySelector('.sv-modal__panel')!
						.getBoundingClientRect();
					return { left: Math.round(left), width: Math.round(width) };
				})
				.toEqual({ left: 0, width: Math.round(DRAWER) });
			await userEvent.keyboard('{Escape}');
			await expect.element(modal()).not.toBeInTheDocument();
			await expect.element(menu()).toHaveFocus();
			await expect.element(menu()).toHaveAttribute('aria-expanded', 'false');
		});

		it('closes the modal drawer when a link in it is followed', async () => {
			await render(AppLayoutHarness, { open: true });
			await expect.element(modal()).toBeVisible();
			await page.getByRole('link', { name: 'Payments' }).click();
			await expect.element(modal()).not.toBeInTheDocument();
		});

		it('closes the modal drawer when the screen grows past the breakpoint', async () => {
			await render(AppLayoutHarness, { open: true });
			await expect.element(modal()).toBeVisible();
			await page.viewport(1280, 800);
			await expect.element(modal()).not.toBeInTheDocument();
			await expect.element(page.getByRole('link', { name: 'Payments' })).toBeVisible();
			// Narrow again: the links leave the drawer beside the content, and the modal drawer
			// stays shut, as it was closed rather than hidden.
			await page.viewport(600, 800);
			await expect.element(page.getByRole('link', { name: 'Payments' })).not.toBeInTheDocument();
			await expect.element(modal()).not.toBeInTheDocument();
		});

		it('keeps a drawer with breakpoint xs beside the content', async () => {
			await render(AppLayoutHarness, { drawer: { breakpoint: 'xs' } });
			await expect.element(page.getByRole('link', { name: 'Payments' })).toBeVisible();
			expect(box('.sv-main').left).toBeCloseTo(DRAWER, 0);
			await expect.element(menu()).not.toBeInTheDocument();
		});

		it('shows no menu button without a drawer', async () => {
			await render(AppLayoutHarness, { withDrawer: false });
			await expect.element(menu()).not.toBeInTheDocument();
		});
	});

	it('makes a drawer modal below a wider breakpoint', async () => {
		await page.viewport(1100, 800);
		await render(AppLayoutHarness, { drawer: { breakpoint: 'lg' } });
		await expect.element(menu()).toBeVisible();
		expect(box('.sv-main').left).toBe(0);
	});

	it('starts with a skip link to the main content, out of sight until it has focus', async () => {
		await page.viewport(1280, 800);
		await render(AppLayoutHarness);
		const skip = page.getByRole('link', { name: 'Skip to content' });
		await expect.element(skip).toHaveAttribute('href', `#${part('main').id}`);
		expect(skip.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
		// Safari leaves links out of the Tab order unless its setting is on, so focus it directly.
		(skip.element() as HTMLElement).focus();
		expect(skip.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
	});
});
