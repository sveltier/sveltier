import { bone } from '../../themes/bone.js';
import { ink } from '../../themes/ink.js';
import { withOnColors } from './resolve.js';
import type { ThemeColors, ThemeDefinition, ThemeInput } from './types.js';

/**
 * Builds a complete theme from a partial one. Missing colours and variables come from
 * `base`, or from Ink (dark) / Bone (light) when no base is given. `on-` colours are
 * recomputed for every colour you override, unless you pass them yourself.
 *
 * @example
 * const midnight = defineTheme({ dark: true, colors: { primary: 'oklch(0.78 0.11 260)' } });
 */
export function defineTheme(input: ThemeInput = {}, base?: ThemeDefinition): ThemeDefinition {
	const dark = input.dark ?? base?.dark ?? false;
	const from = base ?? (dark ? ink() : bone());
	const overrides = input.colors ?? {};
	const colors = { ...from.colors } as ThemeColors;
	for (const name of Object.keys(overrides)) delete colors[`on-${name}`];

	return withOnColors({
		dark,
		colors: { ...colors, ...overrides } as ThemeColors,
		variables: { ...from.variables, ...input.variables }
	});
}
