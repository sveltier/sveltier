/**
 * Size budgets (gzip, Svelte runtime excluded). Each entry is bundled the way a consumer's
 * Vite build would bundle it, then measured by size-limit. `measure` picks what counts:
 * the JS, the CSS, or both (the default). Raise a budget only with a written justification.
 *
 * Global styles (design tokens and document defaults) load once per app, so they have their
 * own budget instead of counting against the core JS. The core imports no theme: theme data
 * counts against the pack budgets.
 *
 * @type {Array<{ name: string, code: string, limit: string, measure?: 'js' | 'css' }>}
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
		// the engine, the shared props CSS and locale. It grows with every module by design.
		name: 'index (everything)',
		code: "export * from 'sveltier';",
		limit: '9 KB'
	}
];
