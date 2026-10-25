/**
 * Size budgets (gzip, Svelte runtime excluded). Each entry is bundled the way a consumer's
 * Vite build would bundle it, then measured by size-limit. `measure` picks what counts:
 * the JS, the CSS, or both (the default). Raise a budget only with a written justification.
 *
 * Global styles (design tokens and document defaults) load once per app, so they have their
 * own budget instead of counting against the core JS. The core imports no theme: theme data
 * counts against the pack budgets.
 */
const packs = ['monolith', 'heritage', 'aurora', 'maison', 'milano'];

/** @type {Array<{ name: string, code: string, limit: string, measure?: 'js' | 'css', external?: RegExp[] }>} */
export default [
	{
		name: 'global styles (tokens and base CSS)',
		code: "import '@sveltier/ui/styles/tokens.css';\nimport '@sveltier/ui/styles/base.css';",
		limit: '1.2 KB',
		measure: 'css'
	},
	{
		// 3.9 KB for theme, defaults, display and locale. UIProvider also brings the toasts (about
		// 2.9 KB: the queue and timers, the outlet with its live regions and keyboard, and the
		// motion it uses), so useToast() works anywhere below it with nothing to add.
		name: 'core JS (UIProvider: theme, defaults, display, locale, toasts)',
		code: "export { UIProvider, ThemeProvider, useTheme, DefaultsProvider, useDefaults, useDisplay, useLocale } from '@sveltier/ui';",
		limit: '7 KB',
		measure: 'js'
	},
	{
		name: 'sharedClasses (with the shared props CSS)',
		code: "export { sharedClasses } from '@sveltier/ui';",
		limit: '1 KB'
	},
	{
		// Includes the full tabbable query (radio groups, positive tabindex, closed details).
		name: 'focusTrap (with tabbable)',
		code: "export { focusTrap } from '@sveltier/ui';",
		limit: '1.2 KB'
	},
	{
		name: 'rovingFocus',
		code: "export { rovingFocus } from '@sveltier/ui';",
		limit: '1 KB'
	},
	{
		name: 'dismissable',
		code: "export { dismissable } from '@sveltier/ui';",
		limit: '0.75 KB'
	},
	{
		name: 'Portal',
		code: "export { Portal } from '@sveltier/ui';",
		limit: '0.85 KB'
	},
	{
		name: 'inertOthers and scrollLock',
		code: "export { inertOthers, scrollLock } from '@sveltier/ui';",
		limit: '0.6 KB'
	},
	{
		// About 0.5 KB of its own; the rest is the bundler's helper for dynamic imports, which an
		// app ships once for all its lazy imports. The fallback is measured below.
		name: 'anchored',
		code: "export { anchored } from '@sveltier/ui';",
		limit: '1.6 KB',
		external: [/fallback\.js$/]
	},
	{
		// Downloaded only by browsers without CSS anchor positioning.
		name: 'anchored fallback',
		code: "export { follow } from '@sveltier/ui/primitives/anchored/fallback.js';",
		limit: '1 KB'
	},
	{
		name: 'keymap and typeahead',
		code: "export { keymap, typeahead } from '@sveltier/ui';",
		limit: '0.8 KB'
	},
	{
		name: 'motion (theme timing, transitions, springs)',
		code: "export { motion, easing, cubicBezier, fade, rise, pop, spring, SPRINGS } from '@sveltier/ui';",
		limit: '1.1 KB'
	},
	{
		// Uniform and measured items, scroll adjustment, and jumps that wait for the viewport and
		// stay on target while the rows around them are measured. Hidden viewports, border-box
		// measurement and observation outside ResizeObserver's delivery add the last 0.3 KB.
		name: 'virtualList',
		code: "export { virtualList } from '@sveltier/ui';",
		limit: '1.8 KB'
	},
	{
		// Shared by every form control: when a message shows, the HTML constraints with their
		// messages, the native validity kept in step, and joining the Form around it.
		name: 'form validation (shared by the form controls)',
		code: "export { createField } from '@sveltier/ui/core/form/field.svelte.js';\nexport { textConstraintMessage } from '@sveltier/ui/core/form/constraints.js';",
		limit: '0.85 KB'
	},
	{
		// A landmark, a list, links or text and the current page (0.65 KB of JS); the separators
		// and the wrapping are CSS (0.4 KB).
		name: 'Breadcrumbs',
		code: "export { Breadcrumbs } from '@sveltier/ui';",
		limit: '1.1 KB',
		external: [/\/core\//]
	},
	{
		// The component's own JS and CSS. The shared modules it uses (shared props, defaults,
		// locale) come with UIProvider or the first component and are measured above. About
		// 1.1 KB of JS (button and link, loading with its message, icon slots) and 0.95 KB of
		// CSS (five variants on one state layer, bevel, spinner): over the first 1.5 KB guess.
		name: 'Button',
		code: "export { Button } from '@sveltier/ui';",
		limit: '2.1 KB',
		external: [/\/core\//]
	},
	{
		// The platform's <details> does the opening, the one-at-a-time group and find in page; its
		// own code keeps the value in step and styles the sections.
		name: 'Accordion',
		code: "export { Accordion } from '@sveltier/ui';",
		limit: '1.8 KB',
		external: [/\/core\//]
	},
	{
		name: 'Alert',
		code: "export { Alert } from '@sveltier/ui';",
		limit: '2 KB',
		external: [/\/core\//]
	},
	{
		// The grid and its placement rules, the skip link, and the bar with its menu button (a
		// Button, measured in its own entry): 1.6 KB of JS and 0.9 KB of CSS.
		name: 'AppLayout, AppBar and Main',
		code: "export { AppLayout, AppBar, Main } from '@sveltier/ui';",
		limit: '2.55 KB',
		external: [/\/core\//, /\/components\/Button\//]
	},
	{
		// The drawer beside the content, the rail, and the modal drawer on the modal shell that
		// Dialog and Sheet share (about 2.6 KB of it, the CSS included), which closes when a link
		// in it leaves the page; the primitives the shell stands on are measured apart.
		name: 'NavigationDrawer',
		code: "export { NavigationDrawer } from '@sveltier/ui';",
		limit: '4 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		name: 'Avatar',
		code: "export { Avatar } from '@sveltier/ui';",
		limit: '1.2 KB',
		external: [/\/core\//]
	},
	{
		// Count, cap, dot and the spoken label; includes the shared visually hidden rule.
		name: 'Badge',
		code: "export { Badge } from '@sveltier/ui';",
		limit: '1.4 KB',
		external: [/\/core\//]
	},
	{
		name: 'ButtonGroup',
		code: "export { ButtonGroup } from '@sveltier/ui';",
		limit: '1 KB',
		external: [/\/core\//]
	},
	{
		name: 'Card',
		code: "export { Card } from '@sveltier/ui';",
		limit: '1.5 KB',
		external: [/\/core\//]
	},
	{
		// Its own code with the label row it shares with Switch: the label, hint and error beside
		// the control. The validation it shares with the other form controls is measured apart.
		name: 'Checkbox',
		code: "export { Checkbox } from '@sveltier/ui';",
		limit: '2.85 KB',
		external: [/\/core\//]
	},
	{
		// A tag, a toggle, an action and a link in one, with a close button and its own state layer.
		name: 'Chip',
		code: "export { Chip } from '@sveltier/ui';",
		limit: '2.3 KB',
		external: [/\/core\//]
	},
	{
		// Its own code, with the outlet that shows toasts inside it while it is open (0.15 KB). The
		// primitives it stands on (focus trap, layer stack, scroll lock, motion) are shared by every
		// overlay and measured in their own entries.
		name: 'Dialog',
		code: "export { Dialog } from '@sveltier/ui';",
		limit: '2.85 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		name: 'Divider',
		code: "export { Divider } from '@sveltier/ui';",
		limit: '0.6 KB',
		external: [/\/core\//]
	},
	{
		// Label, box, hint and error with the ARIA links (1.35 KB of JS), and five variants with
		// their focus and invalid states (1.15 KB of CSS). Every boxed field draws in it. The list
		// of field variants it hands to the development checks adds the last few bytes.
		name: 'Field',
		code: "export { Field } from '@sveltier/ui';",
		limit: '2.55 KB',
		external: [/\/core\//]
	},
	{
		// Submit and reset handling, the field registry and the disabled defaults; the fields
		// themselves are measured in their own entries.
		name: 'Form',
		code: "export { Form } from '@sveltier/ui';",
		limit: '1.1 KB',
		external: [/\/core\//]
	},
	{
		// Twelve columns on a CSS grid: the spans are variables that the media queries read
		// (0.8 KB of JS, 0.5 KB of CSS).
		name: 'Container, Row and Col',
		code: "export { Container, Row, Col } from '@sveltier/ui';",
		limit: '1.4 KB',
		external: [/\/core\//]
	},
	{
		// Most of it is what any Svelte component with rest props costs.
		name: 'Icon',
		code: "export { Icon } from '@sveltier/ui';",
		limit: '1 KB',
		external: [/\/core\//]
	},
	{
		name: 'List and ListItem',
		code: "export { List, ListItem } from '@sveltier/ui';",
		limit: '2 KB',
		external: [/\/core\//]
	},
	{
		name: 'ProgressLinear',
		code: "export { ProgressLinear } from '@sveltier/ui';",
		limit: '1.3 KB',
		external: [/\/core\//]
	},
	{
		name: 'ProgressCircular',
		code: "export { ProgressCircular } from '@sveltier/ui';",
		limit: '1.5 KB',
		external: [/\/core\//]
	},
	{
		// Its own code with the row styles it shares with Checkbox and Switch; the arrow keys are
		// the platform's. The validation is measured apart.
		name: 'RadioGroup',
		code: "export { RadioGroup } from '@sveltier/ui';",
		limit: '2.9 KB',
		external: [/\/core\//]
	},
	{
		// Includes rovingFocus, which gives it one tab stop and arrow keys.
		name: 'SegmentedControl',
		code: "export { SegmentedControl } from '@sveltier/ui';",
		limit: '2.4 KB',
		external: [/\/core\//]
	},
	{
		// The same modal shell as Dialog, against an edge; the primitives are measured apart.
		name: 'Sheet',
		code: "export { Sheet } from '@sveltier/ui';",
		limit: '3.15 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		name: 'Skeleton',
		code: "export { Skeleton } from '@sveltier/ui';",
		limit: '1.2 KB',
		external: [/\/core\//]
	},
	{
		// Its own code: the label row with the value, the range styled for both engine families and
		// the ticks. The validation is measured apart.
		name: 'Slider',
		code: "export { Slider } from '@sveltier/ui';",
		limit: '3 KB',
		external: [/\/core\//]
	},
	{
		// Its own code with the label row it shares with Checkbox; the validation is measured apart.
		name: 'Switch',
		code: "export { Switch } from '@sveltier/ui';",
		limit: '2.7 KB',
		external: [/\/core\//]
	},
	{
		// Includes rovingFocus, which gives the tab list one tab stop and arrow keys.
		name: 'Tabs',
		code: "export { Tabs } from '@sveltier/ui';",
		limit: '2.4 KB',
		external: [/\/core\//]
	},
	{
		// Its own code: the Intl options with defaults that keep the data, the runs with a true
		// minus and a dimmed fraction, masking, and the flash on the Web Animations API. The
		// locale's cached formatters and the motion timing are core and primitives.
		name: 'Amount',
		code: "export { Amount } from '@sveltier/ui';",
		limit: '1.75 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		// Its own code: the direction, its colour and the arrow. The figure is an Amount,
		// measured in its own entry.
		name: 'Delta',
		code: "export { Delta } from '@sveltier/ui';",
		limit: '1.05 KB',
		external: [/\/core\//, /\/components\/Amount\//]
	},
	{
		// Its own code: the columns, their alignment, the sort with its comparator and the scroll
		// region (2.45 KB of JS), and 1.2 KB of CSS (sticky header, sort arrow, current row,
		// loading bar). The locale and the shared props are core, measured apart.
		name: 'Table',
		code: "export { Table } from '@sveltier/ui';",
		limit: '3.7 KB',
		external: [/\/core\//]
	},
	{
		// Its own code: the options with the placeholder and the reset target, and the arrow, an
		// inline SVG mask in the CSS. The Field and the shared validation are measured apart.
		name: 'NativeSelect',
		code: "export { NativeSelect } from '@sveltier/ui';",
		limit: '1.8 KB',
		external: [/\/core\//, /\/components\/Field\//]
	},
	{
		// Parsing in the locale with its range and step checks (about 0.5 KB), stepping by keys and
		// buttons on the step grid, two named buttons, and the hidden input that submits the plain
		// number (2.6 KB of JS, 0.6 KB of CSS). The Field and the shared validation are measured apart.
		name: 'NumberField',
		code: "export { NumberField } from '@sveltier/ui';",
		limit: '3.3 KB',
		external: [/\/core\/(?!form\/number)/, /\/components\/Field\//]
	},
	{
		// Its own code, with the growing fallback for browsers without field-sizing, and the radius
		// cap that keeps it from turning oval in a theme with pill controls (about 20 B). The Field
		// and the shared validation are measured in their own entries.
		name: 'Textarea',
		code: "export { Textarea } from '@sveltier/ui';",
		limit: '1.55 KB',
		external: [/\/core\//, /\/components\/Field\//]
	},
	{
		// Its own code. The Field it draws in and the validation it shares with the other form
		// controls are measured in their own entries.
		name: 'TextField',
		code: "export { TextField } from '@sveltier/ui';",
		limit: '1.1 KB',
		external: [/\/core\//, /\/components\/Field\//]
	},
	{
		// Its own code: the entries grouped under their headings (2 KB of JS, most of it the compiled
		// rows with their icon and shortcut), the trigger's arrow keys, choosing and closing, and
		// 0.8 KB of CSS. Roving focus, typeahead, placement, the layer stack and the motion are
		// primitives, measured apart.
		name: 'Menu',
		code: "export { Menu } from '@sveltier/ui';",
		limit: '2.9 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		// Its own code: which numbers show, the steps, and two Buttons with their props each (1.55
		// KB of JS), and 0.4 KB of CSS. The Buttons themselves are measured in their own entry.
		name: 'Pagination',
		code: "export { Pagination } from '@sveltier/ui';",
		limit: '2 KB',
		external: [/\/core\//, /\/components\/Button\//]
	},
	{
		// Its own code: the trigger wiring, focus in and back, and the panel with its widths. The
		// placement, the layer stack and the motion are primitives, measured apart.
		name: 'Popover',
		code: "export { Popover } from '@sveltier/ui';",
		limit: '2 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		// useToast and ToastProvider with the outlet: the queue, its timers and announcements, the
		// region with its live regions, F8 and Escape, and the styles. UIProvider includes it, so it
		// also counts in the core budget above. The motion primitives are measured apart.
		name: 'Toast (useToast, ToastProvider)',
		code: "export { useToast, ToastProvider } from '@sveltier/ui';",
		limit: '3.75 KB',
		external: [/\/core\/(?!toast\/)/, /\/primitives\//]
	},
	{
		// Its own code: hover with its delay and grace, focus, the toolbar warm-up and the CSS fade.
		// Placement and the layer stack are primitives, measured apart.
		name: 'Tooltip',
		code: "export { Tooltip } from '@sveltier/ui';",
		limit: '1.65 KB',
		external: [/\/core\//, /\/primitives\//]
	},
	{
		name: 'defineTheme (custom themes, adds the colour maths)',
		code: "export { defineTheme } from '@sveltier/ui';",
		limit: '1 KB'
	},
	...packs.map((pack) => ({
		name: `theme pack: ${pack}`,
		code: `export { ${pack} } from '@sveltier/ui/themes/${pack}';`,
		limit: '1 KB'
	})),
	{
		// A guard against accidental growth of the barrel: all five packs (about 4.5 KB) plus
		// the engine, the shared props CSS, locale, the primitives, the components, the form
		// fields, the error registry (about 1.3 KB of text, which apps only load if they import
		// it) and the bundler's dynamic import helper. It grows with every module by design.
		name: 'index (everything)',
		code: "export * from '@sveltier/ui';",
		external: [/fallback\.js$/],
		limit: '53 KB'
	}
];
