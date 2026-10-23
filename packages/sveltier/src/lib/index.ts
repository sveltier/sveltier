export const version = '0.0.0';

// Theme engine
export { defineTheme } from './core/theme/define.js';
export { contrast, onColor, parseOklch, type Oklch } from './core/theme/color.js';
export {
	INTENT_COLORS,
	NEUTRAL_COLORS,
	type IntentColor,
	type NeutralColor,
	type ThemeChoice,
	type ThemeColors,
	type ThemeDefinition,
	type ThemeInput
} from './core/theme/types.js';

// Built-in themes
export { champagne, verdigris, type Accent } from './themes/accents.js';
export { ink } from './themes/ink.js';
export { bone } from './themes/bone.js';
