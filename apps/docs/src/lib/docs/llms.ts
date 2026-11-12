// The docs for AI agents: llms.txt (an index) and llms-full.txt (the reference), in the
// llms.txt format. Built on the server from the same sources as the pages: the navigation,
// the code samples, and the API tables and descriptions generated from the package's types.
import { ERROR_CODES } from '@sveltier/ui';
import { descriptions, tables } from 'virtual:sveltier-api';
import {
	accordionUsage,
	alertUsage,
	avatarUsage,
	badgeUsage,
	breadcrumbsUsage,
	buttonGroupUsage,
	buttonUsage,
	cardUsage,
	chipFilter,
	dividerUsage,
	iconUsage,
	listUsage,
	paginationLinks,
	progressUsage,
	segmentedUsage,
	skeletonUsage,
	stepperUsage,
	tableColumns,
	tabsUsage,
	timelineUsage,
	treeUsage
} from '#lib/snippets/components.js';
import {
	checkboxUsage,
	calendarUsage,
	comboboxUsage,
	datePickerTradingDays,
	dateRangeUsage,
	fieldUsage,
	formSvelteKit,
	nativeSelectUsage,
	numberFieldUsage,
	otpInputUsage,
	selectUsage,
	radioGroupUsage,
	sliderUsage,
	switchUsage,
	textareaUsage,
	fileFieldUsage,
	textFieldValidation,
	timeFieldUsage,
	dateTimeFieldUsage
} from '#lib/snippets/forms.js';
import {
	amountInputUsage,
	amountUsage,
	deltaUsage,
	guillocheUsage,
	ledgerUsage,
	odometerUsage,
	pinPadUsage,
	priceInputUsage,
	receiptUsage,
	secureMaskUsage
} from '#lib/snippets/finance.js';
import {
	commandPaletteUsage,
	contextMenuUsage,
	dialogUsage,
	menuUsage,
	popoverUsage,
	sheetUsage,
	toastUsage,
	tooltipUsage
} from '#lib/snippets/overlays.js';
import { appLayoutUsage, gridUsage } from '#lib/snippets/layout.js';
import { install, setup } from '#lib/snippets/theme.js';
import type { ApiRow } from './api.js';
import { NAV } from './nav.js';

interface Entry {
	name: string;
	/** Docs path, as in the navigation. */
	path: string;
	/** Exported types whose tables document it. */
	types: string[];
	example?: string;
}

const LAYOUT: Entry[] = [
	{
		name: 'AppLayout, AppBar, NavigationDrawer, Main and AppFooter',
		path: 'layout/app-layout',
		types: [
			'AppLayoutProps',
			'AppBarProps',
			'NavigationDrawerProps',
			'MainProps',
			'AppFooterProps'
		],
		example: appLayoutUsage
	},
	{
		name: 'Container, Row and Col',
		path: 'layout/grid',
		types: ['RowProps', 'ColProps', 'ContainerProps'],
		example: gridUsage
	}
];

