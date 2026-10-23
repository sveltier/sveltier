// The shared prop vocabulary. Every component that has one of these props uses exactly
// these names and these values.

import type { IntentColor } from '../theme/types.js';

/** How tightly a component packs its content. `default` is the baseline. */
export const DENSITIES = ['compact', 'default', 'comfortable'] as const;
export type Density = (typeof DENSITIES)[number];

/** Overall scale of a component. `md` is the baseline. */
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Size = (typeof SIZES)[number];

/** Visual weight: filled, tinted, outlined, text only, or no decoration at all. */
export const VARIANTS = ['flat', 'tonal', 'outlined', 'text', 'plain'] as const;
export type Variant = (typeof VARIANTS)[number];

/**
 * Corner rounding. `true` keeps the theme's radius, `false` / `'none'` removes it,
 * `sm`–`xl` pick a theme radius, `'full'` makes a pill whatever the theme.
 */
export type Rounded = boolean | 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * A theme colour name: an intent, `neutral` (text on surface), or a custom colour added
 * with `defineTheme()`.
 */
export type Color = IntentColor | 'neutral' | (string & {});

/** Props shared by every component that supports them. */
export interface SharedProps {
	variant?: Variant;
	density?: Density;
	size?: Size;
	color?: Color;
	rounded?: Rounded;
	disabled?: boolean;
	loading?: boolean;
}
