import type { ThemeDefinition, ThemeVariables } from '../core/theme/types.js';

// Milano. Milanese design: cashmere cream, espresso and Siena terracotta, pill-shaped controls. Bodoni Moda, Titillium Web and IBM Plex Mono.
// Fonts are not bundled; see the theme docs for the Fontsource packages. `on-` colours are
// written out so these themes never pull in the colour maths.

const shared = {
	'font-display': "'Bodoni Moda Variable', 'Bodoni 72', Didot, serif",
	'font-ui': "'Titillium Web', system-ui, sans-serif",
	'font-data': "'IBM Plex Mono', ui-monospace, monospace",
	'weight-display': 500,
	'tracking-display': '-0.015em',
	'radius-sm': '8px',
	'radius-md': '999px',
	'radius-lg': '14px',
	'radius-xl': '18px',
	'radius-full': '999px',
	'label-size': '0.75rem',
	'label-transform': 'none',
	'label-tracking': '0.02em',
	'button-transform': 'none',
	'button-tracking': '0',
	'surface-alpha': '100%',
	'surface-blur': '0px',
	backdrop: 'none',
	ornament: 'transparent',
	ease: 'cubic-bezier(0.34, 1.36, 0.64, 1)',
	'duration-fast': '180ms',
	'duration-normal': '260ms',
	'duration-slow': '380ms'
} satisfies Partial<ThemeVariables>;

export const milanoLight: ThemeDefinition = {
	dark: false,
	colors: {
		background: 'oklch(0.955 0.013 75)',
		surface: 'oklch(0.985 0.008 75)',
		'surface-raised': 'oklch(0.93 0.016 75)',
		border: 'oklch(0.86 0.018 70)',
		'border-soft': 'oklch(0.91 0.014 70)',
		'border-strong': 'oklch(0.58 0.025 60)',
		text: 'oklch(0.25 0.03 50)',
		'text-muted': 'oklch(0.42 0.03 50)',
		'text-subtle': 'oklch(0.50 0.028 50)',
		primary: 'oklch(0.50 0.13 42)',
		success: 'oklch(0.48 0.09 140)',
		warning: 'oklch(0.52 0.12 75)',
		error: 'oklch(0.48 0.16 22)',
		info: 'oklch(0.47 0.09 235)',
		up: 'oklch(0.48 0.09 140)',
		down: 'oklch(0.48 0.16 22)',
		'on-primary': 'oklch(0.985 0.008 75)',
		'on-success': 'oklch(0.985 0.005 140)',
		'on-warning': 'oklch(0.985 0.005 75)',
		'on-error': 'oklch(0.985 0.005 22)',
		'on-info': 'oklch(0.985 0.005 235)',
		'on-up': 'oklch(0.985 0.005 140)',
		'on-down': 'oklch(0.985 0.005 22)'
	},
	variables: {
		...shared,
		bevel: 'oklch(1 0 0 / 0.7)',
		shadow: '0 1px 2px oklch(0.35 0.04 50 / 0.08), 0 18px 40px -22px oklch(0.35 0.05 50 / 0.35)'
	}
};

export const milanoDark: ThemeDefinition = {
	dark: true,
	colors: {
		background: 'oklch(0.185 0.016 50)',
		surface: 'oklch(0.225 0.018 50)',
		'surface-raised': 'oklch(0.265 0.02 50)',
		border: 'oklch(0.35 0.02 50)',
		'border-soft': 'oklch(0.29 0.018 50)',
		'border-strong': 'oklch(0.58 0.025 55)',
		text: 'oklch(0.95 0.012 75)',
		'text-muted': 'oklch(0.80 0.016 70)',
		'text-subtle': 'oklch(0.69 0.018 65)',
		primary: 'oklch(0.72 0.12 45)',
		success: 'oklch(0.76 0.10 140)',
		warning: 'oklch(0.82 0.11 80)',
		error: 'oklch(0.72 0.14 22)',
		info: 'oklch(0.76 0.09 230)',
		up: 'oklch(0.76 0.10 140)',
		down: 'oklch(0.72 0.14 22)',
		'on-primary': 'oklch(0.20 0.02 45)',
		'on-success': 'oklch(0.2 0.02 140)',
		'on-warning': 'oklch(0.2 0.02 80)',
		'on-error': 'oklch(0.2 0.02 22)',
		'on-info': 'oklch(0.2 0.02 230)',
		'on-up': 'oklch(0.2 0.02 140)',
		'on-down': 'oklch(0.2 0.02 22)'
	},
	variables: {
		...shared,
		bevel: 'oklch(1 0 0 / 0.06)',
		shadow: '0 1px 0 oklch(0 0 0 / 0.35), 0 22px 48px -26px oklch(0 0 0 / 0.75)'
	}
};

/**
 * Milano: Milanese design: cashmere cream, espresso and Siena terracotta, pill-shaped controls. Bodoni Moda, Titillium Web and IBM Plex Mono.
 *
 * @example
 * <ThemeProvider themes={milano}>…</ThemeProvider>
 */
export const milano = { 'milano-light': milanoLight, 'milano-dark': milanoDark };
