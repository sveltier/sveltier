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

export interface ThemeDefinition {
	/** Dark themes set `color-scheme: dark` and are the `dark` target of "system". */
	dark: boolean;
	/** Emitted as `--sv-color-<name>`, and `on-<name>` keys as `--sv-on-<name>`. */
	colors: ThemeColors;
	/** Extra custom properties, emitted as `--sv-<name>` (for example `bevel`, `shadow`). */
	variables: Record<string, string | number>;
}

/** Partial theme accepted by `defineTheme()`; missing values come from the base theme. */
export interface ThemeInput {
	dark?: boolean;
	colors?: Partial<ThemeColors>;
	variables?: Record<string, string | number>;
}

/** A user choice: a theme name, or "system" to follow `prefers-color-scheme`. */
export type ThemeChoice = 'system' | (string & {});
