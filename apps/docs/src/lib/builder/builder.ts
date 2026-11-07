// The Theme builder's model: a base theme (pack and mode) and the changes made over it, turned
// into a theme with defineTheme(), the custom properties that paint a preview with it, its
// contrast checks, the code to paste, and the URL hash that keeps it.
import {
	contrast,
	defineTheme,
	INTENT_COLORS,
	parseOklch,
	type ThemeDefinition,
	type ThemeInput
} from '@sveltier/ui';
import { PACKS, THEMES, type Mode, type PackId } from '../site.js';

/** Colours the builder edits: the intents, then the page, its surfaces and its text. */
export const EDITABLE_COLORS = [
	...INTENT_COLORS,
	'background',
	'surface',
	'surface-raised',
	'border',
	'text',
	'text-muted'
] as const;
export type EditableColor = (typeof EDITABLE_COLORS)[number];

export const FONT_ROLES = ['font-display', 'font-ui', 'font-data'] as const;
export type FontRole = (typeof FONT_ROLES)[number];

const RADII = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const;

export interface BuilderState {
	pack: PackId;
	mode: Mode;
	colors: Partial<Record<EditableColor, string>>;
	/** Multiplies the base theme's corner radii; 1 keeps them. */
	radius: number;
	fonts: Partial<Record<FontRole, string>>;
}

/**
 * What the builder keeps: the state, with the mode left out until someone picks one. An unset
 * mode follows the docs, light or dark, so the preview starts in the mode the reader is in.
 */
export type BuilderSettings = Omit<BuilderState, 'mode'> & { mode?: Mode };

export const initialState = (): BuilderSettings => ({
	pack: 'monolith',
	colors: {},
	radius: 1,
	fonts: {}
});

/** The settings with a mode: the one picked, or the docs' own. */
export const resolveState = (settings: BuilderSettings, docsMode: Mode): BuilderState => ({
	...settings,
	mode: settings.mode ?? docsMode
});

export const baseName = (state: Pick<BuilderState, 'pack' | 'mode'>): string =>
	`${state.pack}-${state.mode}`;

export const baseTheme = (state: Pick<BuilderState, 'pack' | 'mode'>): ThemeDefinition =>
	THEMES[baseName(state)] as ThemeDefinition;

/** The export name of a base theme, such as `auroraDark`. */
export const baseExport = (state: Pick<BuilderState, 'pack' | 'mode'>): string =>
	`${state.pack}${state.mode === 'dark' ? 'Dark' : 'Light'}`;

/** A radius scaled, kept whole; a pill (999px) stays a pill. */
export function scaleRadius(value: string | number, scale: number): string {
	const match = /^([\d.]+)px$/.exec(String(value).trim());
	if (!match) return String(value);
	const pixels = Number(match[1]);
	return pixels >= 999 ? String(value) : `${Math.round(pixels * scale)}px`;
}

/** What differs from the base theme, as defineTheme() takes it. */
export function themeInput(state: BuilderState): ThemeInput {
	const base = baseTheme(state);
	const variables: Record<string, string> = {};
	if (state.radius !== 1) {
		for (const name of RADII) {
			const scaled = scaleRadius(base.variables[name], state.radius);
			if (scaled !== String(base.variables[name])) variables[name] = scaled;
		}
	}
	for (const role of FONT_ROLES) {
		const font = state.fonts[role];
		if (font && font !== base.variables[role]) variables[role] = font;
	}
	const colors = Object.fromEntries(
		Object.entries(state.colors).filter(([name, value]) => value !== base.colors[name])
	);
	return {
		...(Object.keys(colors).length ? { colors } : {}),
		...(Object.keys(variables).length ? { variables } : {})
	};
}

export const buildTheme = (state: BuilderState): ThemeDefinition =>
	defineTheme(themeInput(state), baseTheme(state));

/** The theme as custom properties on one element, as the theme provider writes them. */
export function themeStyle(theme: ThemeDefinition): string {
	const declarations = [`color-scheme:${theme.dark ? 'dark' : 'light'}`];
	for (const [name, value] of Object.entries(theme.colors)) {
		declarations.push(`--sv-${name.startsWith('on-') ? name : `color-${name}`}:${value}`);
	}
	for (const [name, value] of Object.entries(theme.variables)) {
		declarations.push(`--sv-${name}:${value}`);
	}
	return declarations.join(';');
}

// WCAG 2.2: text 4.5:1 (1.4.3), the same pairs the built-in themes are tested against.
export const TEXT_CONTRAST = 4.5;

export interface ContrastRow {
	color: string;
	/** As text on the page, on a surface and on a raised surface. */
	onBackground: number;
	onSurface: number;
	onRaised: number;
	/** Its `on-` colour over a fill of it, for intents. */
	label?: number;
}

