import { expect, test } from '@playwright/test';
import { GALLERY_PAGES, galleryPath } from '../src/lib/gallery/pages.ts';

// Visual regression: every gallery page (mode × accent × density) against its reference
// screenshot. Fonts render differently on each system, so the references are Chromium on
// Linux, made in the same Playwright image as CI, and the test is skipped elsewhere. To update
// them, from a clean checkout (the docs are built first: through a mounted folder the build can
// outlast Playwright's wait for its web server):
//
//   docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.64.1-noble bash -c \
//     "npm i -g pnpm@10.15.0 && pnpm install --frozen-lockfile && pnpm --filter @sveltier/ui build \
//      && cd apps/docs && pnpm build && (pnpm preview --port 4173 &) && sleep 5 \
//      && pnpm exec playwright test visual --project=chromium --update-snapshots"

test.skip(
	({ browserName }) => browserName !== 'chromium' || process.platform !== 'linux',
	'The references are Chromium screenshots made on Linux'
);

for (const gallery of GALLERY_PAGES) {
	const name = `${gallery.mode}-${gallery.accent}-${gallery.density}`;

	test(`gallery ${name}`, async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 900 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(`/${galleryPath(gallery)}`);
		await expect(page.locator('html')).toHaveAttribute('data-sv-theme', /.+/);
		await page.evaluate(() => document.fonts.ready);

		await expect(page.getByTestId('gallery')).toHaveScreenshot(`${name}.png`, {
			animations: 'disabled',
			caret: 'hide',
			maxDiffPixelRatio: 0.001
		});
	});
}
