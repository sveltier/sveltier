// Root provider
export { default as UIProvider, type UIProviderProps } from './core/provider/UIProvider.svelte';

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
	ROUNDED,
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
export type { ElementProps } from './core/props/element.js';

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

// Locale
export {
	MESSAGES,
	useLocale,
	type LocaleInstance,
	type LocaleOptions,
	type MessageKey,
	type Messages
} from './core/locale/locale.js';

// Errors
export { ERROR_CODES, type ErrorCode, type ErrorEntry } from './core/errors/codes.js';

// Forms: validation types shared by every form control
export type { FieldError, Rule, ValidateOn } from './core/form/types.js';

// Primitives: focus
export { focusTrap, type FocusTrapOptions } from './primitives/focus/focus-trap.js';
export { rovingFocus, type RovingFocusOptions } from './primitives/focus/roving-focus.js';
export { isTabbable, tabbable, type FocusableElement } from './primitives/focus/tabbable.js';

// Primitives: layers
export {
	dismissable,
	type DismissableOptions,
	type DismissReason
} from './primitives/layer/dismissable.js';

// Primitives: portal and modality
export { default as Portal, type PortalProps } from './primitives/portal/Portal.svelte';
export { inertOthers } from './primitives/inert/inert-others.js';
export { scrollLock } from './primitives/scroll-lock/scroll-lock.js';

// Primitives: positioning
export {
	anchored,
	type Align,
	type AnchoredOptions,
	type Side
} from './primitives/anchored/anchored.js';

// Primitives: keyboard
export { combination, keymap, type KeyHandler } from './primitives/keyboard/keymap.js';
export { typeahead, type TypeaheadOptions } from './primitives/keyboard/typeahead.js';

// Primitives: motion
export { cubicBezier } from './primitives/motion/easing.js';
export {
	easing,
	fade,
	motion,
	pop,
	rise,
	spring,
	SPRINGS,
	type Motion,
	type SpringPreset,
	type TransitionOptions
} from './primitives/motion/motion.js';

// Primitives: virtual lists
export {
	virtualList,
	type ScrollToIndexOptions,
	type VirtualItem,
	type VirtualKey,
	type VirtualList,
	type VirtualListOptions
} from './primitives/virtual/virtual-list.svelte.js';

// Components
export { Alert, type AlertDefaults, type AlertProps } from './components/Alert/index.js';
export { Avatar, type AvatarDefaults, type AvatarProps } from './components/Avatar/index.js';
export { Badge, type BadgeDefaults, type BadgeProps } from './components/Badge/index.js';
export { Button, type ButtonDefaults, type ButtonProps } from './components/Button/index.js';
export {
	ButtonGroup,
	type ButtonGroupDefaults,
	type ButtonGroupProps
} from './components/ButtonGroup/index.js';
export { Card, type CardDefaults, type CardProps } from './components/Card/index.js';
export { Chip, type ChipDefaults, type ChipProps } from './components/Chip/index.js';
export { Divider, type DividerProps } from './components/Divider/index.js';
export {
	Field,
	FIELD_VARIANTS,
	type FieldContentProps,
	type FieldControlAttributes,
	type FieldDefaults,
	type FieldProps,
	type FieldVariant
} from './components/Field/index.js';
export { Form, type FormProps } from './components/Form/index.js';
export { Icon, type IconProps } from './components/Icon/index.js';
export {
	List,
	ListItem,
	type ListDefaults,
	type ListItemProps,
	type ListProps
} from './components/List/index.js';
export {
	NativeSelect,
	type NativeSelectDefaults,
	type NativeSelectOption,
	type NativeSelectProps
} from './components/NativeSelect/index.js';
export {
	NumberField,
	type NumberFieldDefaults,
	type NumberFieldProps
} from './components/NumberField/index.js';
export {
	ProgressCircular,
	ProgressLinear,
	type ProgressCircularDefaults,
	type ProgressCircularProps,
	type ProgressLinearDefaults,
	type ProgressLinearProps
} from './components/Progress/index.js';
export {
	SegmentedControl,
	type SegmentedControlDefaults,
	type SegmentedControlOption,
	type SegmentedControlProps
} from './components/SegmentedControl/index.js';
export { Skeleton, type SkeletonProps } from './components/Skeleton/index.js';
export { Tabs, type TabsDefaults, type TabsItem, type TabsProps } from './components/Tabs/index.js';
export {
	Textarea,
	type TextareaDefaults,
	type TextareaProps
} from './components/Textarea/index.js';
export {
	TextField,
	type TextFieldDefaults,
	type TextFieldProps,
	type TextFieldType
} from './components/TextField/index.js';
