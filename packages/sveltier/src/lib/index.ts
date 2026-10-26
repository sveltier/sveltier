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

// Built-in themes, also importable one by one from '@sveltier/ui/themes/<name>'
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
	SPACES,
	VARIANTS,
	type Color,
	type CustomColors,
	type Density,
	type Rounded,
	type SharedProps,
	type Size,
	type Space,
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
export type { NumberStep, StepBand } from './core/form/number.js';

// Overlays: what an overlay hands to the control that opens it
export { CLOSE_REASONS, type CloseReason, type TriggerAttributes } from './core/overlay/types.js';

// Toasts
export {
	default as ToastProvider,
	type ToastProviderProps
} from './core/toast/ToastProvider.svelte';
export {
	useToast,
	type ToastAction,
	type ToastDefaults,
	type ToastInstance,
	type ToastOptions
} from './core/toast/toast.svelte.js';

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
export {
	Accordion,
	type AccordionDefaults,
	type AccordionItem,
	type AccordionProps
} from './components/Accordion/index.js';
export { Alert, type AlertDefaults, type AlertProps } from './components/Alert/index.js';
export { Amount, type AmountDefaults, type AmountProps } from './components/Amount/index.js';
export { AmountInput, type AmountInputProps } from './components/AmountInput/index.js';
export {
	AppBar,
	AppLayout,
	Main,
	NavigationDrawer,
	type AppBarDefaults,
	type AppBarProps,
	type AppLayoutProps,
	type MainProps,
	type NavigationDrawerProps
} from './components/AppLayout/index.js';
export { Avatar, type AvatarDefaults, type AvatarProps } from './components/Avatar/index.js';
export { Badge, type BadgeDefaults, type BadgeProps } from './components/Badge/index.js';
export {
	Breadcrumbs,
	type BreadcrumbsItem,
	type BreadcrumbsProps
} from './components/Breadcrumbs/index.js';
export { Button, type ButtonDefaults, type ButtonProps } from './components/Button/index.js';
export {
	ButtonGroup,
	type ButtonGroupDefaults,
	type ButtonGroupProps
} from './components/ButtonGroup/index.js';
export { Card, type CardDefaults, type CardProps } from './components/Card/index.js';
export {
	Checkbox,
	type CheckboxDefaults,
	type CheckboxProps
} from './components/Checkbox/index.js';
export { Chip, type ChipDefaults, type ChipProps } from './components/Chip/index.js';
export { Delta, type DeltaDefaults, type DeltaProps } from './components/Delta/index.js';
export { Dialog, type DialogDefaults, type DialogProps } from './components/Dialog/index.js';
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
export {
	Col,
	COLUMN_SPANS,
	Container,
	ROW_ALIGNS,
	ROW_JUSTIFIES,
	Row,
	type ColProps,
	type ColumnSpan,
	type ContainerDefaults,
	type ContainerProps,
	type RowAlign,
	type RowDefaults,
	type RowJustify,
	type RowProps
} from './components/Grid/index.js';
export { Icon, type IconProps } from './components/Icon/index.js';
export {
	List,
	ListItem,
	type ListDefaults,
	type ListItemProps,
	type ListProps
} from './components/List/index.js';
export {
	Menu,
	type MenuAction,
	type MenuDefaults,
	type MenuHeading,
	type MenuItem,
	type MenuProps,
	type MenuSeparator
} from './components/Menu/index.js';
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
	Pagination,
	type PaginationDefaults,
	type PaginationProps
} from './components/Pagination/index.js';
export { Popover, type PopoverDefaults, type PopoverProps } from './components/Popover/index.js';
export { PriceInput, type PriceInputProps } from './components/PriceInput/index.js';
export {
	ProgressCircular,
	ProgressLinear,
	type ProgressCircularDefaults,
	type ProgressCircularProps,
	type ProgressLinearDefaults,
	type ProgressLinearProps
} from './components/Progress/index.js';
export {
	RadioGroup,
	type RadioGroupDefaults,
	type RadioGroupOption,
	type RadioGroupProps
} from './components/RadioGroup/index.js';
export {
	Select,
	type SelectDefaults,
	type SelectItem,
	type SelectProps
} from './components/Select/index.js';
export {
	SegmentedControl,
	type SegmentedControlDefaults,
	type SegmentedControlOption,
	type SegmentedControlProps
} from './components/SegmentedControl/index.js';
export {
	Sheet,
	SHEET_SIDES,
	type SheetDefaults,
	type SheetProps,
	type SheetSide
} from './components/Sheet/index.js';
export { Skeleton, type SkeletonProps } from './components/Skeleton/index.js';
export {
	Slider,
	type SliderDefaults,
	type SliderProps,
	type SliderTick
} from './components/Slider/index.js';
export { Switch, type SwitchDefaults, type SwitchProps } from './components/Switch/index.js';
export {
	SORT_DIRECTIONS,
	Table,
	TABLE_ALIGNS,
	type SortDirection,
	type TableAlign,
	type TableColumn,
	type TableColumnBase,
	type TableDefaults,
	type TableKeyColumn,
	type TableProps,
	type TableSort,
	type TableValueColumn
} from './components/Table/index.js';
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
export { Tooltip, type TooltipDefaults, type TooltipProps } from './components/Tooltip/index.js';
