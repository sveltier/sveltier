import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import AppLayoutHarness from '../../../tests/fixtures/AppLayoutHarness.svelte';
import { DEFAULT_THRESHOLDS } from '../../core/display/display.js';

// Runs in Node: the markup the server sends before any script runs.
describe('AppLayout on the server', () => {
	it('renders the skip link, the banner, the drawer beside the content and the main content', () => {
		const { body } = render(AppLayoutHarness);
		const skip = body.match(/<a class="sv-app-layout__skip" href="#([^"]+)">Skip to content<\/a>/);
		expect(skip).not.toBeNull();
		expect(body).toMatch(new RegExp(`<main[^>]*id="${skip![1]}"`));
		expect(body).toMatch(/<header[^>]*class="sv-app-bar[^"]*sv-app-bar--sticky/);
		// The drawer is rendered beside the content with its links; the CSS hides it on a narrow
		// screen until the script makes it a modal drawer.
		expect(body).toMatch(
			/<nav aria-label="Main"[^>]*class="sv-navigation-drawer sv-navigation-drawer--md/
		);
		expect(body).toMatch(/<a[^>]*href="#payments"/);
		expect(body).not.toContain('<dialog');
	});

	it('renders the menu button for the CSS to show below the breakpoint, closed', () => {
		const { body } = render(AppLayoutHarness);
		const button = body.match(/<span class="sv-app-bar__menu">(?:<!---->)?(<button[^>]*>)/)?.[1];
		expect(button).toContain('aria-label="Navigation"');
		expect(button).toContain('aria-haspopup="dialog"');
		expect(button).toContain('aria-expanded="false"');
	});
});

// The drawer leaves the grid in CSS and turns modal in script: both at the same widths.
describe('the breakpoints of the layout CSS', () => {
	const css = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8');
	const widths = (source: string) =>
		Object.fromEntries(
			[...source.matchAll(/@media \(width < (\d+)px\) \{[^{]*?--(\w+)\b/g)].map(
				([, width, name]) => [name, Number(width)]
			)
		);

	it('are the default display thresholds', () => {
		expect(widths(css('./navigation-drawer.css'))).toEqual(DEFAULT_THRESHOLDS);
		expect(widths(css('./app-layout.css'))).toEqual(DEFAULT_THRESHOLDS);
	});
});
