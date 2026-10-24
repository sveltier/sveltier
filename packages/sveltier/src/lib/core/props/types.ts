// The shared prop vocabulary. Every component that has one of these props uses exactly
// these names and these values.

import type { IntentColor } from '../theme/types.js';

/** How tightly a component packs its content. `default` is the baseline. */
export const DENSITIES = ['compact', 'default', 'comfortable'] as const;
export type Density = (typeof DENSITIES)[number];

/** Overall scale of a component. `md` is the baseline. */
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Size = (typeof SIZES)[number];

/**
 * Visual weight: a raised surface, filled, tinted, outlined, text only, or no decoration at
 * all.
 */
export const VARIANTS = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const;
export type Variant = (typeof VARIANTS)[number];

/**
 * Corner rounding. `true` keeps the theme's radius, `false` / `'none'` removes it,
 * `sm`–`xl` pick a theme radius, `'full'` makes a pill whatever the theme.
 */
export const ROUNDED = [true, false, 'none', 'sm', 'md', 'lg', 'xl', 'full'] as const;
// Literal props are read from a const list, so a type error lists the valid values instead of
// the alias name ("Type '"pill"' is not assignable to type 'boolean | "none" | …'").
export type Rounded = (typeof ROUNDED)[number];

/**
 * Custom colours added with `defineTheme()`. Register them here by declaration merging to
 * use them as a component's `color`:
 *
 * @example
 * declare module '@sveltier/ui' {
 *   interface CustomColors {
 *     brand: true;
 *   }
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- extended by declaration merging
export interface CustomColors {}

/**
 * A component's colour: an intent, `neutral` (the text colour, with the background as its
 * on-colour), or a custom colour registered in `CustomColors`.
 */
// The conditional re-creates the union without its alias name, so a type error lists every
// colour, custom ones included, instead of saying only "Color".
export type Color = IntentColor | 'neutral' | Extract<keyof CustomColors, string> extends infer C
	? C
	: never;

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
