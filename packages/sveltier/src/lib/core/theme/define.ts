import { withOnColors } from './resolve.js';
import type { ThemeColors, ThemeDefinition, ThemeInput } from './types.js';

/**
 * Builds a complete theme from the parts you change over `base`, the theme you extend.
 * Missing colours and variables come from `base`. `on-` colours are recomputed for every
 * colour you override, unless you pass them yourself. `base` is never mutated.
 *
 * @example
 * import { monolithDark } from '@sveltier/ui/themes/monolith';
 * const midnight = defineTheme({ colors: { primary: 'oklch(0.78 0.11 260)' } }, monolithDark);
 */
export function defineTheme(input: ThemeInput, base: ThemeDefinition): ThemeDefinition {
	const overrides = input.colors ?? {};
	const colors = { ...base.colors } as ThemeColors;
	for (const name of Object.keys(overrides)) delete colors[`on-${name}`];

	return withOnColors({
		dark: input.dark ?? base.dark,
		colors: { ...colors, ...overrides } as ThemeColors,
		variables: { ...base.variables, ...input.variables }
	});
}
