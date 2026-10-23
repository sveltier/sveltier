/**
 * Size budgets (gzip, JS + CSS that the entry pulls in, Svelte runtime excluded).
 * Each entry is bundled the way a consumer's Vite build would bundle it, then measured
 * by size-limit. Raise a budget only with a written justification.
 *
 * @type {Array<{ name: string, code: string, limit: string }>}
 */
export default [
	{
		name: 'ThemeProvider + useTheme (with tokens and base CSS)',
		code: "export { ThemeProvider, useTheme } from 'sveltier';",
		limit: '3.5 KB'
	},
	{
		name: 'defineTheme (custom themes, adds the colour maths)',
		code: "export { defineTheme } from 'sveltier';",
		limit: '1.5 KB'
	},
	{
		name: 'index (everything)',
		code: "export * from 'sveltier';",
		limit: '6 KB'
	}
];
