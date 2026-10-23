import type { ThemeDefinition, ThemeVariables } from '../core/theme/types.js';

// Monolith. Quiet luxury with Swiss precision: monochrome, ink-black actions, colour only for meaning. Geist and Geist Mono. The default.
// Fonts are not bundled; see the theme docs for the Fontsource packages. `on-` colours are
// written out so these themes never pull in the colour maths.

const shared = {
	'font-display': "'Geist Variable', system-ui, sans-serif",
	'font-ui': "'Geist Variable', system-ui, sans-serif",
	'font-data': "'Geist Mono Variable', ui-monospace, monospace",
	'weight-display': 600,
	'tracking-display': '-0.035em',
	'radius-sm': '6px',
	'radius-md': '8px',
	'radius-lg': '12px',
	'radius-xl': '16px',
	'radius-full': '999px',
	'label-size': '0.75rem',
	'label-transform': 'none',
	'label-tracking': '0',
	'button-transform': 'none',
	'button-tracking': '0',
	'surface-alpha': '100%',
	'surface-blur': '0px',
	backdrop: 'none',
	ornament: 'transparent',
	ease: 'cubic-bezier(0.2, 0, 0, 1)',
	'duration-fast': '150ms',
	'duration-normal': '220ms',
	'duration-slow': '320ms'
} satisfies Partial<ThemeVariables>;

export const monolithLight: ThemeDefinition = {
	dark: false,
	colors: {
		background: 'oklch(0.985 0.002 260)',
		surface: 'oklch(1 0 0)',
		'surface-raised': 'oklch(0.965 0.003 260)',
		border: 'oklch(0.91 0.004 260)',
		'border-soft': 'oklch(0.94 0.003 260)',
		'border-strong': 'oklch(0.62 0.006 260)',
		text: 'oklch(0.21 0.006 260)',
		'text-muted': 'oklch(0.42 0.006 260)',
		'text-subtle': 'oklch(0.52 0.006 260)',
		primary: 'oklch(0.21 0.006 260)',
		success: 'oklch(0.50 0.13 155)',
		warning: 'oklch(0.53 0.13 60)',
		error: 'oklch(0.52 0.19 27)',
		info: 'oklch(0.50 0.15 255)',
		up: 'oklch(0.50 0.13 155)',
		down: 'oklch(0.52 0.19 27)',
		'on-primary': 'oklch(0.99 0 0)',
		'on-success': 'oklch(0.985 0.005 155)',
		'on-warning': 'oklch(0.985 0.005 60)',
		'on-error': 'oklch(0.985 0.005 27)',
		'on-info': 'oklch(0.985 0.005 255)',
		'on-up': 'oklch(0.985 0.005 155)',
		'on-down': 'oklch(0.985 0.005 27)'
	},
	variables: {
		...shared,
		bevel: 'oklch(1 0 0 / 0)',
		shadow: '0 1px 2px oklch(0.2 0.01 260 / 0.06), 0 12px 32px -16px oklch(0.2 0.01 260 / 0.22)'
	}
};

export const monolithDark: ThemeDefinition = {
	dark: true,
	colors: {
		background: 'oklch(0.155 0.003 260)',
		surface: 'oklch(0.195 0.004 260)',
		'surface-raised': 'oklch(0.235 0.005 260)',
		border: 'oklch(0.30 0.005 260)',
		'border-soft': 'oklch(0.26 0.004 260)',
		'border-strong': 'oklch(0.56 0.006 260)',
		text: 'oklch(0.97 0.002 260)',
		'text-muted': 'oklch(0.78 0.004 260)',
		'text-subtle': 'oklch(0.66 0.005 260)',
		primary: 'oklch(0.97 0.002 260)',
		success: 'oklch(0.76 0.14 155)',
		warning: 'oklch(0.80 0.13 75)',
		error: 'oklch(0.72 0.16 25)',
		info: 'oklch(0.75 0.12 250)',
		up: 'oklch(0.76 0.14 155)',
		down: 'oklch(0.72 0.16 25)',
		'on-primary': 'oklch(0.18 0.004 260)',
		'on-success': 'oklch(0.2 0.02 155)',
		'on-warning': 'oklch(0.2 0.02 75)',
		'on-error': 'oklch(0.2 0.02 25)',
		'on-info': 'oklch(0.2 0.02 250)',
		'on-up': 'oklch(0.2 0.02 155)',
		'on-down': 'oklch(0.2 0.02 25)'
	},
	variables: {
		...shared,
		bevel: 'oklch(1 0 0 / 0.05)',
		shadow: '0 1px 0 oklch(0 0 0 / 0.4), 0 16px 40px -20px oklch(0 0 0 / 0.7)'
	}
};

/**
 * Monolith: Quiet luxury with Swiss precision: monochrome, ink-black actions, colour only for meaning. Geist and Geist Mono. The default.
 *
 * @example
 * <ThemeProvider themes={monolith}>…</ThemeProvider>
 */
export const monolith = { 'monolith-light': monolithLight, 'monolith-dark': monolithDark };
