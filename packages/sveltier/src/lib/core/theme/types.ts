/** Neutral roles: page, surfaces, rules and text. They have no `on-` colour. */
export const NEUTRAL_COLORS = [
	'background',
	'surface',
	'surface-raised',
	'border',
	'border-soft',
	'border-strong',
	'text',
	'text-muted',
	'text-subtle'
] as const;

/**
 * Intent colours, usable as a component's `color`. Each gets an `on-` colour for text on a
 * filled background. `up` / `down` are price direction and are kept separate from
 * `success` / `error`, because some markets show rising prices in red.
 */
export const INTENT_COLORS = [
	'primary',
	'success',
	'warning',
	'error',
	'info',
	'up',
	'down'
] as const;

export type NeutralColor = (typeof NEUTRAL_COLORS)[number];
export type IntentColor = (typeof INTENT_COLORS)[number];

/** Every colour value is an `oklch()` string. */
export type ThemeColors = Record<NeutralColor | IntentColor, string> &
	Partial<Record<`on-${IntentColor}`, string>> &
	Record<string, string>;

/**
 * The theme contract: every theme sets all of these, so one theme switch restyles type,
 * shape, depth and motion as well as colour. Emitted as `--sv-<name>`.
 */
export const THEME_VARIABLES = [
	// Type
	'font-display',
	'font-ui',
	'font-data',
	'weight-display',
	'tracking-display',
	'label-size',
	'label-transform',
	'label-tracking',
	'button-transform',
	'button-tracking',
	// Shape
	'radius-sm',
	'radius-md',
	'radius-lg',
	'radius-xl',
	'radius-full',
	// Depth
	'surface-alpha',
	'surface-blur',
	'backdrop',
	'ornament',
	'bevel',
	'shadow',
	// Motion (collapsed to near zero when the user prefers reduced motion)
	'ease',
	'duration-fast',
	'duration-normal',
	'duration-slow'
] as const;

export type ThemeVariable = (typeof THEME_VARIABLES)[number];
export type ThemeVariables = Record<ThemeVariable, string | number>;

export interface ThemeDefinition {
	/** Dark themes set `color-scheme: dark` and are the `dark` target of "system". */
	dark: boolean;
	/** Emitted as `--sv-color-<name>`, and `on-<name>` keys as `--sv-on-<name>`. */
	colors: ThemeColors;
	/** The theme contract plus any extra custom properties, emitted as `--sv-<name>`. */
	variables: ThemeVariables & Record<string, string | number>;
}

/** Partial theme accepted by `defineTheme()`; missing values come from the base theme. */
export interface ThemeInput {
	dark?: boolean;
	colors?: Partial<ThemeColors>;
	variables?: Partial<ThemeVariables> & Record<string, string | number>;
}

/** A user choice: a theme name, or "system" to follow `prefers-color-scheme`. */
export type ThemeChoice = 'system' | (string & {});
