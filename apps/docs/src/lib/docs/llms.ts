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
	tabsUsage
} from '#lib/snippets/components.js';
import {
	checkboxUsage,
	fieldUsage,
	formSvelteKit,
	nativeSelectUsage,
	numberFieldUsage,
	radioGroupUsage,
	sliderUsage,
	switchUsage,
	textareaUsage,
	textFieldValidation
} from '#lib/snippets/forms.js';
import {
	dialogUsage,
	menuUsage,
	popoverUsage,
	sheetUsage,
	toastUsage,
	tooltipUsage
} from '#lib/snippets/overlays.js';
import { appLayoutUsage } from '#lib/snippets/layout.js';
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
		name: 'AppLayout, AppBar, NavigationDrawer and Main',
		path: 'layout/app-layout',
		types: ['AppLayoutProps', 'AppBarProps', 'NavigationDrawerProps', 'MainProps'],
		example: appLayoutUsage
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
	{ name: 'Tabs', path: 'components/tabs', types: ['TabsProps'], example: tabsUsage }
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
	{ name: 'Tooltip', path: 'overlays/tooltip', types: ['TooltipProps'], example: tooltipUsage },
	{
		name: 'Toast (useToast)',
		path: 'overlays/toast',
		types: ['ToastInstance', 'ToastOptions', 'ToastAction', 'ToastDefaults'],
		example: toastUsage
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

const CONVENTIONS = `Install \`@sveltier/ui\`, wrap the app in \`UIProvider\` with at least one theme pack (for example \`monolith\` from \`@sveltier/ui/themes/monolith\`), and import components from \`@sveltier/ui\`.

- Svelte 5 only: runes (\`$state\`, \`$derived\`, \`$effect\`, \`$props\`, \`$bindable\`), snippets and callback props. Never write Svelte 4 syntax: no \`export let\`, no \`on:click\` (use \`onclick\`), no \`<slot>\` (use snippets and \`{@render}\`), no \`createEventDispatcher\`, no \`$:\`. Svelte's own tools for agents, including an MCP server and an autofixer, are listed at https://svelte.dev/docs/ai.
- Every component takes the same names for the same things: \`variant\` (elevated, flat, tonal, outlined, text, plain), \`size\` (xs to xl), \`density\` (compact, default, comfortable), \`color\` (an intent such as primary or error, neutral, or a custom colour), \`rounded\`, \`disabled\`, \`loading\`.
- Content goes in snippets (\`children\`, \`prepend\`, \`append\`, \`actions\`), events are callback props (\`onclick\`), and two-way values use \`bind:\` (\`bind:value\`, \`bind:selected\`, \`bind:open\`).
- Every component passes other attributes to its root element, merges \`class\`, and exposes the element as a bindable \`ref\`. Form fields are the exception: their attributes and \`ref\` go to the native control (\`name\`, \`placeholder\`, \`autocomplete\` reach the \`<input>\`), while \`class\` and \`style\` stay on the field.
- Form fields validate with the HTML constraints first (\`required\`, \`minlength\`, \`maxlength\`, \`pattern\`, \`type="email"\`), then \`rules\` (functions returning \`true\` or a message), and show \`error\` from outside (a server's answer) as given. Messages appear when the user leaves a field they changed, then follow every change.
- Defaults for a whole app or section go in the \`defaults\` of \`UIProvider\` or a \`DefaultsProvider\`, by component name; a prop on the component still wins.
- An app's frame is \`AppLayout\` in the root layout, with \`AppBar\`, \`NavigationDrawer\` (usually a \`List nav\` of links) and \`Main\` inside: they place themselves on a CSS grid, the drawer becomes a modal drawer with a menu button in the bar on small screens, and nothing needs measuring or wiring.
- Overlays open from a control through a \`trigger\` snippet: spread the attributes it receives onto your own Button (\`{#snippet trigger(attributes)}<Button {...attributes}>Open</Button>{/snippet}\`), which wires the ARIA, opening and focus return. Without a trigger, \`bind:open\` opens and closes them.
- Toasts come from \`useToast()\`, which \`UIProvider\` provides: call it while a component initialises, then \`toast.show('Payment sent', { action: { label: 'Undo', onclick: undo } })\` when something happens. There is no toast component to place, and no other toast library is needed.
- Style your own elements with the theme's CSS variables, never fixed values: \`--sv-color-*\` for colour, \`--sv-space-*\` for spacing, \`--sv-radius-md\` for one-line controls. A theme may make \`--sv-radius-md\` a pill, so a box that grows with its content takes \`min(var(--sv-radius-md), var(--sv-radius-lg))\`.`;

/** The first sentence of a description, on one line. */
const sentence = (text: string) => {
	const line = text.replace(/\s+/g, ' ');
	return /^.*?\.(?=\s|$)/.exec(line)?.[0] ?? line;
};

const escape = (text: string) => text.replaceAll('|', '\\|').replaceAll('\n', ' ');

function table(rows: ApiRow[]): string {
	const lines = rows.map(
		(row) =>
			`| \`${row.name}\` | \`${escape(row.type)}\` | ${row.default ? `\`${escape(row.default)}\`` : ''} | ${escape(row.description)} |`
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
		[...LAYOUT, ...COMPONENTS, ...FORMS, ...OVERLAYS].map((entry) => [
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
		CONVENTIONS,
		'',
		...groups.flatMap((group) => [group, '']),
		'## Optional',
		'',
		`- [Full reference](${link('llms-full.txt')}): setup, conventions, and every component's props, generated from its types`,
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
		'```sh',
		install.pnpm,
		'```',
		'',
		'```svelte',
		setup,
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
