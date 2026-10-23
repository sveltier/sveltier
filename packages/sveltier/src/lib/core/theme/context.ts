import { getContext, hasContext, setContext } from 'svelte';
import type { ThemeChoice, ThemeDefinition } from './types.js';

/** The nearest `<ThemeProvider>`, as seen by `useTheme()`. All fields are reactive. */
export interface ThemeInstance {
	/** "system" or a theme name. */
	readonly choice: ThemeChoice;
	/**
	 * The theme in effect. With "system" it follows `prefers-color-scheme`; during server
	 * rendering, where the preference is unknown, it is the `light` theme.
	 */
	readonly name: string;
	readonly current: ThemeDefinition;
	readonly isDark: boolean;
	readonly themes: Readonly<Record<string, ThemeDefinition>>;
	/** Theme names that "system" and `toggle()` switch between. */
	readonly light: string;
	readonly dark: string;
	/** Selects a theme name or "system". The root provider remembers it. */
	set(choice: ThemeChoice): void;
	/** Switches between the `light` and `dark` themes. */
	toggle(): void;
}

// A private symbol key instead of createContext(): its `has` function only exists from
// Svelte 5.57, and the supported range starts at 5.40.
const KEY = Symbol('sveltier.theme');

export const hasThemeContext = (): boolean => hasContext(KEY);
export const setThemeContext = (theme: ThemeInstance): ThemeInstance => setContext(KEY, theme);

/** Returns the nearest theme. Must be called during component initialisation. */
export function useTheme(): ThemeInstance {
	if (!hasContext(KEY))
		throw new Error('[sveltier] useTheme() must be called inside a <ThemeProvider>.');
	return getContext<ThemeInstance>(KEY);
}