const COMPONENTS: Entry[] = [
	{
		name: 'Accordion',
		path: 'components/accordion',
		types: ['AccordionProps', 'AccordionItem'],
		example: accordionUsage
	},
	{ name: 'Alert', path: 'components/alert', types: ['AlertProps'], example: alertUsage },
	{ name: 'Avatar', path: 'components/avatar', types: ['AvatarProps'], example: avatarUsage },
	{ name: 'Badge', path: 'components/badge', types: ['BadgeProps'], example: badgeUsage },
	{
		name: 'Breadcrumbs',
		path: 'components/breadcrumbs',
		types: ['BreadcrumbsProps', 'BreadcrumbsItem'],
		example: breadcrumbsUsage
	},
	{ name: 'Button', path: 'components/button', types: ['ButtonProps'], example: buttonUsage },
	{
		name: 'ButtonGroup',
		path: 'components/button-group',
		types: ['ButtonGroupProps'],
		example: buttonGroupUsage
	},
	{ name: 'Card', path: 'components/card', types: ['CardProps'], example: cardUsage },
	{ name: 'Chip', path: 'components/chip', types: ['ChipProps'], example: chipFilter },
	{ name: 'Divider', path: 'components/divider', types: ['DividerProps'], example: dividerUsage },
	{ name: 'Icon', path: 'components/icon', types: ['IconProps'], example: iconUsage },
	{
		name: 'List and ListItem',
		path: 'components/list',
		types: ['ListProps', 'ListItemProps'],
		example: listUsage
	},
	{
		name: 'Pagination',
		path: 'components/pagination',
		types: ['PaginationProps'],
		example: paginationLinks
	},
	{
		name: 'ProgressLinear and ProgressCircular',
		path: 'components/progress',
		types: ['ProgressLinearProps', 'ProgressCircularProps'],
		example: progressUsage
	},
	{
		name: 'SegmentedControl',
		path: 'components/segmented-control',
		types: ['SegmentedControlProps'],
		example: segmentedUsage
	},
	{
		name: 'Skeleton',
		path: 'components/skeleton',
		types: ['SkeletonProps'],
		example: skeletonUsage
	},
	{
		name: 'Stepper',
		path: 'components/stepper',
		types: ['StepperProps', 'StepperItem'],
		example: stepperUsage
	},
	{
		name: 'Table',
		path: 'components/table',
		types: ['TableProps', 'TableColumnBase'],
		example: tableColumns
	},
	{ name: 'Tabs', path: 'components/tabs', types: ['TabsProps'], example: tabsUsage },
	{
		name: 'Timeline',
		path: 'components/timeline',
		types: ['TimelineProps', 'TimelineItem'],
		example: timelineUsage
	},
	{ name: 'Tree', path: 'components/tree', types: ['TreeProps', 'TreeItem'], example: treeUsage }
];

const FORMS: Entry[] = [
	{ name: 'Form', path: 'forms/form', types: ['FormProps'], example: formSvelteKit },
	{
		name: 'TextField',
		path: 'forms/text-field',
		types: ['TextFieldProps'],
		example: textFieldValidation
	},
	{ name: 'Textarea', path: 'forms/textarea', types: ['TextareaProps'], example: textareaUsage },
	{
		name: 'FileField',
		path: 'forms/file-field',
		types: ['FileFieldProps'],
		example: fileFieldUsage
	},
	{
		name: 'NumberField',
		path: 'forms/number-field',
		types: ['NumberFieldProps'],
		example: numberFieldUsage
	},
	{
		name: 'NativeSelect',
		path: 'forms/native-select',
		types: ['NativeSelectProps'],
		example: nativeSelectUsage
	},
	{
		name: 'Select',
		path: 'forms/select',
		types: ['SelectProps', 'SelectOption'],
		example: selectUsage
	},
	{
		name: 'Combobox',
		path: 'forms/combobox',
		types: ['ComboboxProps'],
		example: comboboxUsage
	},
	{
		name: 'DatePicker',
		path: 'forms/date-picker',
		types: ['DatePickerProps', 'DateLimits'],
		example: datePickerTradingDays
	},
	{
		name: 'DateRangePicker',
		path: 'forms/date-range-picker',
		types: ['DateRangePickerProps'],
		example: dateRangeUsage
	},
	{ name: 'Calendar', path: 'forms/calendar', types: ['CalendarProps'], example: calendarUsage },
	{
		name: 'TimeField',
		path: 'forms/time-field',
		types: ['TimeFieldProps'],
		example: timeFieldUsage
	},
	{
		name: 'DateTimeField',
		path: 'forms/date-time-field',
		types: ['DateTimeFieldProps'],
		example: dateTimeFieldUsage
	},
	{
		name: 'OtpInput',
		path: 'forms/otp-input',
		types: ['OtpInputProps'],
		example: otpInputUsage
	},
	{ name: 'Checkbox', path: 'forms/checkbox', types: ['CheckboxProps'], example: checkboxUsage },
	{ name: 'Switch', path: 'forms/switch', types: ['SwitchProps'], example: switchUsage },
	{
		name: 'RadioGroup',
		path: 'forms/radio-group',
		types: ['RadioGroupProps', 'RadioGroupOption'],
		example: radioGroupUsage
	},
	{
		name: 'Slider',
		path: 'forms/slider',
		types: ['SliderProps', 'SliderTick'],
		example: sliderUsage
	},
	{
		name: 'Field',
		path: 'forms/field',
		types: ['FieldProps', 'FieldControlAttributes'],
		example: fieldUsage
	}
];

