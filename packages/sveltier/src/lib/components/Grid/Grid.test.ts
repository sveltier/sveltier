import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import GridHarness from '../../../tests/fixtures/GridHarness.svelte';
import { DEFAULT_THRESHOLDS } from '../../core/display/display.js';

// Runs in Node: the markup the server sends before any script runs.
describe('Container, Row and Col on the server', () => {
	it('set the spans and the gap on the elements, for the stylesheet to read', () => {
		const { body } = render(GridHarness, {
			props: { row: { gap: 13 }, cols: [{ cols: 12, md: 4 }, {}, {}] }
		});
		expect(body).toMatch(/class="sv-container sv-container--lg"/);
		expect(body).toMatch(/class="sv-row"[^>]*style="--sv-row-gap: var\(--sv-space-13\);"/);
		expect(body).toMatch(/class="sv-col"[^>]*style="--sv-col-xs: 12; --sv-col-md: 4;"/);
		// A column without spans has no style: the stylesheet spans all twelve columns.
		expect(body).toMatch(/<div data-testid="col-1" class="sv-col">/);
	});
});

// The columns change span in CSS, at the widths useDisplay() names its breakpoints.
describe('the breakpoints of the grid CSS', () => {
	it('are the default display thresholds', () => {
		const css = readFileSync(new URL('./grid.css', import.meta.url), 'utf8');
		const widths = Object.fromEntries(
			[...css.matchAll(/@media \(width >= (\d+)px\) \{\s*\.sv-col \{[^}]*?--sv-col-(\w+)/g)].map(
				([, width, name]) => [name, Number(width)]
			)
		);
		expect(widths).toEqual(DEFAULT_THRESHOLDS);
	});
});
