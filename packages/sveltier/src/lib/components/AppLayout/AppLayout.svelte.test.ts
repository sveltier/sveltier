import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import AppLayoutHarness from '../../../tests/fixtures/AppLayoutHarness.svelte';

const BAR = 4.2361 * 16; // φ³rem
const DRAWER = 16.18 * 16; // 10φ rem
const FOOTER = 2.618 * 16; // φ²rem

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
			// Once it has slid in, which takes WebKit longer under load in CI.
			await expect
				.poll(
					() => {
						const { left, width } = modal()
							.element()
							.querySelector('.sv-modal__panel')!
							.getBoundingClientRect();
						return { left: Math.round(left), width: Math.round(width) };
					},
					{ timeout: 5000 }
				)
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

		it('says why the modal drawer closed itself: Escape, or a link followed', async () => {
			const onclose = vi.fn();
			await render(AppLayoutHarness, { drawer: { onclose } });
			await menu().click();
			await expect.element(modal()).toBeVisible();
			await userEvent.keyboard('{Escape}');
			await expect.element(modal()).not.toBeInTheDocument();
			expect(onclose).toHaveBeenLastCalledWith('escape');
			await menu().click();
			await page.getByRole('link', { name: 'Payments' }).click();
			await expect.element(modal()).not.toBeInTheDocument();
			expect(onclose).toHaveBeenLastCalledWith('action');
			expect(onclose).toHaveBeenCalledTimes(2);
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

	describe('with links in the bar and a modal drawer', () => {
		const barLink = () => page.getByRole('link', { name: 'Markets' });
		const props = { withNav: true, drawer: { modal: true } };

		it('shows the links in the bar from the breakpoint up, with no drawer and no menu button', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, props);
			const navigation = page.getByRole('navigation', { name: 'Main' });
			expect(navigation.elements()).toHaveLength(1);
			await expect.element(navigation.getByRole('link', { name: 'Markets' })).toBeVisible();
			expect(part('.sv-app-bar').contains(barLink().element())).toBe(true);
			await expect.element(menu()).not.toBeInTheDocument();
			await expect.element(page.getByRole('link', { name: 'Payments' })).not.toBeInTheDocument();
			expect(part('.sv-navigation-drawer').getClientRects()).toHaveLength(0);
			expect(box('.sv-main').left).toBe(0);
			expect(box('.sv-main').width).toBe(windowWidth());
		});

		it('trades the links in the bar for the menu button and the modal drawer below it', async () => {
			await page.viewport(600, 800);
			await render(AppLayoutHarness, props);
			await expect.element(menu()).toBeVisible();
			await expect.element(barLink()).not.toBeInTheDocument();
			await menu().click();
			await expect.element(modal()).toBeVisible();
			const navigation = page.getByRole('navigation', { name: 'Main' });
			expect(navigation.elements()).toHaveLength(1);
			await expect.element(navigation.getByRole('link', { name: 'Payments' })).toBeVisible();
			// Wider again, the modal drawer closes and the links come back to the bar.
			await page.viewport(1280, 800);
			await expect.element(modal()).not.toBeInTheDocument();
			await expect.element(barLink()).toBeVisible();
			await expect.element(page.getByRole('link', { name: 'Payments' })).not.toBeInTheDocument();
		});

		it('lays a List of links out in a row, the current page marked as in the drawer', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { ...props, navList: true });
			const markets = page.getByRole('link', { name: 'Markets' });
			const trade = page.getByRole('link', { name: 'Trade' });
			await expect.element(markets).toHaveAttribute('aria-current', 'page');
			await expect.element(trade).not.toHaveAttribute('aria-current');
			const first = markets.element().getBoundingClientRect();
			const second = trade.element().getBoundingClientRect();
			expect(second.top).toBeCloseTo(first.top, 0);
			expect(second.left).toBeGreaterThan(first.right);
			// As wide as their text, and inside the bar's height.
			expect(first.width).toBeLessThan(200);
			const bar = box('.sv-app-bar');
			expect(first.top).toBeGreaterThan(bar.top);
			expect(first.bottom).toBeLessThan(bar.bottom);
			expect(getComputedStyle(markets.element()).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
			expect(getComputedStyle(trade.element()).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		});

		it('keeps the links in a bar without a drawer at any width', async () => {
			await page.viewport(600, 800);
			await render(AppLayoutHarness, { withNav: true, withDrawer: false });
			await expect.element(barLink()).toBeVisible();
			await expect.element(menu()).not.toBeInTheDocument();
		});
	});

	it("starts the bar with the app's mark, after the menu button and before the title, at every width", async () => {
		await page.viewport(600, 800);
		await render(AppLayoutHarness, { brand: true });
		const home = page.getByRole('link', { name: 'Dek' });
		await expect.element(home).toBeVisible();
		const mark = home.element().getBoundingClientRect();
		expect(mark.left).toBeGreaterThanOrEqual(menu().element().getBoundingClientRect().right);
		expect(box('.sv-app-bar__title').left).toBeGreaterThanOrEqual(mark.right);
		await page.viewport(1280, 800);
		await expect.element(menu()).not.toBeInTheDocument();
		await expect.element(home).toBeVisible();
		expect(home.element().getBoundingClientRect().right).toBeLessThanOrEqual(
			box('.sv-app-bar__title').left
		);
	});

	describe('filling the window', () => {
		const pageHeight = () => document.documentElement.scrollHeight;

		it('is the height of the window, and Main scrolls instead of the page', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { fill: true });
			expect(box('.sv-app-layout').height).toBeCloseTo(800, 0);
			expect(pageHeight()).toBe(800);
			const main = part('.sv-main');
			expect(box('.sv-main').top).toBeCloseTo(BAR, 0);
			expect(box('.sv-main').bottom).toBeCloseTo(800, 0);
			expect(main.scrollHeight).toBeGreaterThan(main.clientHeight);
			// The drawer fills the height beside it.
			const navigation = box('.sv-navigation-drawer__content');
			expect(navigation.top).toBeCloseTo(BAR, 0);
			expect(navigation.bottom).toBeCloseTo(800, 0);
		});

		it('gives a pane of 100% the height the bar leaves, scrolling on its own', async () => {
			await page.viewport(600, 800);
			await render(AppLayoutHarness, { fill: true, pane: true });
			const pane = part('.pane');
			expect(pane.getBoundingClientRect().height).toBeCloseTo(800 - BAR, 0);
			expect(pane.scrollHeight).toBeGreaterThan(pane.clientHeight);
			expect(part('.sv-main').scrollHeight).toBe(part('.sv-main').clientHeight);
			expect(pageHeight()).toBe(800);
		});

		it('fills only from a breakpoint up, the page scrolling below it', async () => {
			await page.viewport(800, 800);
			await render(AppLayoutHarness, { fill: 'md' });
			expect(pageHeight()).toBeGreaterThan(800);
			await page.viewport(1280, 800);
			await expect.poll(pageHeight).toBe(800);
			expect(box('.sv-main').bottom).toBeCloseTo(800, 0);
		});

		it('gives a drawer written first the full height', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { fill: true, drawerFirst: true });
			const navigation = box('.sv-navigation-drawer__content');
			expect(navigation.top).toBeCloseTo(0, 0);
			expect(navigation.bottom).toBeCloseTo(800, 0);
			expect(pageHeight()).toBe(800);
		});
	});

	describe('with a footer', () => {
		const footer = () => page.getByRole('contentinfo');

		it('puts it under the content, as wide as the bar, as the contentinfo landmark', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { footer: {} });
			await expect.element(footer()).toHaveTextContent('Market open');
			window.scrollTo(0, document.documentElement.scrollHeight);
			await expect.poll(() => box('.sv-app-footer').bottom).toBeCloseTo(800, 0);
			const line = box('.sv-app-footer');
			expect(line.left).toBe(0);
			expect(line.width).toBe(windowWidth());
			expect(line.height).toBeCloseTo(FOOTER, 0);
			expect(line.top).toBeGreaterThanOrEqual(box('.sv-main').bottom - 0.5);
			// The drawer's navigation ends above the footer.
			expect(box('.sv-navigation-drawer__content').bottom).toBeLessThanOrEqual(line.top + 0.5);
		});

		it('keeps a sticky footer at the bottom of the window, the navigation above it', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { footer: { sticky: true } });
			window.scrollTo(0, 1000);
			await expect.poll(() => box('.sv-main').top).toBeCloseTo(BAR - 1000, 0);
			expect(box('.sv-app-footer').bottom).toBeCloseTo(800, 0);
			const navigation = box('.sv-navigation-drawer__content');
			expect(navigation.top).toBeCloseTo(BAR, 0);
			expect(navigation.bottom).toBeCloseTo(800 - FOOTER, 0);
		});

		it('puts it beside a drawer written first', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { footer: { sticky: true }, drawerFirst: true });
			expect(box('.sv-app-footer').left).toBeCloseTo(DRAWER, 0);
			expect(box('.sv-app-footer').bottom).toBeCloseTo(800, 0);
			expect(box('.sv-navigation-drawer__content').bottom).toBeCloseTo(800, 0);
		});

		it('keeps it at the bottom of a layout that fills the window, Main between', async () => {
			await page.viewport(1280, 800);
			await render(AppLayoutHarness, { footer: {}, fill: true, pane: true });
			expect(box('.sv-app-footer').bottom).toBeCloseTo(800, 0);
			expect(box('.sv-main').bottom).toBeCloseTo(800 - FOOTER, 0);
			expect(box('.sv-navigation-drawer__content').bottom).toBeCloseTo(800 - FOOTER, 0);
			expect(document.documentElement.scrollHeight).toBe(800);
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

describe('BottomNavigation', () => {
	const original = { width: 0, height: 0 };
	beforeAll(() => {
		original.width = window.innerWidth;
		original.height = window.innerHeight;
	});
	afterAll(async () => {
		await page.viewport(original.width, original.height);
	});
	afterEach(() => window.scrollTo(0, 0));

	const bottom = () => page.getByRole('navigation', { name: 'Sections' });
	const shown = () => getComputedStyle(part('.sv-bottom-navigation')).display !== 'none';

	it('is a named navigation of links along the bottom of a phone, the current page marked', async () => {
		await page.viewport(390, 800);
		await render(AppLayoutHarness, { bottom: {} });
		await expect.element(bottom()).toBeVisible();
		const overview = bottom().getByRole('link', { name: 'Overview' });
		await expect.element(overview).toHaveAttribute('aria-current', 'page');
		await expect.element(overview).toHaveAttribute('href', '#overview');
		await expect
			.element(bottom().getByRole('link', { name: 'Cards' }))
			.not.toHaveAttribute('aria-current');
		// The icons are drawn, and hidden from assistive technology.
		const icon = overview.element().querySelector('svg')!;
		expect(icon.getBoundingClientRect().width).toBeCloseTo(24, 0);
		expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();

		// The full width of the window, a bar tall, stuck to its bottom while the page scrolls.
		const bar = box('.sv-bottom-navigation');
		expect(bar.left).toBe(0);
		expect(bar.width).toBe(windowWidth());
		expect(bar.height).toBeCloseTo(BAR, 0);
		expect(bar.bottom).toBeCloseTo(800, 0);
		window.scrollTo(0, 1000);
		await expect.poll(() => box('.sv-main').top).toBeLessThan(0);
		expect(box('.sv-bottom-navigation').bottom).toBeCloseTo(800, 0);
		// The destinations share the width.
		const widths = [...part('.sv-bottom-navigation').children].map(
			(item) => item.getBoundingClientRect().width
		);
		expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
	});

	it('ends the content above it when the page is scrolled to the end', async () => {
		await page.viewport(390, 800);
		await render(AppLayoutHarness, { bottom: {} });
		window.scrollTo(0, document.documentElement.scrollHeight);
		await expect.poll(() => box('.sv-bottom-navigation').bottom).toBeCloseTo(800, 0);
		expect(box('.sv-main').bottom).toBeLessThanOrEqual(box('.sv-bottom-navigation').top + 0.5);
	});

	it('is left out from its breakpoint up', async () => {
		await page.viewport(1280, 800);
		await render(AppLayoutHarness, { bottom: {} });
		await expect.element(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
		expect(shown()).toBe(false);
		await page.viewport(959, 800);
		await expect.poll(shown).toBe(true);
	});

	it('follows a narrower breakpoint', async () => {
		await page.viewport(700, 800);
		await render(AppLayoutHarness, { bottom: { breakpoint: 'sm' } });
		await expect.element(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
		expect(shown()).toBe(false);
		await page.viewport(599, 800);
		await expect.poll(shown).toBe(true);
	});

	it('keeps a sticky footer on top of it', async () => {
		await page.viewport(390, 800);
		await render(AppLayoutHarness, { bottom: {}, footer: { sticky: true } });
		window.scrollTo(0, 1000);
		await expect.poll(() => box('.sv-main').top).toBeLessThan(0);
		expect(box('.sv-bottom-navigation').bottom).toBeCloseTo(800, 0);
		expect(box('.sv-app-footer').bottom).toBeCloseTo(800 - BAR, 0);
	});

	it('leaves Main the height between the bar and itself when the layout fills the window', async () => {
		await page.viewport(390, 800);
		await render(AppLayoutHarness, { bottom: {}, footer: {}, fill: true, pane: true });
		await expect.element(bottom()).toBeVisible();
		expect(box('.sv-bottom-navigation').bottom).toBeCloseTo(800, 0);
		expect(box('.sv-app-footer').bottom).toBeCloseTo(800 - BAR, 0);
		expect(box('.sv-main').top).toBeCloseTo(BAR, 0);
		expect(box('.sv-main').bottom).toBeCloseTo(800 - BAR - FOOTER, 0);
		expect(document.documentElement.scrollHeight).toBe(800);
	});

	it('keeps toasts and scrolled-to content clear of it while it shows', async () => {
		await page.viewport(390, 800);
		await render(AppLayoutHarness, { bottom: {} });
		await expect.element(bottom()).toBeVisible();
		const root = getComputedStyle(document.documentElement);
		// The toast region adds the bar's height to the footer's.
		expect(root.getPropertyValue('--sv-toasts-nav').trim()).not.toBe('');
		expect(parseFloat(root.scrollPaddingBlockEnd)).toBeGreaterThan(BAR);
	});

	it('warns in development about a breakpoint at which it would never show', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await page.viewport(390, 800);
		// @ts-expect-error: xs leaves no width below it.
		await render(AppLayoutHarness, { bottom: { breakpoint: 'xs' } });
		await expect
			.poll(() =>
				warn.mock.calls.some(([text]) => /SV2002.*BottomNavigation.*breakpoint/.test(String(text)))
			)
			.toBe(true);
		warn.mockRestore();
	});
});

describe('BottomNavigation with links in the bar', () => {
	afterAll(async () => {
		await page.viewport(1280, 800);
	});

	it('takes over from the links of the bar below its breakpoint', async () => {
		await page.viewport(390, 800);
		await render(AppLayoutHarness, { bottom: {}, withNav: true, withDrawer: false });
		await expect.element(page.getByRole('navigation', { name: 'Sections' })).toBeVisible();
		const barLinks = () => getComputedStyle(part('.sv-app-bar__nav')).display;
		expect(barLinks()).toBe('none');
		await page.viewport(1280, 800);
		await expect.poll(barLinks).not.toBe('none');
		expect(getComputedStyle(part('.sv-bottom-navigation')).display).toBe('none');
	});
});

describe('Bars that hide on scroll', () => {
	const original = { width: 0, height: 0 };
	beforeAll(async () => {
		original.width = window.innerWidth;
		original.height = window.innerHeight;
		await page.viewport(390, 800);
	});
	afterAll(async () => {
		await page.viewport(original.width, original.height);
	});
	afterEach(() => window.scrollTo(0, 0));

	// Each jump is one scroll event, and the bars follow on the next frame.
	const scroll = async (y: number) => {
		window.scrollTo(0, y);
		await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
	};
	const away = (selector: string) => part(selector).hasAttribute('data-sv-away');

	it('slides the app bar off the top as the page is read on, and back as it moves up', async () => {
		await render(AppLayoutHarness, { withDrawer: false, bar: { hideOnScroll: true } });
		await scroll(600);
		expect(away('.sv-app-bar')).toBe(true);
		await expect.poll(() => box('.sv-app-bar').bottom).toBeLessThanOrEqual(0);
		// A few pixels back do not count; more than that bring it back.
		await scroll(596);
		expect(away('.sv-app-bar')).toBe(true);
		await scroll(560);
		expect(away('.sv-app-bar')).toBe(false);
		await expect.poll(() => box('.sv-app-bar').top).toBeCloseTo(0, 0);
	});

	it('shows the bar near the top of the page, whichever way it moved', async () => {
		await render(AppLayoutHarness, { withDrawer: false, bar: { hideOnScroll: true } });
		await scroll(80);
		expect(away('.sv-app-bar')).toBe(false);
		await scroll(600);
		expect(away('.sv-app-bar')).toBe(true);
	});

	it('shows the bars after a jump, such as a restored scroll offset, until the page is read on', async () => {
		await render(AppLayoutHarness, { withDrawer: false, bar: { hideOnScroll: true } });
		// More than the window's height in one go is no reading.
		await scroll(2000);
		expect(away('.sv-app-bar')).toBe(false);
		await scroll(1990);
		expect(away('.sv-app-bar')).toBe(false);
		await scroll(2100);
		expect(away('.sv-app-bar')).toBe(true);
		await scroll(400);
		expect(away('.sv-app-bar')).toBe(false);
	});

	it('keeps a bar that holds the keyboard focus, or an open menu, in view', async () => {
		await render(AppLayoutHarness, { withDrawer: false, bar: { hideOnScroll: true } });
		await scroll(600);
		expect(away('.sv-app-bar')).toBe(true);
		// A focus that follows the keyboard, as Tab gives; WebKit's Tab skips buttons unless told.
		await userEvent.keyboard('a');
		(page.getByRole('button', { name: 'Sign out' }).element() as HTMLElement).focus({
			focusVisible: true
		} as FocusOptions);
		expect(document.activeElement!.matches(':focus-visible')).toBe(true);
		expect(away('.sv-app-bar')).toBe(false);
		await expect.poll(() => box('.sv-app-bar').top).toBeCloseTo(0, 0);
		(document.activeElement as HTMLElement).blur();
		// Focus may have scrolled the bar into view; read on from wherever the page is.
		await scroll(scrollY + 600);
		expect(away('.sv-app-bar')).toBe(true);
		// A control of the bar with an open menu holds it too.
		part('.sv-app-bar button').setAttribute('aria-expanded', 'true');
		await expect.poll(() => box('.sv-app-bar').top).toBeCloseTo(0, 0);
	});

	it('hides only below its breakpoint', async () => {
		await render(AppLayoutHarness, { withDrawer: false, bar: { hideOnScroll: 'sm' } });
		await scroll(600);
		expect(away('.sv-app-bar')).toBe(true);
		await page.viewport(700, 800);
		await expect.poll(() => away('.sv-app-bar')).toBe(false);
		await page.viewport(390, 800);
		await expect.poll(() => away('.sv-app-bar')).toBe(true);
	});

	it('hides the bottom navigation and the sticky footer, and gives their room to the toasts', async () => {
		await render(AppLayoutHarness, {
			withDrawer: false,
			footer: { sticky: true, hideOnScroll: true },
			bottom: { hideOnScroll: true }
		});
		const root = () => getComputedStyle(document.documentElement);
		expect(root().getPropertyValue('--sv-toasts-nav').trim()).not.toBe('0px');
		await scroll(600);
		await expect.poll(() => box('.sv-bottom-navigation').top).toBeGreaterThanOrEqual(800);
		await expect.poll(() => box('.sv-app-footer').top).toBeGreaterThanOrEqual(800);
		expect(root().getPropertyValue('--sv-toasts-nav').trim()).toBe('0px');
		expect(root().getPropertyValue('--sv-toasts-footer').trim()).toBe('0px');
		await scroll(500);
		await expect.poll(() => box('.sv-bottom-navigation').bottom).toBeCloseTo(800, 0);
		await expect
			.poll(() => box('.sv-app-footer').bottom)
			.toBeCloseTo(box('.sv-bottom-navigation').top, 0);
	});

	it('moves a sticky footer that stays down into the room of a bottom navigation that goes', async () => {
		await render(AppLayoutHarness, {
			withDrawer: false,
			footer: { sticky: true },
			bottom: { hideOnScroll: true }
		});
		await scroll(600);
		await expect.poll(() => box('.sv-app-footer').bottom).toBeCloseTo(800, 0);
		expect(away('.sv-app-footer')).toBe(false);
	});

	it('warns about a bar that hides on scroll but is not sticky, and leaves it be', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		await render(AppLayoutHarness, {
			withDrawer: false,
			footer: { hideOnScroll: 'md' }
		});
		expect(
			warn.mock.calls.some(([text]) =>
				String(text).startsWith('[sveltier SV4012] <AppFooter> has hideOnScroll but is not sticky')
			)
		).toBe(true);
		await scroll(600);
		expect(away('.sv-app-footer')).toBe(false);
		warn.mockRestore();
	});
});