const OVERLAYS: Entry[] = [
	{
		name: 'Dialog',
		path: 'overlays/dialog',
		types: ['DialogProps', 'TriggerAttributes'],
		example: dialogUsage
	},
	{ name: 'Sheet', path: 'overlays/sheet', types: ['SheetProps'], example: sheetUsage },
	{ name: 'Popover', path: 'overlays/popover', types: ['PopoverProps'], example: popoverUsage },
	{
		name: 'Menu',
		path: 'overlays/menu',
		types: ['MenuProps', 'MenuAction'],
		example: menuUsage
	},
	{
		name: 'ContextMenu',
		path: 'overlays/context-menu',
		types: ['ContextMenuProps'],
		example: contextMenuUsage
	},
	{
		name: 'CommandPalette',
		path: 'overlays/command-palette',
		types: ['CommandPaletteProps', 'CommandItem'],
		example: commandPaletteUsage
	},
	{ name: 'Tooltip', path: 'overlays/tooltip', types: ['TooltipProps'], example: tooltipUsage },
	{
		name: 'Toast (useToast)',
		path: 'overlays/toast',
		types: ['ToastInstance', 'ToastOptions', 'ToastAction', 'ToastDefaults'],
		example: toastUsage
	}
];

const FINANCE: Entry[] = [
	{
		name: 'Amount',
		path: 'finance/amount',
		types: ['AmountProps', 'AmountDefaults'],
		example: amountUsage
	},
	{ name: 'Delta', path: 'finance/delta', types: ['DeltaProps'], example: deltaUsage },
	{
		name: 'PriceInput',
		path: 'finance/price-input',
		types: ['PriceInputProps', 'StepBand'],
		example: priceInputUsage
	},
	{
		name: 'AmountInput',
		path: 'finance/amount-input',
		types: ['AmountInputProps'],
		example: amountInputUsage
	},
	{
		name: 'Guilloche',
		path: 'finance/guilloche',
		types: ['GuillocheProps'],
		example: guillocheUsage
	},
	{
		name: 'Ledger',
		path: 'finance/ledger',
		types: ['LedgerProps', 'LedgerRowProps'],
		example: ledgerUsage
	},
	{
		name: 'Odometer',
		path: 'finance/odometer',
		types: ['OdometerProps'],
		example: odometerUsage
	},
	{
		name: 'PinPad',
		path: 'finance/pin-pad',
		types: ['PinPadProps'],
		example: pinPadUsage
	},
	{
		name: 'Receipt',
		path: 'finance/receipt',
		types: ['ReceiptProps'],
		example: receiptUsage
	},
	{
		name: 'SecureMask',
		path: 'finance/secure-mask',
		types: ['SecureMaskProps'],
		example: secureMaskUsage
	}
];

const PRIMITIVES: Entry[] = [
	{ name: 'focusTrap', path: 'primitives/focus', types: ['FocusTrapOptions'] },
	{ name: 'rovingFocus', path: 'primitives/focus', types: ['RovingFocusOptions'] },
	{ name: 'dismissable', path: 'primitives/layers', types: ['DismissableOptions'] },
	{ name: 'Portal', path: 'primitives/modality', types: ['PortalProps'] },
	{ name: 'anchored', path: 'primitives/positioning', types: ['AnchoredOptions'] },
	{ name: 'typeahead', path: 'primitives/keyboard', types: ['TypeaheadOptions'] },
	{ name: 'Motion transitions', path: 'primitives/motion', types: ['TransitionOptions'] },
	{
		name: 'virtualList',
		path: 'primitives/virtual-lists',
		types: ['VirtualListOptions', 'VirtualList']
	}
];

