// Development-only checks, imported as `#dev`. Under the "development" condition (the Vite dev
// server, Vitest) bundlers load this module; production builds and plain Node load ./off.js,
// whose functions do nothing. Callers also guard with `if (DEV)`, so production bundles drop
// the calls as well.
import type { ErrorCode } from '../core/errors/codes.js';
import { ERRORS_URL } from '../core/errors/errors.js';

export const DEV: boolean = true;

const warned = new Set<string>();

/** Warns once per message, in the format of thrown errors. */
function warn(code: ErrorCode, message: string): void {
	const text = `[sveltier ${code}] ${message} ${ERRORS_URL}#${code}`;
	if (warned.has(text)) return;
	warned.add(text);
	console.warn(text);
}

const show = (value: unknown) => (typeof value === 'string' ? `'${value}'` : String(value));

/**
 * Warns when a prop that takes one of a fixed set of values got another one. `hint` names the
 * likely intent, for example the prop the value belongs to.
 */
export function checkValue(
	component: string,
	prop: string,
	value: unknown,
	valid: readonly unknown[],
	hint?: string
): void {
	if (value == null || valid.includes(value)) return;
	const got = typeof value === 'string' ? `"${value}"` : `{${String(value)}}`;
	warn(
		'SV2002',
		`<${component}> got ${prop}=${got}. Valid values: ${valid.map(show).join(' | ')}.${hint ? ` ${hint}` : ''}`
	);
}

/** Warns when a form control has no accessible name: no label with text, and no ARIA name. */
export function warnUnnamed(
	component: string,
	control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null | undefined
): void {
	if (!control) return;
	// A label that wraps the control but holds no text names nothing.
	if ([...(control.labels ?? [])].some((label) => label.textContent?.trim())) return;
	if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')) return;
	warn(
		'SV5001',
		`<${component}> has no accessible name. Give it a label, or name it with aria-label or aria-labelledby.`
	);
}
