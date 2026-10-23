import type { ThemeDefinition, ThemeVariables } from '../core/theme/types.js';

// Aurora. Modern depth, dark first: frosted panels over an iris and mint glow. Manrope and JetBrains Mono.
// Fonts are not bundled; see the theme docs for the Fontsource packages. `on-` colours are
// written out so these themes never pull in the colour maths.

const shared = {
	'font-display': "'Manrope Variable', system-ui, sans-serif",
	'font-ui': "'Manrope Variable', system-ui, sans-serif",
	'font-data': "'JetBrains Mono Variable', ui-monospace, monospace",
	'weight-display': 700,
	'tracking-display': '-0.03em',
	'radius-sm': '8px',
	'radius-md': '12px',
	'radius-lg': '16px',
	'radius-xl': '20px',
	'radius-full': '999px',
	'label-size': '0.75rem',
	'label-transform': 'none',
	'label-tracking': '0',
	'button-transform': 'none',
	'button-tracking': '0',
	'surface-blur': '18px',
	ornament: 'transparent',
	ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
	'duration-fast': '160ms',
	'duration-normal': '240ms',
	'duration-slow': '420ms'
} satisfies Partial<ThemeVariables>;

export const auroraLight: ThemeDefinition = {
	dark: false,
	colors: {
		background: 'oklch(0.975 0.01 285)',
		surface: 'oklch(1 0 0)',
		'surface-raised': 'oklch(0.955 0.014 285)',
		border: 'oklch(0.90 0.015 285)',
		'border-soft': 'oklch(0.93 0.012 285)',
		'border-strong': 'oklch(0.60 0.03 285)',
		text: 'oklch(0.22 0.04 282)',
		'text-muted': 'oklch(0.42 0.04 282)',
		'text-subtle': 'oklch(0.50 0.035 282)',
		primary: 'oklch(0.50 0.20 285)',
		success: 'oklch(0.50 0.12 165)',
		warning: 'oklch(0.52 0.13 60)',
		error: 'oklch(0.52 0.19 15)',
		info: 'oklch(0.50 0.13 240)',
		up: 'oklch(0.50 0.12 165)',
		down: 'oklch(0.52 0.19 15)',
		'on-primary': 'oklch(0.99 0.005 285)',
		'on-success': 'oklch(0.985 0.005 165)',
		'on-warning': 'oklch(0.985 0.005 60)',
		'on-error': 'oklch(0.985 0.005 15)',
		'on-info': 'oklch(0.985 0.005 240)',
		'on-up': 'oklch(0.985 0.005 165)',
		'on-down': 'oklch(0.985 0.005 15)'
	},
	variables: {
		...shared,
		'surface-alpha': '78%',
		backdrop:
			'radial-gradient(60% 50% at 10% 0%, oklch(0.75 0.14 287 / 0.28), transparent 70%), radial-gradient(50% 45% at 100% 15%, oklch(0.85 0.10 168 / 0.30), transparent 70%)',
		bevel: 'oklch(1 0 0 / 0.7)',
		shadow: '0 1px 2px oklch(0.3 0.08 285 / 0.08), 0 20px 50px -24px oklch(0.4 0.15 285 / 0.28)'
	}
};

export const auroraDark: ThemeDefinition = {
	dark: true,
	colors: {
		background: 'oklch(0.165 0.035 282)',
		surface: 'oklch(0.215 0.04 282)',
		'surface-raised': 'oklch(0.27 0.045 282)',
		border: 'oklch(0.34 0.04 282)',
		'border-soft': 'oklch(0.28 0.04 282)',
		'border-strong': 'oklch(0.58 0.05 282)',
		text: 'oklch(0.97 0.008 282)',
		'text-muted': 'oklch(0.80 0.02 282)',
		'text-subtle': 'oklch(0.70 0.025 282)',
		primary: 'oklch(0.74 0.15 287)',
		success: 'oklch(0.80 0.13 168)',
		warning: 'oklch(0.83 0.12 80)',
		error: 'oklch(0.72 0.16 15)',
		info: 'oklch(0.78 0.11 230)',
		up: 'oklch(0.80 0.13 168)',
		down: 'oklch(0.72 0.16 15)',
		'on-primary': 'oklch(0.18 0.04 282)',
		'on-success': 'oklch(0.2 0.02 168)',
		'on-warning': 'oklch(0.2 0.02 80)',
		'on-error': 'oklch(0.2 0.02 15)',
		'on-info': 'oklch(0.2 0.02 230)',
		'on-up': 'oklch(0.2 0.02 168)',
		'on-down': 'oklch(0.2 0.02 15)'
	},
	variables: {
		...shared,
		'surface-alpha': '72%',
		backdrop:
			'radial-gradient(60% 50% at 10% 0%, oklch(0.55 0.2 287 / 0.38), transparent 70%), radial-gradient(50% 45% at 100% 15%, oklch(0.7 0.14 168 / 0.22), transparent 70%)',
		bevel: 'oklch(1 0 0 / 0.08)',
		shadow: 'inset 0 1px 0 oklch(1 0 0 / 0.06), 0 24px 60px -24px oklch(0.05 0.05 282 / 0.9)'
	}
};

/**
 * Aurora: Modern depth, dark first: frosted panels over an iris and mint glow. Manrope and JetBrains Mono.
 *
 * @example
 * <ThemeProvider themes={aurora}>…</ThemeProvider>
 */
export const aurora = { 'aurora-light': auroraLight, 'aurora-dark': auroraDark };