const SUMMARY =
	'A Svelte 5 UI framework with five built-in design languages, a zero-dependency theme engine and flash-free server-side theming.';

// Said first in llms.txt and llms-full.txt: an agent told the app uses Sveltier may take it as
// set up, and a page without the provider renders with no theme and raises no error.
const SETUP_NOTE = `Once per app, before any page: the root layout (\`src/routes/+layout.svelte\` in SvelteKit, the root component with Vite alone) wraps everything in \`UIProvider\` with at least one theme pack. Without it, components render without the theme's styles and \`useToast()\` has nowhere to show. Check it is there before you build a page, and add it if it is missing.`;

const CONVENTIONS = `Install \`@sveltier/ui\`, wrap the app in \`UIProvider\` with at least one theme pack (for example \`monolith\` from \`@sveltier/ui/themes/monolith\`), and import components from \`@sveltier/ui\`. The installed package holds these docs for its own version (\`node_modules/@sveltier/ui/llms.txt\`, \`docs/<group>/<page>.md\`, \`components.json\`), and \`npx sveltier init\` points the app's \`AGENTS.md\` at them.

- Svelte 5 only: runes (\`$state\`, \`$derived\`, \`$effect\`, \`$props\`, \`$bindable\`), snippets and callback props. Never write Svelte 4 syntax: no \`export let\`, no \`on:click\` (use \`onclick\`), no \`<slot>\` (use snippets and \`{@render}\`), no \`createEventDispatcher\`, no \`$:\`. Svelte's own tools for agents, including an MCP server and an autofixer, are listed at https://svelte.dev/docs/ai.
- Every component takes the same names for the same things: \`variant\` (elevated, flat, tonal, outlined, text, plain), \`size\` (xs to xl), \`density\` (dense, compact, default, comfortable), \`color\` (an intent such as primary or error, neutral, or a custom colour), \`rounded\`, \`disabled\`, \`loading\`.
- Content goes in snippets (\`children\`, \`prepend\`, \`append\`, \`actions\`), events are callback props (\`onclick\`), and two-way values use \`bind:\` (\`bind:value\`, \`bind:selected\`, \`bind:open\`).
- Every field and choice calls \`onchange\` with its new value, typed as \`value\` is, when the user changes it, never when the value is set from code: a text field when the user leaves it, a number field when the number is committed (on leaving, on each step), a Slider on release, Checkbox, Switch and Chip with their state, the rest with the choice. \`oninput\` stays the DOM event, for work on each key.
- The same thing has the same name everywhere: choices are \`options\` (Select, Combobox, NativeSelect, RadioGroup, SegmentedControl), other lists are \`items\` (Tabs, Menu, Tree, Table, Accordion, Stepper, Timeline, Breadcrumbs, CommandPalette); the text of a control or a choice is \`label\`, a heading is \`title\` (Card, Dialog, Sheet, Alert, ListItem, Timeline items). A Card's \`title\` is an \`<h2>\` by default; under a section's \`<h2>\`, give the card \`level={3}\`.
- Every component passes other attributes to its root element, merges \`class\`, and exposes the element as a bindable \`ref\`. Form fields are the exception: their attributes and \`ref\` go to the native control (\`name\`, \`placeholder\`, \`autocomplete\` reach the \`<input>\`), while \`class\` and \`style\` stay on the field.
- Form fields validate with the HTML constraints first (\`required\`, \`minlength\`, \`maxlength\`, \`pattern\`, \`type="email"\`), then \`rules\` (functions returning \`true\` or a message), and show \`error\` from outside (a server's answer) as given. Messages appear when the user leaves a field they changed, then follow every change.
- A choice from a list is \`NativeSelect\` (the platform's own picker, best for plain options on phones), \`Select\` (groups, descriptions, options drawn with the \`option\` snippet) or \`Combobox\` (typing searches the list, ignoring case and diacritics; \`filter={false}\` with \`bind:query\` searches a server). Select and Combobox take \`options\` of \`{ value, label, description?, group?, disabled? }\` (\`SelectOption\`) and \`bind:value\`; build neither from a Menu or a Popover.
- Dates are ISO strings, \`'YYYY-MM-DD'\`, never \`Date\` objects: \`DatePicker\` (\`bind:value\`, typed in the reader's order or chosen in a calendar), \`DateRangePicker\` (\`bind:start\` and \`bind:end\`) and \`Calendar\` (a month on the page) all take \`min\`, \`max\` and \`isDateDisabled\` (for example a market's weekends and holidays). A time of day is \`'HH:mm'\` on the 24-hour clock, as \`<input type="time">\` gives it: \`TimeField\` (\`bind:value\`, \`min\`, \`max\`, \`step\` in minutes). A date with a time is \`'YYYY-MM-DDTHH:mm'\`, local, as \`<input type="datetime-local">\` gives it: \`DateTimeField\`.
- Defaults for a whole app or section go in the \`defaults\` of \`UIProvider\` or a \`DefaultsProvider\`, by component name; a prop on the component still wins.
- An app's frame is \`AppLayout\` in the root layout, with \`AppBar\`, \`NavigationDrawer\` (usually a \`List nav\` of links), \`Main\` and an optional \`AppFooter\` (a status bar) inside: they place themselves on a CSS grid, the drawer becomes a modal drawer with a menu button in the bar on small screens, and nothing needs measuring or wiring. The bar's \`prepend\` holds the app's mark (a link home), and a \`List nav\` in its \`nav\` lays out in a row. An app whose panes scroll on their own (a terminal) uses \`AppLayout fill\`: the page never scrolls, and content with \`block-size: 100%\` fills \`Main\`.
- Data in rows and columns is a \`Table\` with \`items\` and \`columns\` typed as \`TableColumn<Item>[]\`, rather than a hand-written \`<table>\`: a column's \`key\` is a property of the items (a typo is a type error that lists the real ones), an \`id\` with \`value\` computes one, and a \`cell\` snippet renders content of its own. \`sort: true\` sorts from the header, numbers line up at the end, and the header stays in view while the table scrolls. For a terminal's tight rows (about 20px), \`size="xs" density="dense"\`.
- Figures for people to read are \`Amount\` (numbers, prices, money, percentages) and \`Delta\` (changes, signed and in the up or down colour), not strings from \`toFixed\` or a hand-made \`Intl.NumberFormat\`: \`decimals={2}\` fixes the digits, \`format\` takes Intl options (\`{ style: 'currency' }\` uses the locale's currency), a missing value shows a dash, \`flash\` marks live updates, and \`masked\` set through \`DefaultsProvider\` hides every figure at once. A part of the page that formats in another locale (a market table in English digits inside a Vietnamese app) goes in \`<LocaleProvider locale="en-US">\`, which keeps the app's messages. A price the user types is a \`PriceInput\` with its \`tick\` (fixed, or bands that change with the price); an amount out of what is available is an \`AmountInput\` with \`max\` and the lot as \`step\`, whose share buttons round down to whole lots.
- Overlays open from a control through a \`trigger\` snippet: spread the attributes it receives onto your own Button (\`{#snippet trigger(attributes)}<Button {...attributes}>Open</Button>{/snippet}\`), which wires the ARIA, opening and focus return. Without a trigger, \`bind:open\` opens and closes them. A \`ContextMenu\` opens on right click instead, from a \`target\` snippet whose attributes go on the element or on every row; \`onopen\` receives the element, and \`label\` names the menu. A \`CommandPalette\` also opens from anywhere with its \`shortcut\` (\`'Mod+K'\` by default, \`false\` for none), and runs the command chosen through \`onselect\`.
- Toasts come from \`useToast()\`, which \`UIProvider\` provides: call it while a component initialises, then \`toast.show('Payment sent', { action: { label: 'Undo', onclick: undo } })\` when something happens. There is no toast component to place, and no other toast library is needed.
- Style your own elements with the theme's CSS variables, never fixed values: \`--sv-color-*\` for colour, \`--sv-space-*\` for spacing, \`--sv-radius-md\` for one-line controls. A theme may make \`--sv-radius-md\` a pill, so a box that grows with its content takes \`min(var(--sv-radius-md), var(--sv-radius-lg))\`.
- Sveltier's CSS sits in the \`sv\` cascade layer, so unlayered app CSS wins without \`!important\`. With Tailwind 4, or any CSS of your own in layers, declare the order in the HTML before any stylesheet (\`src/app.html\` in SvelteKit, \`index.html\` with Vite alone): \`<style>@layer theme, base, sv, components, utilities;</style>\`. Without it, Tailwind's reset can strip the components' backgrounds and padding. Reach a component's element from a Svelte \`<style>\` through its \`class\` prop and \`:global()\`.`;

