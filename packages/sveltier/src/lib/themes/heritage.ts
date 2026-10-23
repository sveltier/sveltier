import type { ThemeDefinition, ThemeVariables } from '../core/theme/types.js';

// Heritage. Private banking, editorial: ivory paper, Oxford navy and brass, hairline rules. Instrument Serif, Instrument Sans and IBM Plex Mono.
// Fonts are not bundled; see the theme docs for the Fontsource packages. `on-` colours are
// written out so these themes never pull in the colour maths.

const shared = {
	'font-display': "'Instrument Serif', 'Times New Roman', serif",
	'font-ui': "'Instrument Sans Variable', system-ui, sans-serif",
	'font-data': "'IBM Plex Mono', ui-monospace, monospace",
	'weight-display': 400,
	'tracking-display': '-0.01em',
	'radius-sm': '2px',
	'radius-md': '3px',
	'radius-lg': '5px',
	'radius-xl': '5px',
	'radius-full': '999px',
	'label-size': '0.697rem',
	'label-transform': 'uppercase',
	'label-tracking': '0.146em',
	'button-transform': 'none',
	'button-tracking': '0',
	'surface-alpha': '100%',
	'surface-blur': '0px',
	backdrop: 'none',
	ease: 'cubic-bezier(0.236, 0.854, 0.236, 1)',
	'duration-fast': '233ms',
	'duration-normal': '377ms',
	'duration-slow': '610ms'
} satisfies Partial<ThemeVariables>;

export const heritageLight: ThemeDefinition = {
	dark: false,
	colors: {
		background: 'oklch(0.965 0.014 85)',
		surface: 'oklch(0.985 0.009 85)',
		'surface-raised': 'oklch(0.935 0.016 85)',
		border: 'oklch(0.84 0.02 85)',
		'border-soft': 'oklch(0.90 0.016 85)',
		'border-strong': 'oklch(0.58 0.03 85)',
		text: 'oklch(0.25 0.04 258)',
		'text-muted': 'oklch(0.42 0.035 258)',
		'text-subtle': 'oklch(0.50 0.03 258)',
		primary: 'oklch(0.33 0.075 258)',
		success: 'oklch(0.47 0.10 155)',
		warning: 'oklch(0.50 0.12 65)',
		error: 'oklch(0.49 0.15 25)',
		info: 'oklch(0.45 0.09 245)',
		up: 'oklch(0.47 0.10 155)',
		down: 'oklch(0.49 0.15 25)',
		'on-primary': 'oklch(0.97 0.012 85)',
		'on-success': 'oklch(0.985 0.005 155)',
		'on-warning': 'oklch(0.985 0.005 65)',
		'on-error': 'oklch(0.985 0.005 25)',
		'on-info': 'oklch(0.985 0.005 245)',
		'on-up': 'oklch(0.985 0.005 155)',
		'on-down': 'oklch(0.985 0.005 25)'
	},
	variables: {
		...shared,
		ornament: 'oklch(0.66 0.09 80)',
		bevel: 'oklch(1 0 0 / 0.8)',
		shadow: '0 1px 0 oklch(0.4 0.03 85 / 0.08), 0 21px 34px -21px oklch(0.3 0.04 258 / 0.3)'
	}
};

export const heritageDark: ThemeDefinition = {
	dark: true,
	colors: {
		background: 'oklch(0.185 0.03 258)',
		surface: 'oklch(0.225 0.034 258)',
		'surface-raised': 'oklch(0.265 0.038 258)',
		border: 'oklch(0.36 0.035 258)',
		'border-soft': 'oklch(0.30 0.034 258)',
		'border-strong': 'oklch(0.58 0.035 258)',
		text: 'oklch(0.95 0.015 85)',
		'text-muted': 'oklch(0.80 0.02 85)',
		'text-subtle': 'oklch(0.68 0.02 85)',
		primary: 'oklch(0.80 0.10 82)',
		success: 'oklch(0.78 0.11 155)',
		warning: 'oklch(0.82 0.11 75)',
		error: 'oklch(0.74 0.13 25)',
		info: 'oklch(0.78 0.08 240)',
		up: 'oklch(0.78 0.11 155)',
		down: 'oklch(0.74 0.13 25)',
		'on-primary': 'oklch(0.22 0.03 258)',
		'on-success': 'oklch(0.2 0.02 155)',
		'on-warning': 'oklch(0.2 0.02 75)',
		'on-error': 'oklch(0.2 0.02 25)',
		'on-info': 'oklch(0.2 0.02 240)',
		'on-up': 'oklch(0.2 0.02 155)',
		'on-down': 'oklch(0.2 0.02 25)'
	},
	variables: {
		...shared,
		ornament: 'oklch(0.70 0.09 80)',
		bevel: 'oklch(1 0 0 / 0.06)',
		shadow: '0 1px 0 oklch(0 0 0 / 0.4), 0 21px 55px -34px oklch(0 0 0 / 0.8)'
	}
};

/**
 * Heritage: Private banking, editorial: ivory paper, Oxford navy and brass, hairline rules. Instrument Serif, Instrument Sans and IBM Plex Mono.
 *
 * @example
 * <ThemeProvider themes={heritage}>…</ThemeProvider>
 */
export const heritage = { 'heritage-light': heritageLight, 'heritage-dark': heritageDark };
