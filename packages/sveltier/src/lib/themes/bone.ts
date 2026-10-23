import type { ThemeDefinition } from '../core/theme/types.js';
import { champagne, type Accent } from './accents.js';

/**
 * Bone: the light base. Paper-like, never pure white. `on-` colours are written out (not
 * computed) so the default themes do not pull in the colour maths.
 */
export function bone(accent: Accent = champagne): ThemeDefinition {
	const h = accent.hue;
	return {
		dark: false,
		colors: {
			background: `oklch(0.945 0.010 ${h})`,
			surface: `oklch(0.975 0.006 ${h})`,
			'surface-raised': `oklch(0.925 0.011 ${h})`,
			border: `oklch(0.80 0.012 ${h})`,
			'border-soft': `oklch(0.88 0.010 ${h})`,
			'border-strong': `oklch(0.60 0.012 ${h})`,
			text: `oklch(0.21 0.012 ${h})`,
			'text-muted': `oklch(0.40 0.012 ${h})`,
			'text-subtle': `oklch(0.50 0.012 ${h})`,
			...accent.light,
			success: 'oklch(0.46 0.095 152)',
			'on-success': 'oklch(0.985 0.005 152)',
			warning: 'oklch(0.50 0.130 55)',
			'on-warning': 'oklch(0.985 0.005 55)',
			error: 'oklch(0.47 0.135 25)',
			'on-error': 'oklch(0.985 0.005 25)',
			info: 'oklch(0.48 0.100 250)',
			'on-info': 'oklch(0.985 0.005 250)',
			up: 'oklch(0.46 0.095 152)',
			'on-up': 'oklch(0.985 0.005 152)',
			down: 'oklch(0.47 0.135 25)',
			'on-down': 'oklch(0.985 0.005 25)'
		},
		variables: {
			bevel: 'oklch(1 0 0 / 0.9)',
			shadow: `0 1px 0 oklch(0.5 0.02 ${h} / 0.12), 0 22px 40px -30px oklch(0.3 0.03 ${h} / 0.5)`
		}
	};
}
