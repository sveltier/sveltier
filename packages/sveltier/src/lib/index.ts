// Theme engine
export {
	default as ThemeProvider,
	type ThemeProviderProps
} from './core/theme/ThemeProvider.svelte';
export { useTheme, type ThemeInstance } from './core/theme/context.js';
export { defineTheme } from './core/theme/define.js';
export { themeCss, themeScript, type ThemeCssOptions } from './core/theme/css.js';
export { contrast, onColor, parseOklch, type Oklch } from './core/theme/color.js';
export {
	INTENT_COLORS,
	NEUTRAL_COLORS,
	THEME_VARIABLES,
	type IntentColor,
	type NeutralColor,
	type ThemeChoice,
	type ThemeColors,
	type ThemeDefinition,
	type ThemeInput,
	type ThemeVariable,
	type ThemeVariables
} from './core/theme/types.js';

// Built-in themes, also importable one by one from 'sveltier/themes/<name>'
export { monolith, monolithDark, monolithLight } from './themes/monolith.js';
export { heritage, heritageDark, heritageLight } from './themes/heritage.js';
export { aurora, auroraDark, auroraLight } from './themes/aurora.js';
export { maison, maisonDark, maisonLight } from './themes/maison.js';
export { milano, milanoDark, milanoLight } from './themes/milano.js';

// Shared props
export {
	DENSITIES,
	SIZES,
	VARIANTS,
	type Color,
	type CustomColors,
	type Density,
	type Rounded,
	type SharedProps,
	type Size,
	type Variant
} from './core/props/types.js';
export { sharedClasses, type SharedClassProps } from './core/props/classes.js';

// Defaults
export {
	default as DefaultsProvider,
	type DefaultsProviderProps
} from './core/defaults/DefaultsProvider.svelte';
export {
	useDefaults,
	type ComponentDefaults,
	type DefaultsConfig,
	type GlobalDefaults
} from './core/defaults/context.js';

// Display
export {
	BREAKPOINTS,
	useDisplay,
	type Breakpoint,
	type DisplayInstance,
	type DisplayOptions,
	type DisplayThresholds
} from './core/display/display.js';
