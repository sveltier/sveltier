// Controls for the Playground, read from the same API rows as the docs tables: a prop typed as
// a union of literals gets a select, a boolean a switch, a string a text field and a number a
// number field. Props of other types (snippets, callbacks, objects) get no control.
import { INTENT_COLORS } from '@sveltier/ui';
import type { ApiRow } from '../docs/api.js';

export type Value = string | number | boolean;

export type Control =
	| { kind: 'select'; name: string; options: Value[]; fallback?: Value }
	| { kind: 'switch'; name: string; fallback?: boolean }
	| { kind: 'text'; name: string; fallback?: string }
	| { kind: 'number'; name: string; fallback?: number };

/** The colours a `Color` prop offers here: the intents and neutral. */
export const COLOR_OPTIONS: string[] = [...INTENT_COLORS, 'neutral'];

/** A literal as written in a type or a default: `'flat'`, `true`, `4`. */
export function parseLiteral(text: string): Value | undefined {
	const trimmed = text.trim();
	if (/^'.*'$/.test(trimmed)) return trimmed.slice(1, -1);
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
	return undefined;
}

/** The control for one row, or undefined when the playground cannot set that prop. */
export function controlFor(row: ApiRow): Control | undefined {
	const fallback = row.default === undefined ? undefined : parseLiteral(row.default);
	const members = row.type.split('|').map((member) => member.trim());
	const name = row.name;

	if (row.type === 'Color') {
		return { kind: 'select', name, options: COLOR_OPTIONS, fallback };
	}
	if (row.type === 'boolean') {
		return { kind: 'switch', name, fallback: fallback === true };
	}
	// `boolean | 'sm' | …` reads as one choice among true, false and the literals.
	const literals = members.flatMap((member) =>
		member === 'boolean' ? [true, false] : [parseLiteral(member)]
	);
	if (members.length > 1 && literals.every((literal) => literal !== undefined)) {
		return { kind: 'select', name, options: literals as Value[], fallback };
	}
	const plain = members.filter((member) => member !== 'null' && member !== 'undefined');
	if (
		plain[0] === 'string' &&
		plain.every((member) => member === 'string' || member === 'Snippet')
	) {
		return { kind: 'text', name, fallback: typeof fallback === 'string' ? fallback : undefined };
	}
	if (
		plain[0] === 'number' &&
		plain.every((member) => member === 'number' || member === 'bigint')
	) {
		return { kind: 'number', name, fallback: typeof fallback === 'number' ? fallback : undefined };
	}
	return undefined;
}

/** A select's options as strings, for a `<select>` and the URL. */
export const optionText = (value: Value): string => String(value);

/** Reads a select's string back into the literal it stands for. */
export function optionValue(control: Control & { kind: 'select' }, text: string): Value {
	return control.options.find((option) => String(option) === text) ?? text;
}

/** One attribute of the generated code, or '' when the value is the default. */
export function attribute(control: Control, value: Value | undefined): string {
	if (value === undefined || value === '' || value === control.fallback) return '';
	if (control.kind === 'switch' && control.fallback !== true && value === false) return '';
	if (value === true) return control.name;
	if (typeof value === 'string') return `${control.name}="${value.replaceAll('"', '&quot;')}"`;
	return `${control.name}={${value}}`;
}

/** Text as Svelte markup shows it: braces and tags escaped. */
const markup = (text: string) =>
	text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('{', '&#123;');

/** The Svelte code for a component with these values: only what differs from the defaults. */
export function codeFor(
	name: string,
	controls: Control[],
	values: Record<string, Value>,
	content?: string
): string {
	const attributes = controls
		.map((control) => attribute(control, values[control.name]))
		.filter(Boolean);
	const inline = [name, ...attributes].join(' ');
	const long = inline.length > 64;
	const open = long ? `${name}\n  ${attributes.join('\n  ')}\n` : inline;
	let tag: string;
	if (!content) tag = `<${open}${long ? '' : ' '}/>`;
	else {
		const text = markup(content);
		const short = !long && inline.length + text.length + name.length < 72;
		tag = short ? `<${open}>${text}</${name}>` : `<${open}>\n  ${text}\n</${name}>`;
	}
	return `<script lang="ts">\n  import { ${name} } from '@sveltier/ui';\n</script>\n\n${tag}`;
}

/** The values that differ from the defaults, for the URL hash. */
export function toQuery(controls: Control[], values: Record<string, Value>): string {
	const params = new URLSearchParams();
	for (const control of controls) {
		const value = values[control.name];
		if (value === undefined || value === control.fallback) continue;
		if (control.kind === 'switch' && control.fallback !== true && value === false) continue;
		params.set(control.name, String(value));
	}
	return params.toString();
}

/** Values from the URL hash, typed by their controls; unknown names are ignored. */
export function fromQuery(controls: Control[], query: string): Record<string, Value> {
	const params = new URLSearchParams(query);
	const values: Record<string, Value> = {};
	for (const control of controls) {
		const text = params.get(control.name);
		if (text === null) continue;
		if (control.kind === 'switch') values[control.name] = text === 'true';
		else if (control.kind === 'number') {
			const number = Number(text);
			if (Number.isFinite(number)) values[control.name] = number;
		} else if (control.kind === 'select') values[control.name] = optionValue(control, text);
		else values[control.name] = text;
	}
	return values;
}
