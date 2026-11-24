import type { ThemeDefinition } from '@sveltier/ui';
import { SITE } from './llms.js';
import { PACKS, THEMES, type Pack, type PackId } from '../site.js';

// DESIGN.md for each theme pack: the open format coding agents read for how an app should
// look (github.com/google-labs-code/design.md). The token values come from the pack itself, so
// the file never drifts from the CSS. The prose points agents at the components and the
// `--sv-*` variables: a value copied out of this file into a stylesheet would no longer follow
// the theme, its dark mode or a change of pack.

/** The shared scale of every pack: sizes in rem, as tokens.css sets them. */
const TEXT = {
	label: '0.697rem',
	xs: '0.7862rem',
	sm: '0.8867rem',
	md: '1rem',
	lg: '1.1278rem',
	xl: '1.272rem',
	title: '1.618rem',
	headline: '2.3213rem',
	display: '4.2361rem'
} as const;
const LEADING = { tight: 1.1278, snug: 1.272, normal: 1.618 } as const;
const SPACE = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as const;
const CONTROL = {
	xs: '1.618rem',
	sm: '2.0582rem',
	md: '2.618rem',
	lg: '3.3302rem',
	xl: '4.2361rem'
};

/** The colours an agent picks from, with what each is for. */
const ROLES: [name: string, role: string][] = [
	['background', 'The page behind everything.'],
	['surface', 'Cards, fields, menus and dialogs.'],
	['surface-raised', 'A surface on a surface: table headers, hovered rows, a nested panel.'],
	['border', 'Dividers and the outline of fields and cards.'],
	['border-soft', 'Hairlines inside a surface.'],
	['border-strong', 'A border that must be seen, such as an unchecked checkbox.'],
	['text', 'Body text and headings.'],
	['text-muted', 'Secondary text.'],
	['text-subtle', 'Hints, captions and placeholders.'],
	['primary', 'The main action and the current item.'],
	['success', 'Done, confirmed.'],
	['warning', 'Needs attention soon.'],
	['error', 'Failed or invalid.'],
	['info', 'Neutral news.'],
	['up', 'A rise in a figure.'],
	['down', 'A fall in a figure.']
];

const q = (value: string | number): string => JSON.stringify(String(value));
/** A YAML line: numbers bare, as the spec takes a font weight or a line height; text quoted. */
const pair = (key: string, value: string | number, indent: number): string =>
	`${'  '.repeat(indent)}${/^[a-z][\w-]*$/.test(key) ? key : q(key)}: ${typeof value === 'number' ? value : q(value)}`;

function colorsYaml(light: ThemeDefinition, dark: ThemeDefinition): string[] {
	// Optional colours a pack leaves out are left out here too.
	const lines = (theme: ThemeDefinition, indent: number) =>
		Object.entries(theme.colors).flatMap(([name, value]) =>
			value === undefined ? [] : [pair(name, value, indent)]
		);
	return ['colors:', ...lines(light, 1), '  dark:', ...lines(dark, 2)];
}

function typographyYaml(v: ThemeDefinition['variables']): string[] {
	const style = (
		name: string,
		family: string | number,
		size: string,
		weight: string | number,
		leading: number,
		extra: [string, string | number][] = []
	) => [
		`  ${name}:`,
		pair('fontFamily', family, 2),
		pair('fontSize', size, 2),
		pair('fontWeight', Number(weight), 2),
		pair('lineHeight', leading, 2),
		...extra.map(([key, value]) => pair(key, value, 2))
	];
	const display: [string, string | number][] = [['letterSpacing', v['tracking-display']]];
	return [
		'typography:',
		...style(
			'display',
			v['font-display'],
			TEXT.display,
			v['weight-display'],
			LEADING.tight,
			display
		),
		...style(
			'headline',
			v['font-display'],
			TEXT.headline,
			v['weight-display'],
			LEADING.tight,
			display
		),
		...style('title', v['font-display'], TEXT.title, v['weight-display'], LEADING.snug),
		...style('body-lg', v['font-ui'], TEXT.lg, 400, LEADING.normal),
		...style('body-md', v['font-ui'], TEXT.md, 400, LEADING.normal),
		...style('body-sm', v['font-ui'], TEXT.sm, 400, LEADING.snug),
		...style('label', v['font-ui'], String(v['label-size']), 500, LEADING.snug, [
			['letterSpacing', v['label-tracking'] === '0' ? '0em' : v['label-tracking']]
		]),
		...style('data', v['font-data'], TEXT.sm, 400, LEADING.snug, [['fontFeature', "'tnum'"]])
	];
}

