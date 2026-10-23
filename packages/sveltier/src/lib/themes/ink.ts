import type { ThemeDefinition } from '../core/theme/types.js';
import { champagne, type Accent } from './accents.js';

/**
 * Ink: the dark base. Neutrals lean warm or cool with the accent hue. `on-` colours are
 * written out (not computed) so the default themes do not pull in the colour maths.
 */
export function ink(accent: Accent = champagne): ThemeDefinition {
	const h = accent.hue;
	return {
		dark: true,
		colors: {
			background: `oklch(0.175 0.010 ${h})`,
			surface: `oklch(0.215 0.011 ${h})`,
			'surface-raised': `oklch(0.255 0.012 ${h})`,
			border: `oklch(0.36 0.012 ${h})`,
			'border-soft': `oklch(0.29 0.011 ${h})`,
			'border-strong': `oklch(0.55 0.012 ${h})`,
			text: `oklch(0.95 0.008 ${h})`,
			'text-muted': `oklch(0.77 0.010 ${h})`,
			'text-subtle': `oklch(0.65 0.010 ${h})`,
			...accent.dark,
			success: 'oklch(0.77 0.095 150)',
			'on-success': 'oklch(0.2 0.02 150)',
			warning: 'oklch(0.79 0.120 62)',
			'on-warning': 'oklch(0.2 0.02 62)',
			error: 'oklch(0.71 0.125 28)',
			'on-error': 'oklch(0.2 0.02 28)',
			info: 'oklch(0.76 0.090 245)',
			'on-info': 'oklch(0.2 0.02 245)',
			up: 'oklch(0.77 0.095 150)',
			'on-up': 'oklch(0.2 0.02 150)',
			down: 'oklch(0.71 0.125 28)',
			'on-down': 'oklch(0.2 0.02 28)'
		},
		variables: {
			bevel: 'oklch(1 0 0 / 0.07)',
			shadow: '0 1px 0 oklch(0 0 0 / 0.45), 0 22px 44px -28px oklch(0 0 0 / 0.8)'
		}
	};
}
