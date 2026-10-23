import type { ThemeDefinition, ThemeVariables } from '../core/theme/types.js';

// Maison. Parisian couture house: noir and off-white, one Bordeaux accent, square corners, wide-tracked capitals. Cormorant Garamond, Jost and DM Mono.
// Fonts are not bundled; see the theme docs for the Fontsource packages. `on-` colours are
// written out so these themes never pull in the colour maths.

const shared = {
	'font-display': "'Cormorant Garamond Variable', Garamond, 'Times New Roman', serif",
	'font-ui': "'Jost Variable', Futura, system-ui, sans-serif",
	'font-data': "'DM Mono', ui-monospace, monospace",
	'weight-display': 500,
	'tracking-display': '-0.005em',
	'radius-sm': '0px',
	'radius-md': '0px',
	'radius-lg': '0px',
	'radius-xl': '0px',
	'radius-full': '0px',
	'label-size': '0.6875rem',
	'label-transform': 'uppercase',
	'label-tracking': '0.22em',
	'button-transform': 'uppercase',
	'button-tracking': '0.16em',
	'surface-alpha': '100%',
	'surface-blur': '0px',
	backdrop: 'none',
	ornament: 'transparent',
	bevel: 'oklch(1 0 0 / 0)',
	shadow: '0 0 0 oklch(0 0 0 / 0)',
	ease: 'cubic-bezier(0.45, 0, 0.2, 1)',
	'duration-fast': '200ms',
	'duration-normal': '300ms',
	'duration-slow': '450ms'
} satisfies Partial<ThemeVariables>;

export const maisonLight: ThemeDefinition = {
	dark: false,
	colors: {
		background: 'oklch(0.975 0.004 70)',
		surface: 'oklch(0.995 0.002 70)',
		'surface-raised': 'oklch(0.95 0.005 70)',
		border: 'oklch(0.86 0.005 70)',
		'border-soft': 'oklch(0.88 0.004 70)',
		'border-strong': 'oklch(0.55 0.005 70)',
		text: 'oklch(0.17 0.003 70)',
		'text-muted': 'oklch(0.40 0.004 70)',
		'text-subtle': 'oklch(0.50 0.004 70)',
		primary: 'oklch(0.40 0.13 18)',
		success: 'oklch(0.48 0.10 160)',
		warning: 'oklch(0.52 0.12 70)',
		error: 'oklch(0.50 0.17 28)',
		info: 'oklch(0.47 0.11 250)',
		up: 'oklch(0.48 0.10 160)',
		down: 'oklch(0.50 0.17 28)',
		'on-primary': 'oklch(0.985 0.003 70)',
		'on-success': 'oklch(0.985 0.005 160)',
		'on-warning': 'oklch(0.985 0.005 70)',
		'on-error': 'oklch(0.985 0.005 28)',
		'on-info': 'oklch(0.985 0.005 250)',
		'on-up': 'oklch(0.985 0.005 160)',
		'on-down': 'oklch(0.985 0.005 28)'
	},
	variables: {
		...shared
	}
};

export const maisonDark: ThemeDefinition = {
	dark: true,
	colors: {
		background: 'oklch(0.14 0.002 70)',
		surface: 'oklch(0.18 0.003 70)',
		'surface-raised': 'oklch(0.22 0.004 70)',
		border: 'oklch(0.30 0.004 70)',
		'border-soft': 'oklch(0.27 0.003 70)',
		'border-strong': 'oklch(0.56 0.005 70)',
		text: 'oklch(0.96 0.004 70)',
		'text-muted': 'oklch(0.78 0.005 70)',
		'text-subtle': 'oklch(0.66 0.005 70)',
		primary: 'oklch(0.74 0.12 15)',
		success: 'oklch(0.76 0.12 160)',
		warning: 'oklch(0.80 0.12 75)',
		error: 'oklch(0.72 0.15 30)',
		info: 'oklch(0.76 0.10 245)',
		up: 'oklch(0.76 0.12 160)',
		down: 'oklch(0.72 0.15 30)',
		'on-primary': 'oklch(0.16 0.02 15)',
		'on-success': 'oklch(0.2 0.02 160)',
		'on-warning': 'oklch(0.2 0.02 75)',
		'on-error': 'oklch(0.2 0.02 30)',
		'on-info': 'oklch(0.2 0.02 245)',
		'on-up': 'oklch(0.2 0.02 160)',
		'on-down': 'oklch(0.2 0.02 30)'
	},
	variables: {
		...shared
	}
};

/**
 * Maison: Parisian couture house: noir and off-white, one Bordeaux accent, square corners, wide-tracked capitals. Cormorant Garamond, Jost and DM Mono.
 *
 * @example
 * <ThemeProvider themes={maison}>…</ThemeProvider>
 */
export const maison = { 'maison-light': maisonLight, 'maison-dark': maisonDark };