function frontmatter(pack: Pack, light: ThemeDefinition, dark: ThemeDefinition): string {
	const v = light.variables;
	return [
		'---',
		'version: alpha',
		`name: ${q(`Sveltier ${pack.name}`)}`,
		`description: ${q(pack.mood)}`,
		...colorsYaml(light, dark),
		...typographyYaml(v),
		'rounded:',
		...(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) =>
			pair(size, v[`radius-${size}`], 1)
		),
		'spacing:',
		...SPACE.map((step) => pair(String(step), `${step / 16}rem`, 1)),
		'motion:',
		...(['fast', 'normal', 'slow', 'slower'] as const).flatMap((speed) => [
			`  ${speed}:`,
			pair('duration', v[`duration-${speed}`], 2),
			pair('timingFunction', v.ease, 2)
		]),
		'components:',
		'  button-primary:',
		pair('backgroundColor', '{colors.primary}', 2),
		pair('textColor', '{colors.on-primary}', 2),
		pair('rounded', '{rounded.md}', 2),
		pair('height', CONTROL.md, 2),
		'  text-field:',
		pair('backgroundColor', '{colors.surface}', 2),
		pair('textColor', '{colors.text}', 2),
		pair('rounded', '{rounded.md}', 2),
		pair('height', CONTROL.md, 2),
		'  card:',
		pair('backgroundColor', '{colors.surface}', 2),
		pair('textColor', '{colors.text}', 2),
		pair('rounded', '{rounded.lg}', 2),
		pair('padding', '{spacing.21}', 2),
		'  chip:',
		pair('rounded', '{rounded.full}', 2),
		pair('typography', '{typography.label}', 2),
		'---'
	].join('\n');
}

/** What the theme sets in capitals, so an agent does not type them in capitals itself. */
function capitals(v: ThemeDefinition['variables']): string {
	const parts = [
		v['label-transform'] === 'uppercase' && 'field labels (`--sv-label-transform`)',
		v['button-transform'] === 'uppercase' && 'buttons (`--sv-button-transform`)'
	].filter(Boolean);
	if (!parts.length) return '';
	return `The theme sets ${parts.join(' and ')} in capitals. Write them in sentence case; the theme does the rest.\n\n`;
}

const table = (head: string[], rows: string[][]): string =>
	[head, head.map(() => '---'), ...rows].map((cells) => `| ${cells.join(' | ')} |`).join('\n');

function body(pack: Pack, light: ThemeDefinition, dark: ThemeDefinition): string {
	const v = light.variables;
	const page = `${SITE}/theme-packs/${pack.id}`;
	return `# Sveltier ${pack.name}

## Overview

${pack.mood}

Suits: ${pack.suits}

This app is built with Sveltier (\`@sveltier/ui\`), a UI framework for Svelte 5, on the ${pack.name} theme pack: \`${pack.id}-light\` and \`${pack.id}-dark\`. Every value in this file is already a CSS variable of the theme. Build screens from Sveltier's components and, in your own CSS, read the \`--sv-*\` variable named in each section. Never copy a value from this file into a stylesheet: it would not follow dark mode, the density or a change of pack.

This file describes the pack as it ships. If the app's themes are its own, made with \`defineTheme\` over the pack, they win: read the theme code for what it changes.

\`\`\`svelte
<script>
	import { UIProvider } from '@sveltier/ui';
	import { ${pack.id} } from '@sveltier/ui/themes/${pack.id}';
	let { children } = $props();
</script>

<UIProvider themes={${pack.id}}>
	{@render children()}
</UIProvider>
\`\`\`

Fonts are not bundled: \`npm install ${pack.install}\`, then import them in the root layout. The pack's page: ${page}.

## Colors

${table(
	['Role', 'Variable', 'Light', 'Dark', 'Use'],
	ROLES.map(([name, role]) => [
		`\`${name}\``,
		`\`--sv-color-${name}\``,
		`\`${light.colors[name as keyof ThemeDefinition['colors']]}\``,
		`\`${dark.colors[name as keyof ThemeDefinition['colors']]}\``,
		role
	])
)}

