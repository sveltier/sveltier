import { createContext } from 'svelte';
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

const [get, set, has] = createContext<ThemeInstance>();

export { has as hasThemeContext, set as setThemeContext };

/** Returns the nearest theme. Must be called during component initialisation. */
export function useTheme(): ThemeInstance {
	if (!has()) throw new Error('useTheme() must be called inside a <ThemeProvider>.');
	return get();
}