/** The first sentence of a description, on one line. */
const sentence = (text: string) => {
	const line = text.replace(/\s+/g, ' ');
	return /^.*?\.(?=\s|$)/.exec(line)?.[0] ?? line;
};

const escape = (text: string) => text.replaceAll('|', '\\|').replaceAll('\n', ' ');

function table(rows: ApiRow[]): string {
	const lines = rows.map(
		(row) =>
			`| \`${row.name}\`${row.required ? ' (required)' : ''} | \`${escape(row.type)}\` | ${row.default ? `\`${escape(row.default)}\`` : ''} | ${escape(row.description)} |`
	);
	return ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...lines].join(
		'\n'
	);
}

function section(entry: Entry, link: (path: string) => string): string {
	const parts = [`### ${entry.name}`, '', `Docs: ${link(entry.path)}`];
	const description = descriptions[entry.types[0]!];
	if (description) parts.push('', description);
	if (entry.example) parts.push('', '```svelte', entry.example, '```');
	for (const type of entry.types) {
		const rows = tables[type];
		if (rows) parts.push('', `\`${type}\`:`, '', table(rows));
	}
	return parts.join('\n');
}

/** llms.txt: every docs page, with what each component is. */
export function llmsIndex(link: (path: string) => string): string {
	const described = new Map(
		[...LAYOUT, ...COMPONENTS, ...FORMS, ...OVERLAYS, ...FINANCE].map((entry) => [
			entry.path,
			sentence(descriptions[entry.types[0]!] ?? '')
		])
	);
	const groups = NAV.map((group) => {
		const items = group.items.map((item) => {
			const note = described.get(item.path);
			return `- [${item.title}](${link(item.path)})${note ? `: ${note}` : ''}`;
		});
		return [`## ${group.title}`, '', ...items].join('\n');
	});
	return [
		'# Sveltier',
		'',
		`> ${SUMMARY}`,
		'',
		'## Setup',
		'',
		SETUP_NOTE,
		'',
		'```svelte',
		setup.trimEnd(),
		'```',
		'',
		'## Conventions',
		'',
		CONVENTIONS,
		'',
		...groups.flatMap((group) => [group, '']),
		'## Optional',
		'',
		`- [Full reference](${link('llms-full.txt')}): setup, conventions, and every component's props, generated from its types`,
		`- [Component gallery](${link('examples/gallery/light/brand/default')}): every component in its main states, one page per mode, accent and density at examples/gallery/<light|dark>/<brand|amber>/<compact|default|comfortable>`,
		''
	].join('\n');
}