const ratio = (theme: ThemeDefinition, a: string, b: string): number => {
	const first = parseOklch(theme.colors[a] ?? '');
	const second = parseOklch(theme.colors[b] ?? '');
	return first && second ? contrast(first, second) : 0;
};

export function contrastRows(theme: ThemeDefinition): ContrastRow[] {
	const texts = ['text', 'text-muted', 'text-subtle', ...INTENT_COLORS];
	return texts.map((color) => ({
		color,
		onBackground: ratio(theme, color, 'background'),
		onSurface: ratio(theme, color, 'surface'),
		onRaised: ratio(theme, color, 'surface-raised'),
		...(INTENT_COLORS.includes(color as (typeof INTENT_COLORS)[number])
			? { label: ratio(theme, `on-${color}`, color) }
			: {})
	}));
}

/** A string literal for the generated code: double quotes when it holds a single quote. */
const literal = (text: string) => (text.includes("'") ? JSON.stringify(text) : `'${text}'`);
const key = (name: string) => (/^[a-z]\w*$/i.test(name) ? name : `'${name}'`);

function block(entries: Record<string, unknown>, indent: string): string {
	const lines = Object.entries(entries).map(
		([name, value]) => `${indent}  ${key(name)}: ${literal(String(value))}`
	);
	return `{\n${lines.join(',\n')}\n${indent}}`;
}

/** The code to paste: defineTheme() over the base theme, with only what changed. */
export function exportCode(state: BuilderState, name = 'brand'): string {
	const input = themeInput(state);
	const parts = [
		input.colors && `    colors: ${block(input.colors, '    ')}`,
		input.variables && `    variables: ${block(input.variables, '    ')}`
	].filter(Boolean);
	const body = parts.length ? `{\n${parts.join(',\n')}\n  }` : '{}';
	const base = baseExport(state);
	return [
		`import { defineTheme } from '@sveltier/ui';`,
		`import { ${base} } from '@sveltier/ui/themes/${state.pack}';`,
		'',
		`// ${PACKS.find((pack) => pack.id === state.pack)?.name} ${state.mode}, with your changes.`,
		`export const ${name} = defineTheme(`,
		`  ${body},`,
		`  ${base}`,
		');',
		'',
		`// <UIProvider themes={{ ${name} }}>`
	].join('\n');
}

/** OKLCH as a CSS string, rounded as people write it. */
export const formatOklch = (l: number, c: number, h: number): string =>
	`oklch(${+l.toFixed(3)} ${+c.toFixed(3)} ${+h.toFixed(1)})`;

/**
 * The state for the URL hash: what differs from a fresh builder. The mode is written once it
 * was picked or anything else changed, so a shared link opens in the mode it was made in.
 */
export function toQuery(state: BuilderState, picked: boolean): string {
	const entries: [string, string][] = [];
	if (state.pack !== 'monolith') entries.push(['pack', state.pack]);
	for (const [name, value] of Object.entries(state.colors)) if (value) entries.push([name, value]);
	if (state.radius !== 1) entries.push(['radius', String(state.radius)]);
	for (const [role, value] of Object.entries(state.fonts)) if (value) entries.push([role, value]);
	if (picked || entries.length)
		entries.splice(state.pack !== 'monolith' ? 1 : 0, 0, ['mode', state.mode]);
	return new URLSearchParams(entries).toString();
}

/** Settings read back from the URL hash; anything unknown or malformed is ignored. */
export function fromQuery(query: string): BuilderSettings {
	const params = new URLSearchParams(query);
	const state = initialState();
	const pack = params.get('pack');
	if (PACKS.some((item) => item.id === pack)) state.pack = pack as PackId;
	const mode = params.get('mode');
	if (mode === 'light' || mode === 'dark') state.mode = mode;
	for (const name of EDITABLE_COLORS) {
		const value = params.get(name);
		if (value && parseOklch(value)) state.colors[name] = value;
	}
	const radius = Number(params.get('radius'));
	if (params.has('radius') && Number.isFinite(radius) && radius >= 0 && radius <= 3) {
		state.radius = radius;
	}
	for (const role of FONT_ROLES) {
		const font = params.get(role);
		if (font && !/[<>{};]/.test(font)) state.fonts[role] = font;
	}
	return state;
}

/** Every font stack the packs use, for each role, labelled by its first family. */
export function fontOptions(): { value: string; label: string }[] {
	const stacks = new Set<string>();
	for (const theme of Object.values(THEMES)) {
		for (const role of FONT_ROLES) stacks.add(String(theme.variables[role]));
	}
	return [...stacks]
		.map((stack) => ({ value: stack, label: stack.split(',')[0]!.replaceAll("'", '').trim() }))
		.sort((a, b) => a.label.localeCompare(b.label));
}
