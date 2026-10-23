import { onColor } from './color.js';
import { NEUTRAL_COLORS, type ThemeColors, type ThemeDefinition } from './types.js';

const NEUTRAL = new Set<string>(NEUTRAL_COLORS);

/**
 * Returns a copy of the theme where every non-neutral colour without an explicit `on-`
 * colour gets a computed one (a deep ink or a near-white, whichever contrasts more).
 */
export function withOnColors(theme: ThemeDefinition): ThemeDefinition {
	const colors: ThemeColors = { ...theme.colors };
	for (const [name, value] of Object.entries(theme.colors)) {
		if (NEUTRAL.has(name) || name.startsWith('on-') || colors[`on-${name}`]) continue;
		const on = onColor(value);
		if (on) colors[`on-${name}`] = on;
	}
	return { ...theme, colors };
}
