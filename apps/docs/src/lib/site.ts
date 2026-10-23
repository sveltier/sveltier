import { bone, champagne, ink, verdigris, type ThemeDefinition } from 'sveltier';

export const ACCENTS = { champagne, verdigris } as const;
export type AccentName = keyof typeof ACCENTS;
export type Mode = 'ink' | 'bone';

/**
 * The docs register every base × accent combination, so an explicit choice such as
 * "bone-verdigris" is remembered and restored without a flash.
 */
export const THEMES: Record<string, ThemeDefinition> = {
	'ink-champagne': ink(champagne),
	'bone-champagne': bone(champagne),
	'ink-verdigris': ink(verdigris),
	'bone-verdigris': bone(verdigris)
};

export const COMBOS: Array<{ name: string; mode: Mode; accent: AccentName; label: string }> = [
	{ name: 'ink-champagne', mode: 'ink', accent: 'champagne', label: 'Ink · Champagne' },
	{ name: 'bone-champagne', mode: 'bone', accent: 'champagne', label: 'Bone · Champagne' },
	{ name: 'ink-verdigris', mode: 'ink', accent: 'verdigris', label: 'Ink · Verdigris' },
	{ name: 'bone-verdigris', mode: 'bone', accent: 'verdigris', label: 'Bone · Verdigris' }
];

/** Splits a theme choice such as "bone-verdigris" into its parts. */
export function parseChoice(choice: string): { mode: Mode | 'system'; accent?: AccentName } {
	if (choice === 'system') return { mode: 'system' };
	const [mode, accent] = choice.split('-') as [Mode, AccentName];
	return { mode, accent };
}
