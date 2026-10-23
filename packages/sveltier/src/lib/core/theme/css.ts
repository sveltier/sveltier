import type { ThemeChoice, ThemeDefinition } from './types.js';

export const THEME_ATTRIBUTE = 'data-sv-theme';

const NAME = /^(?!system$)[a-z][\w-]*$/i;
const KEY = /^[a-z][\w-]*$/i;
const UNSAFE = /[<>{};]/;
const NONCE = /^[\w+/=-]+$/;

function check(ok: unknown, message: string): asserts ok {
	if (!ok) throw new Error(`[sveltier] ${message}`);
}

/** `{color-scheme:…;--sv-color-x:…;--sv-on-x:…;--sv-var:…}` for one theme. */
function block(theme: ThemeDefinition | undefined, name: string): string {
	check(theme, `unknown theme "${name}"`);
	let out = `color-scheme:${theme.dark ? 'dark' : 'light'}`;
	const entries = [
		...Object.entries(theme.colors).map(([k, v]) => [k.startsWith('on-') ? k : `color-${k}`, v]),
		...Object.entries(theme.variables)
	];
	for (const [key, value] of entries) {
		check(KEY.test(key), `invalid colour or variable name "${key}"`);
		check(!UNSAFE.test(String(value)), `unsafe value for "${key}"`);
		out += `;--sv-${key}:${value}`;
	}
	return `{${out}}`;
}

export interface ThemeCssOptions {
	themes: Record<string, ThemeDefinition>;
	/** Theme used by "system" when the OS prefers light. */
	light: string;
	/** Theme used by "system" when the OS prefers dark. */
	dark: string;
	/** What `<html>` shows before any attribute is set (no JavaScript, nothing stored). */
	fallback: ThemeChoice;
}

/**
 * One stylesheet for every theme, keyed by `data-sv-theme`. "system" is pure CSS
 * (`prefers-color-scheme`), so the right theme paints before any JavaScript runs.
 * It also holds a `.sv-color-<name>` class for every colour with an `on-` colour (intents
 * and custom colours), which a component's `color` prop sets.
 */
export function themeCss({ themes, light, dark, fallback }: ThemeCssOptions): string {
	const attr = (name: string) => `[${THEME_ATTRIBUTE}="${name}"]`;
	const bare = `:root:not([${THEME_ATTRIBUTE}])`;
	const system = attr('system') + (fallback === 'system' ? `,${bare}` : '');
	const colors = new Set<string>();
	let css = '';
	for (const [name, theme] of Object.entries(themes)) {
		check(NAME.test(name), `invalid theme name "${name}"`);
		css += attr(name) + block(theme, name);
		for (const key in theme.colors) if (key.startsWith('on-')) colors.add(key.slice(3));
	}
	css += `@media (prefers-color-scheme:light){${system}${block(themes[light], light)}}`;
	css += `@media (prefers-color-scheme:dark){${system}${block(themes[dark], dark)}}`;
	if (fallback !== 'system') css += bare + block(themes[fallback], fallback);
	let classes = '';
	for (const color of colors) {
		classes += `.sv-color-${color}{--sv-color:var(--sv-color-${color});--sv-on-color:var(--sv-on-${color})}`;
	}
	return `@layer sv.tokens,sv.base,sv.components,sv.utilities;@layer sv.tokens{${css}}@layer sv.base{${classes}}`;
}

/**
 * Render-blocking script for `<head>`: applies a stored choice to `<html>` before the body
 * is parsed, if it is one of `choices`. Exposed so a Content Security Policy can hash it.
 */
export function themeScript(storageKey: string, choices: string[]): string {
	const json = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
	return `(function(){try{var t=localStorage.getItem(${json(storageKey)});if(${json(choices)}.indexOf(t)>-1)document.documentElement.setAttribute("${THEME_ATTRIBUTE}",t)}catch(e){}})()`;
}

/** Markup for `<svelte:head>`: the theme stylesheet, then the optional script. */
export function themeHead(css: string, script: string, nonce?: string): string {
	check(nonce === undefined || NONCE.test(nonce), 'invalid nonce');
	const attr = nonce ? ` nonce="${nonce}"` : '';
	return `<style id="sv-theme"${attr}>${css}</style>${script && `<script${attr}>${script}</script>`}`;
}
