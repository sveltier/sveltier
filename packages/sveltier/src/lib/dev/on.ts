// Development-only checks, imported as `#dev`. Under the "development" condition (the Vite dev
// server, Vitest) bundlers load this module; production builds and plain Node load ./off.js,
// whose functions do nothing. Callers also guard with `if (DEV)`, so production bundles drop
// the calls as well.
import { parseIso } from '../components/Calendar/dates.js';
import type { MenuAction, MenuItem } from '../components/Menu/types.js';
import { parseClock } from '../components/TimeField/time.js';
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

// The forms of the date and time props, as the native date, time and datetime-local inputs
// write them, with an example of each.
const FORMS = {
	date: { pattern: 'YYYY-MM-DD', example: '2026-10-26', read: (text: string) => !!parseIso(text) },
	time: { pattern: 'HH:mm', example: '09:30', read: (text: string) => parseClock(text) !== null },
	'date-time': {
		pattern: 'YYYY-MM-DDTHH:mm',
		example: '2026-10-26T09:30',
		read: (text: string) => {
			const [date, time, extra] = text.split('T');
			return extra === undefined && !!parseIso(date) && parseClock(time) !== null;
		}
	}
};

/**
 * Warns when a date or time prop is not in the form the components read: `YYYY-MM-DD` for a
 * date, `HH:mm` for a time, `YYYY-MM-DDTHH:mm` for both. A `Date`, a timestamp, another order or
 * a day that does not exist cannot be read. An empty string means none.
 */
export function checkDate(
	component: string,
	prop: string,
	value: unknown,
	kind: keyof typeof FORMS = 'date'
): void {
	const form = FORMS[kind];
	if (value == null || value === '' || (typeof value === 'string' && form.read(value))) return;
	const got = typeof value === 'string' ? `"${value}"` : `{${String(value)}}`;
	const what = kind === 'date' ? 'a date' : kind === 'time' ? 'a time' : 'a date and time';
	warn(
		'SV5002',
		`<${component}> got ${prop}=${got}, which is not ${what} as ${form.pattern}. Pass one such as "${form.example}", with no time zone, or null for none.`
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
 * Warns when a list prop names two of its entries with the same key, so the component cannot
 * tell them apart. `entries` names them as the message says it ("columns"); `fix` says what to
 * change.
 */
export function warnDuplicates(
	component: string,
	entries: string,
	keys: readonly unknown[],
	fix: string
): void {
	const duplicate = keys.find((key, i) => keys.indexOf(key) !== i);
	if (duplicate === undefined) return;
	warn('SV4005', `<${component}> has two ${entries} with the key ${show(duplicate)}. ${fix}`);
}

/**
 * Warns when the radio items of a menu are not one choice of their group (the items between two
 * headings or separators): the group also has other items, or checks more than one radio.
 */
export function warnRadioGroups(component: string, items: readonly MenuItem[]): void {
	let group: MenuAction[] = [];
	for (const item of [...items, { separator: true } as const]) {
		if ('label' in item) {
			group.push(item);
			continue;
		}
		const radios = group.filter((action) => action.radio);
		const problem =
			radios.length < group.length
				? 'also has items that are not radios'
				: radios.filter((radio) => radio.checked).length > 1 && 'checks more than one';
		if (radios.length && problem) {
			const labels = radios.map((radio) => show(radio.label)).join(', ');
			warn(
				'SV4009',
				`<${component}> has a group with the radios ${labels} that ${problem}. A group is the items between two headings or separators: give the radios one of their own and check one, such as checked: layout === value.`
			);
		}
		group = [];
	}
}

/** Warns when a row of a description list is not inside one (`<dl>`). */
export function warnOutsideList(component: string, element: HTMLElement | null | undefined): void {
	if (!element || element.parentElement?.closest('dl')) return;
	warn(
		'SV4006',
		`<${component}> is not inside a <dl>, so its label and value are not paired for screen readers. Put it inside a Ledger or a Receipt.`
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
		`<${component}> is not directly inside <AppLayout>, so the layout's grid cannot place it. Write AppBar, NavigationDrawer, Main and AppFooter straight inside AppLayout, and put wrappers inside Main.`
	);
}

/** Warns when a prop is passed under the name it had before it was renamed. */
export function warnRenamed(component: string, old: string, now: string, value: unknown): void {
	if (value === undefined) return;
	warn(
		'SV4008',
		`<${component}> takes ${now}; ${old} is its old name and does nothing now. Use ${now} instead.`
	);
}

/**
 * Warns when the control a tooltip is on does not point at the tooltip: an `aria-describedby`
 * written after the tooltip's attributes, such as a badge's, replaced its id.
 */
export function warnLostDescription(component: string, element: HTMLElement, id: string): void {
	const ids = element.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
	if (ids.includes(id)) return;
	warn(
		'SV4007',
		`<${component}> no longer describes its control: the control's aria-describedby (${show(ids.join(' '))}) replaced the tooltip's id '${id}'. Join them, the tooltip's first: aria-describedby={[attributes['aria-describedby'], 'other-id'].join(' ')}.`
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