/** llms-full.txt: setup, conventions, then every component and primitive with its API. */
export function llmsFull(link: (path: string) => string): string {
	return [
		'# Sveltier',
		'',
		`> ${SUMMARY}`,
		'',
		'## Setup',
		'',
		SETUP_NOTE,
		'',
		'```sh',
		install.pnpm,
		'```',
		'',
		'```svelte',
		setup.trimEnd(),
		'```',
		'',
		'## Conventions',
		'',
		CONVENTIONS,
		'',
		'## Layout',
		'',
		...LAYOUT.flatMap((entry) => [section(entry, link), '']),
		'## Components',
		'',
		...COMPONENTS.flatMap((entry) => [section(entry, link), '']),
		'## Forms',
		'',
		...FORMS.flatMap((entry) => [section(entry, link), '']),
		'## Overlays',
		'',
		...OVERLAYS.flatMap((entry) => [section(entry, link), '']),
		'## Finance',
		'',
		...FINANCE.flatMap((entry) => [section(entry, link), '']),
		'## Primitives',
		'',
		'Behaviour for your own components: attachments (`{@attach focusTrap()}`) and helpers.',
		'',
		...PRIMITIVES.flatMap((entry) => [section(entry, link), '']),
		'## Errors',
		'',
		`Messages start with \`[sveltier SVxxxx]\`, say what to do, and link to ${link('errors')}. Errors are thrown in every build; warnings are logged in development only.`,
		'',
		...Object.entries(ERROR_CODES).map(
			([code, entry]) =>
				`- \`${code}\` ${entry.kind === 'warning' ? '(development warning) ' : ''}${entry.title}. ${entry.cause} Fix: ${entry.fix}`
		),
		''
	].join('\n');
}

