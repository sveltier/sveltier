import { expect, test } from '@playwright/test';

// The landing page: the agent replay, how agents use Sveltier, the design system figures and
// the theme packs.

test('the hero says what Sveltier is and where to start', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		/Your agent writes it\.\s*Sveltier gets it right\./
	);
	await page.getByRole('link', { name: 'Get started' }).click();
	await expect(page).toHaveURL(/\/getting-started\/installation$/);
});

test('the app bar shows the logo, and the site has its icons and social card', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'Sveltier', exact: true })).toBeVisible();
	await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
	await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
	const card = await page.locator('meta[property="og:image"]').getAttribute('content');
	expect(card).toMatch(/^https?:\/\/.+\/social-card\.png$/);
	expect((await page.request.get(new URL(card!).pathname)).status()).toBe(200);
});

test.describe('the agent replay', () => {
	test.use({ reducedMotion: 'no-preference' });

	test('types the prompt, streams the source and shows the real component', async ({ page }) => {
		await page.goto('/');
		const replay = page.locator('.replay');
		await expect(replay.getByText('svelte-check: 0 errors')).toBeVisible({ timeout: 15_000 });
		await expect(replay.getByRole('region', { name: 'Portfolio.svelte' })).toContainText(
			"import { Avatar, Card, Chip, List, ListItem, SegmentedControl } from 'sveltier';"
		);
		const preview = replay.locator('.replay__frame');
		await expect(preview.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
		await expect(preview).toContainText('$248,190.35');
		const lines = replay.locator('.replay__line');
		await expect(replay.locator('.replay__line.is-in')).toHaveCount(await lines.count());
	});

	test('switching the example rebuilds it', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('radiogroup', { name: 'Example' })
			.getByRole('radio', { name: 'Deploy' })
			.click();
		const replay = page.locator('.replay');
		await expect(replay.getByText('Wrote Deploy.svelte')).toBeVisible({ timeout: 15_000 });
		await expect(
			replay.locator('.replay__frame').getByRole('heading', { name: 'Production' })
		).toBeVisible();
	});
});

test('reduced motion shows the finished replay at once', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	const replay = page.locator('.replay');
	await expect(replay.getByText('svelte-check: 0 errors')).toBeVisible();
	const lines = await replay.locator('.replay__line').count();
	await expect(replay.locator('.replay__line.is-in')).toHaveCount(lines);
	const bands = await replay.locator('.replay__band').count();
	await expect(replay.locator('.replay__band.is-out')).toHaveCount(bands);
});

test('the replay preview switches between light and dark', async ({ page }) => {
	await page.goto('/');
	const frame = page.locator('.replay__frame');
	await expect(frame).toHaveAttribute('data-sv-theme', 'monolith-light');
	await page
		.getByRole('radiogroup', { name: 'Preview mode' })
		.getByRole('radio', { name: 'Dark' })
		.click();
	await expect(frame).toHaveAttribute('data-sv-theme', 'monolith-dark');
	// The site itself keeps its theme.
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
});

test('a theme pack previews the same card and can theme the whole site', async ({ page }) => {
	await page.goto('/');
	await page
		.getByRole('radiogroup', { name: 'Theme pack' })
		.getByRole('radio', { name: 'Heritage' })
		.click();
	await expect(page.locator('.landing-pack')).toHaveAttribute('data-sv-theme', 'heritage-light');
	await page.getByRole('button', { name: 'Use Heritage on this site' }).click();
	await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'heritage-light');
});

test('the design system figures come from the live theme and the size config', async ({ page }) => {
	await page.goto('/');
	const contrast = page.getByRole('row').filter({ hasText: 'Text on background' });
	await expect(contrast.getByRole('cell').first()).toHaveText(/^\d+\.\d\d:1$/);
	const budget = page.getByRole('row', { name: /^Button\b/ }).filter({ hasText: 'KB' });
	await expect(budget.getByRole('cell').first()).toHaveText('2.1 KB');
});
