/**
 * Size budgets (gzip, Svelte runtime excluded). Each entry is bundled the way a consumer's
 * Vite build would bundle it, then measured by size-limit. `measure` picks what counts:
 * the JS, the CSS, or both (the default). Raise a budget only with a written justification.
 *
 * Global styles (design tokens and document defaults) load once per app, so they have their
 * own budget instead of counting against the core JS. The core imports no theme: theme data
 * counts against the pack budgets.
 *
 * @type {Array<{ name: string, code: string, limit: string, measure?: 'js' | 'css', external?: RegExp[] }>}
 */
const packs = ['monolith', 'heritage', 'aurora', 'maison', 'milano'];

export default [
	{
		name: 'global styles (tokens and base CSS)',
		code: "import 'sveltier/styles/tokens.css';\nimport 'sveltier/styles/base.css';",
		limit: '1.2 KB',
		measure: 'css'
	},
	{
		name: 'core JS (UIProvider: theme, defaults, display, locale)',
		code: "export { UIProvider, ThemeProvider, useTheme, DefaultsProvider, useDefaults, useDisplay, useLocale } from 'sveltier';",
		limit: '5 KB',
		measure: 'js'
	},
	{
		name: 'sharedClasses (with the shared props CSS)',
		code: "export { sharedClasses } from 'sveltier';",
		limit: '1 KB'
	},
	{
		// Includes the full tabbable query (radio groups, positive tabindex, closed details).
		name: 'focusTrap (with tabbable)',
		code: "export { focusTrap } from 'sveltier';",
		limit: '1.2 KB'
	},
	{
		name: 'rovingFocus',
		code: "export { rovingFocus } from 'sveltier';",
		limit: '1 KB'
	},
	{
		name: 'dismissable',
		code: "export { dismissable } from 'sveltier';",
		limit: '0.75 KB'
	},
	{
		name: 'Portal',
		code: "export { Portal } from 'sveltier';",
		limit: '0.85 KB'
	},
	{
		name: 'inertOthers and scrollLock',
		code: "export { inertOthers, scrollLock } from 'sveltier';",
		limit: '0.6 KB'
	},
	{
		// About 0.5 KB of its own; the rest is the bundler's helper for dynamic imports, which an
		// app ships once for all its lazy imports. The fallback is measured below.
		name: 'anchored',
		code: "export { anchored } from 'sveltier';",
		limit: '1.6 KB',
		external: [/fallback\.js$/]
	},
	{
		// Downloaded only by browsers without CSS anchor positioning.
		name: 'anchored fallback',
		code: "export { follow } from 'sveltier/primitives/anchored/fallback.js';",
		limit: '1 KB'
	},
	{
		name: 'keymap and typeahead',
		code: "export { keymap, typeahead } from 'sveltier';",
		limit: '0.8 KB'
	},
	{
		name: 'motion (theme timing, transitions, springs)',
		code: "export { motion, easing, cubicBezier, fade, rise, pop, spring, SPRINGS } from 'sveltier';",
		limit: '1.1 KB'
	},
	{
		// Uniform and measured items, scroll adjustment, and jumps that wait for the viewport and
		// stay on target while the rows around them are measured. Hidden viewports, border-box
		// measurement and observation outside ResizeObserver's delivery add the last 0.3 KB.
		name: 'virtualList',
		code: "export { virtualList } from 'sveltier';",
		limit: '1.8 KB'
	},
	{
		name: 'defineTheme (custom themes, adds the colour maths)',
		code: "export { defineTheme } from 'sveltier';",
		limit: '1 KB'
	},
	...packs.map((pack) => ({
		name: `theme pack: ${pack}`,
		code: `export { ${pack} } from 'sveltier/themes/${pack}';`,
		limit: '1 KB'
	})),
	{
		// A guard against accidental growth of the barrel: all five packs (about 4.5 KB) plus
		// the engine, the shared props CSS, locale, the primitives and the bundler's dynamic import
		// helper. It grows with every module by design.
		name: 'index (everything)',
		code: "export * from 'sveltier';",
		external: [/fallback\.js$/],
		limit: '15 KB'
	}
];
