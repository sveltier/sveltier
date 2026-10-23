import { expect, test, type Page } from '@playwright/test';

// The right theme is painted from the first frame, with or without JavaScript, and
// hydration never switches it.

const DARK_BG = 'oklch(0.155 0.003 260)'; // monolith-dark
const LIGHT_BG = 'oklch(0.985 0.002 260)'; // monolith-light

declare global {
	interface Window {
		__frames: string[];
		__attrs: Array<string | null>;
	}
}

/** Records the theme token on every animation frame and every change of data-sv-theme. */
async function recordFrames(page: Page) {
	await page.addInitScript(() => {
		window.__frames = [];
		window.__attrs = [];
		// Init scripts run before <html> exists, so observe the document and read the root lazily.
		new MutationObserver((records) => {
			for (const record of records) {
				window.__attrs.push((record.target as Element).getAttribute('data-sv-theme'));
			}
		}).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-sv-theme'] });
		const sample = () => {
			const root = document.documentElement;
			window.__frames.push(
				root ? getComputedStyle(root).getPropertyValue('--sv-color-background').trim() : ''
			);
			if (window.__frames.length < 90) requestAnimationFrame(sample);
		};
		requestAnimationFrame(sample);
	});
}

async function storeChoice(page: Page, choice: string) {
	await page.addInitScript((value) => {
		try {
			if (!sessionStorage.getItem('seeded')) {
				localStorage.setItem('sv-theme', value);
				sessionStorage.setItem('seeded', '1');
			}
		} catch {
			// ignore
		}
	}, choice);
}

/** Blocks the SvelteKit app bundle so only the server HTML (and its inline script) runs. */
async function blockAppJs(page: Page) {
	await page.route('**/_app/immutable/**/*.js', (route) => route.abort());
}

const htmlBg = (page: Page) =>
	page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue('--sv-color-background').trim()
	);

test.describe('system preference without JavaScript', () => {
	test('light system paints the light theme', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await blockAppJs(page);
		await page.goto('/');
		expect(await htmlBg(page)).toBe(LIGHT_BG);
	});

	test('dark system paints the dark theme', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await blockAppJs(page);
		await page.goto('/');
		expect(await htmlBg(page)).toBe(DARK_BG);
	});
});

test('stored choice beats system preference before the app bundle runs', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await storeChoice(page, 'monolith-light');
	await blockAppJs(page);
	await page.goto('/');
	expect(await htmlBg(page)).toBe(LIGHT_BG);
});

test('no frame shows the wrong theme through hydration', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await storeChoice(page, 'monolith-light');
	await recordFrames(page);
	await page.goto('/');
	await expect(page.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
	await page.waitForFunction(() => window.__frames.length >= 30);

	const { frames, attrs } = await page.evaluate(() => ({
		frames: window.__frames,
		attrs: window.__attrs
	}));
	const painted = frames.filter((value) => value !== '');
	expect(painted.length).toBeGreaterThan(0);
	expect(new Set(painted)).toEqual(new Set([LIGHT_BG]));
	expect(attrs.every((value) => value === 'monolith-light')).toBe(true);
});

test('a new choice persists across reloads without a flash', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	await page.getByRole('radio', { name: 'Dark', exact: true }).check();
	expect(await htmlBg(page)).toBe(DARK_BG);

	await recordFrames(page);
	await page.reload();
	await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked();
	await page.waitForFunction(() => window.__frames.length >= 30);
	const frames = await page.evaluate(() => window.__frames.filter((value) => value !== ''));
	expect(new Set(frames)).toEqual(new Set([DARK_BG]));
});