// The same reference, shipped inside the npm package so an agent reads the docs of the version
// it has installed: an index whose links point at the package's own files, one Markdown file
// per docs page with an API section, and a machine-readable manifest of the components.

/** The public site, for links that leave the package. */
export const SITE = 'https://sveltier.com';

const SECTIONS: Array<[string, Entry[]]> = [
	['Layout', LAYOUT],
	['Components', COMPONENTS],
	['Forms', FORMS],
	['Overlays', OVERLAYS],
	['Finance', FINANCE],
	['Primitives', PRIMITIVES]
];

/** Docs paths that have a Markdown page: one per page, several entries may share it. */
export const MARKDOWN_PAGES: string[] = [
	...new Set(SECTIONS.flatMap(([, entries]) => entries.map((entry) => entry.path)))
];

/** Links for files inside the package: its Markdown pages, else the site. */
export const packageLink = (path: string): string =>
	path.endsWith('.txt')
		? path
		: MARKDOWN_PAGES.includes(path)
			? `docs/${path}.md`
			: `${SITE}/${path}`;

/** Links to the site, absolute. */
export const siteLink = (path: string): string => `${SITE}/${path}`;

/** One docs page as Markdown: its entries with their descriptions, examples and API tables. */
export function pageMarkdown(path: string): string {
	const entries = SECTIONS.flatMap(([, list]) => list.filter((entry) => entry.path === path));
	const title = NAV.flatMap((group) => group.items).find((item) => item.path === path)?.title;
	const depth = path.split('/').length;
	const up = '../'.repeat(depth);
	return [
		`# ${title ?? entries[0]?.name ?? path}`,
		'',
		// Agents often open one page and nothing else, so it names the setup they must not skip.
		`> Part of Sveltier (\`@sveltier/ui\`). Once per app, the root layout wraps everything in \`UIProvider\` with a theme pack (\`<UIProvider themes={monolith}>\`); without it, components render without the theme. Setup and conventions: [llms.txt](${up}llms.txt); every component: [llms-full.txt](${up}llms-full.txt).`,
		'',
		...entries.flatMap((entry) => [section(entry, siteLink).replace(/^### /, '## '), ''])
	].join('\n');
}

interface ManifestEntry {
	name: string;
	group: string;
	docs: string;
	markdown: string;
	description: string;
	example?: string;
	/** The API tables of the entry, by exported type name. */
	types: Record<string, ApiRow[]>;
}

/** The components and primitives with their props, for tools that read JSON. */
export function componentsManifest(): {
	package: string;
	docs: string;
	conventions: string;
	entries: ManifestEntry[];
} {
	return {
		package: '@sveltier/ui',
		docs: SITE,
		conventions: CONVENTIONS,
		entries: SECTIONS.flatMap(([group, list]) =>
			list.map((entry) => ({
				name: entry.name,
				group,
				docs: siteLink(entry.path),
				markdown: `docs/${entry.path}.md`,
				description: descriptions[entry.types[0]!] ?? '',
				...(entry.example ? { example: entry.example } : {}),
				types: Object.fromEntries(
					entry.types.flatMap((type) => (tables[type] ? [[type, tables[type]]] : []))
				)
			}))
		)
	};
}
