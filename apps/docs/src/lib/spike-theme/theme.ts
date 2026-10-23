// Prototype of SSR theme injection, used to prove the approach before the theme engine
// lands in the package. It is replaced by the package ThemeProvider.

export type ThemeName = 'ink' | 'bone';
export type ThemeChoice = ThemeName | 'system';

interface SpikeTheme {
	dark: boolean;
	colors: Record<string, string>;
}

export const STORAGE_KEY = 'sv-theme';
export const ATTRIBUTE = 'data-sv-theme';

export const themes: Record<ThemeName, SpikeTheme> = {
	ink: {
		dark: true,
		colors: { bg: 'oklch(0.175 0.010 78)', fg: 'oklch(0.95 0.008 78)' }
	},
	bone: {
		dark: false,
		colors: { bg: 'oklch(0.945 0.010 78)', fg: 'oklch(0.21 0.012 78)' }
	}
};

function declarations(theme: SpikeTheme): string {
	const vars = Object.entries(theme.colors)
		.map(([name, value]) => `--sv-color-${name}:${value}`)
		.join(';');
	return `${vars};color-scheme:${theme.dark ? 'dark' : 'light'}`;
}

/**
 * One stylesheet for every theme. Explicit choices are attribute selectors; "system"
 * (and a root without the attribute) follows prefers-color-scheme in pure CSS, so the
 * right theme paints before any JavaScript runs.
 */
export function themeCss(light: ThemeName = 'bone', dark: ThemeName = 'ink'): string {
	const named = (Object.keys(themes) as ThemeName[])
		.map((name) => `[${ATTRIBUTE}="${name}"]{${declarations(themes[name])}}`)
		.join('');
	const system = `:root:not([${ATTRIBUTE}]),[${ATTRIBUTE}="system"]`;
	return (
		`@layer sv.tokens{${named}` +
		`@media (prefers-color-scheme:light){${system}{${declarations(themes[light])}}}` +
		`@media (prefers-color-scheme:dark){${system}{${declarations(themes[dark])}}}` +
		`html{background:var(--sv-color-bg);color:var(--sv-color-fg)}}`
	);
}

/**
 * Inline, render-blocking script for <head>. Applies a stored explicit choice to <html>
 * before the body is parsed. The stored value is checked against the known names
 * before it touches the DOM.
 */
export function themeScript(): string {
	const names = JSON.stringify(Object.keys(themes));
	return (
		`(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});` +
		`if(${names}.indexOf(t)>-1)document.documentElement.setAttribute(${JSON.stringify(ATTRIBUTE)},t)}catch(e){}})()`
	);
}

/** Markup for <svelte:head>: the theme stylesheet, then the render-blocking script. */
export function themeHead(): string {
	return `<style id="sv-theme">${themeCss()}</style><script>${themeScript()}</script>`;
}
