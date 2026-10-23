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
		// The component's own JS and CSS. The shared modules it uses (shared props, defaults,
		// locale) come with UIProvider or the first component and are measured above. About
		// 1.1 KB of JS (button and link, loading with its message, icon slots) and 0.95 KB of
		// CSS (five variants on one state layer, bevel, spinner): over the first 1.5 KB guess.
		name: 'Button',
		code: "export { Button } from 'sveltier';",
		limit: '2.1 KB',
		external: [/\/core\//]
	},
	{
		name: 'Alert',
		code: "export { Alert } from 'sveltier';",
		limit: '2 KB',
		external: [/\/core\//]
	},
	{
		name: 'Avatar',
		code: "export { Avatar } from 'sveltier';",
		limit: '1.2 KB',
		external: [/\/core\//]
	},
	{
		// Count, cap, dot and the spoken label; includes the shared visually hidden rule.
		name: 'Badge',
		code: "export { Badge } from 'sveltier';",
		limit: '1.4 KB',
		external: [/\/core\//]
	},
	{
		name: 'ButtonGroup',
		code: "export { ButtonGroup } from 'sveltier';",
		limit: '1 KB',
		external: [/\/core\//]
	},
	{
		name: 'Card',
		code: "export { Card } from 'sveltier';",
		limit: '1.5 KB',
		external: [/\/core\//]
	},
	{
		// A tag, a toggle, an action and a link in one, with a close button and its own state layer.
		name: 'Chip',
		code: "export { Chip } from 'sveltier';",
		limit: '2.3 KB',
		external: [/\/core\//]
	},
	{
		name: 'Divider',
		code: "export { Divider } from 'sveltier';",
		limit: '0.6 KB',
		external: [/\/core\//]
	},
	{
		// Most of it is what any Svelte component with rest props costs.
		name: 'Icon',
		code: "export { Icon } from 'sveltier';",
		limit: '1 KB',
		external: [/\/core\//]
	},
	{
		name: 'List and ListItem',
		code: "export { List, ListItem } from 'sveltier';",
		limit: '2 KB',
		external: [/\/core\//]
	},
	{
		name: 'ProgressLinear',
		code: "export { ProgressLinear } from 'sveltier';",
		limit: '1.3 KB',
		external: [/\/core\//]
	},
	{
		name: 'ProgressCircular',
		code: "export { ProgressCircular } from 'sveltier';",
		limit: '1.5 KB',
		external: [/\/core\//]
	},
	{
		// Includes rovingFocus, which gives it one tab stop and arrow keys.
		name: 'SegmentedControl',
		code: "export { SegmentedControl } from 'sveltier';",
		limit: '2.4 KB',
		external: [/\/core\//]
	},
	{
		name: 'Skeleton',
		code: "export { Skeleton } from 'sveltier';",
		limit: '1.2 KB',
		external: [/\/core\//]
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
		limit: '24 KB'
	}
];