Text on a filled colour is \`--sv-on-<name>\` (\`--sv-on-primary\`). The status colours are for meaning only: a rise, a fall, an error, a warning. Components take them through \`color\` (\`<Button color="error">\`, \`<Chip color="success">\`); give a component a colour that way rather than overriding its CSS.

## Typography

${pack.type}

${table(
	['Use', 'Variables'],
	[
		['Headings', '`--sv-font-display`, `--sv-weight-display`, `--sv-tracking-display`'],
		['Interface and body', '`--sv-font-ui`'],
		['Figures, codes, tables', '`--sv-font-data`, with `font-variant-numeric: tabular-nums`'],
		[
			'Sizes',
			'`--sv-text-label`, `--sv-text-xs`, `--sv-text-sm` (controls), `--sv-text-md` (body), `--sv-text-lg`, `--sv-text-xl`, `--sv-text-title`, `--sv-text-headline`, `--sv-text-display`'
		],
		['Line height', '`--sv-leading-tight`, `--sv-leading-snug`, `--sv-leading-normal`'],
		['Weights', '`--sv-weight-regular`, `--sv-weight-medium`, `--sv-weight-semibold`']
	]
)}

${capitals(v)}\`--sv-text-headline\` and \`--sv-text-display\` grow with the window, up to the sizes above. Money and other figures go through \`Amount\` and \`Delta\`, which set the data face and tabular figures; do not format them by hand.

## Layout

Space comes from one scale: \`--sv-space-N\`, with N the size in px on a Fibonacci scale (${SPACE.join(', ')}). There is no \`--sv-space-4\` or \`--sv-space-16\`. Inside a card or a form, steps of 8 and 13 separate controls; 21 and 34 separate groups; 55 and up separate sections of a page.

The frame of an app is \`AppLayout\` with \`AppBar\`, \`NavigationDrawer\`, \`Main\` and, on a phone, \`BottomNavigation\`. Controls are \`--sv-control-md\` (${CONTROL.md}) tall at the default size and density; \`size\` and \`density\` change them, set once for an area through \`DefaultsProvider\` rather than control by control.

## Elevation & Depth

${pack.shape}

Raised surfaces take \`--sv-shadow\`. A card is \`--sv-color-surface\` on \`--sv-color-background\`; a nested panel is \`--sv-color-surface-raised\`. Overlays (\`Dialog\`, \`Sheet\`, \`Menu\`, \`Popover\`) bring their own surface, shadow and backdrop.

## Shapes

${table(
	['Variable', 'Value', 'Used by'],
	[
		['`--sv-radius-sm`', `\`${v['radius-sm']}\``, 'Small marks inside tables and controls'],
		['`--sv-radius-md`', `\`${v['radius-md']}\``, 'Buttons, fields, menus'],
		['`--sv-radius-lg`', `\`${v['radius-lg']}\``, 'Cards'],
		['`--sv-radius-xl`', `\`${v['radius-xl']}\``, 'Dialogs, sheets and the command palette'],
		['`--sv-radius-full`', `\`${v['radius-full']}\``, 'Chips, badges, avatars, switches, sliders']
	]
)}

To change a component's corners, use its \`rounded\` prop (\`true\`, \`'none'\`, \`'sm'\`, \`'md'\`, \`'lg'\`, \`'xl'\`, \`'full'\`), or set it for the whole app in \`UIProvider\`'s \`defaults\`.

## Motion & Micro-interaction

${pack.motion}

${table(
	['Variable', 'Value'],
	[
		['`--sv-duration-fast`', `\`${v['duration-fast']}\``],
		['`--sv-duration-normal`', `\`${v['duration-normal']}\``],
		['`--sv-duration-slow`', `\`${v['duration-slow']}\``],
		['`--sv-duration-slower`', `\`${v['duration-slower']}\``],
		['`--sv-ease`', `\`${v.ease}\``]
	]
)}

Animate only \`transform\` and \`opacity\`. Sveltier's transitions (\`fade\`, \`rise\`, \`pop\`, \`grow\`) take the theme's timing and stop under \`prefers-reduced-motion\`; use them instead of writing keyframes.

## Voice & Content Strategy

Short and plain. Buttons say what they do, with a verb (\`Send $1,250.00\`, \`Save changes\`), never \`OK\` or \`Submit\`. Errors say what happened and how to fix it. Dates are ISO strings in code (\`'YYYY-MM-DD'\`) and formatted by the components.

## Components

Use a component for every control; do not draw your own buttons, fields, menus or dialogs. The props are in \`node_modules/@sveltier/ui/docs/<group>/<page>.md\` and in each component's \`<Name>Props\` type.

- Actions: \`Button\` (\`variant\`: \`'flat'\` for the main action, \`'tonal'\`, \`'outlined'\`, \`'text'\` for less), \`ButtonGroup\`, \`Menu\`.
- Forms: \`Form\`, \`TextField\`, \`NumberField\`, \`AmountInput\`, \`Select\`, \`Combobox\`, \`DatePicker\`, \`Checkbox\`, \`Switch\`, \`RadioGroup\`, \`SegmentedControl\`.
- Figures: \`Amount\`, \`Delta\`, \`Odometer\`, \`Table\`, \`Ledger\`.
- Surfaces: \`Card\`, \`List\`, \`Tabs\`, \`Dialog\`, \`Sheet\`, \`Alert\`, toasts from \`useToast()\`.

## Do's and Don'ts

- Do give one action per view the \`flat\` primary button; the others \`tonal\`, \`outlined\` or \`text\`.
- Do use \`color\`, \`variant\`, \`size\`, \`density\` and \`rounded\` before writing CSS for a component.
- Do read colours, space, radii and timing from \`--sv-*\` variables in your own CSS.
- Don't write a colour, a radius or a duration as a literal value, and don't copy one from this file.
- Don't invent variables: if a name is not in this file or in the docs, it does not exist.
- Don't restyle a component's insides through its class names; they are not part of the API.
- Don't use colour for decoration: status colours carry meaning only.
`;
}

/** The DESIGN.md of a theme pack. */
export function designMarkdown(id: PackId): string {
	const pack = PACKS.find((candidate) => candidate.id === id);
	const light = THEMES[`${id}-light`];
	const dark = THEMES[`${id}-dark`];
	if (!pack || !light || !dark) throw new Error(`Unknown theme pack: ${id}`);
	return `${frontmatter(pack, light, dark)}\n\n${body(pack, light, dark)}`;
}

/** The packs with a DESIGN.md, by id. */
export const DESIGN_PACKS: PackId[] = PACKS.map((pack) => pack.id);
