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

/**
 * Warns when a form control or a dialog has no accessible name: no label with text, and no ARIA
 * name. `give` names what to add, as the message says it ("a label", "a title").
 */
export function warnUnnamed(
	component: string,
	element: (HTMLElement & { labels?: NodeListOf<HTMLLabelElement> | null }) | null | undefined,
	give = 'a label'
): void {
	if (!element) return;
	// A label that wraps the control but holds no text names nothing.
	if ([...(element.labels ?? [])].some((label) => label.textContent?.trim())) return;
	if (element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')) return;
	warn(
		'SV5001',
		`<${component}> has no accessible name. Give it ${give}, or name it with aria-label or aria-labelledby.`
	);
}

/**
 * Warns when a part of an AppLayout is not one of its own children, so the layout's grid cannot
 * place it.
 */
export function warnMisplaced(component: string, element: HTMLElement | null | undefined): void {
	if (!element || element.parentElement?.classList.contains('sv-app-layout')) return;
	warn(
		'SV4004',
		`<${component}> is not directly inside <AppLayout>, so the layout's grid cannot place it. Write AppBar, NavigationDrawer and Main straight inside AppLayout, and put wrappers inside Main.`
	);
}

/**
 * Warns when a tooltip describes a control that has no accessible name: a description names
 * nothing, so an icon-only button would be announced as just "button".
 */
export function warnNamelessTrigger(
	component: string,
	element: HTMLElement & { labels?: NodeListOf<HTMLLabelElement> | null }
): void {
	if (
		element.textContent?.trim() ||
		element.querySelector('img[alt]:not([alt=""])') ||
		['aria-label', 'aria-labelledby', 'title'].some((name) => element.getAttribute(name)) ||
		[...(element.labels ?? [])].some((label) => label.textContent?.trim())
	) {
		return;
	}
	warn(
		'SV4002',
		`<${component}> describes a control that has no accessible name. A tooltip adds a description, not a name: give the control aria-label, as every icon-only button needs, or visible text.`
	);
}
