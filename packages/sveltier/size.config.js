/**
 * Size budgets (gzip, JS + CSS that the entry pulls in, Svelte runtime excluded).
 * Each entry is bundled the way a consumer's Vite build would bundle it, then measured
 * by size-limit. Raise a budget only with a written justification.
 *
 * @type {Array<{ name: string, code: string, limit: string }>}
 */
const packs = ['monolith', 'heritage', 'aurora', 'maison', 'milano'];

export default [
	{
		name: 'ThemeProvider + useTheme (default Monolith, tokens and base CSS)',
		code: "export { ThemeProvider, useTheme } from 'sveltier';",
		limit: '3.5 KB'
	},
	{
		name: 'defineTheme (custom themes, adds the colour maths)',
		code: "export { defineTheme } from 'sveltier';",
		limit: '2 KB'
	},
	...packs.map((pack) => ({
		name: `theme pack: ${pack}`,
		code: `export { ${pack} } from 'sveltier/themes/${pack}';`,
		limit: '1 KB'
	})),
	{
		name: 'index (everything)',
		code: "export * from 'sveltier';",
		limit: '7 KB'
	}
];
