/**
 * What an error code means: shown on the docs' errors page and in llms-full.txt. Code is marked
 * with backticks, as in Markdown.
 */
export interface ErrorEntry {
	/** `error` is thrown in every build; `warning` is logged in development only. */
	kind: 'error' | 'warning';
	/** The problem in a few words. */
	title: string;
	/** Why the library refuses. */
	cause: string;
	/** What to change. */
	fix: string;
}

/**
 * Every error Sveltier throws or warns with, by stable code. Thrown messages start with
 * `[sveltier SVxxxx]` and end with a link to the code's entry in the docs. A code keeps its
 * meaning forever; its words may improve. Codes group by area: 1xxx themes, 2xxx the core
 * engine, 3xxx primitives, 4xxx components, 5xxx forms.
 *
 * @example
 * import { ERROR_CODES } from '@sveltier/ui';
 * ERROR_CODES.SV1001.fix; // "Pass at least one theme pack: …"
 */
export const ERROR_CODES = {
	SV1001: {
		kind: 'error',
		title: 'The root ThemeProvider has no themes',
		cause:
			'The outermost `<ThemeProvider>`, which `<UIProvider>` renders, registers the themes an app can show. None were passed, so there is nothing to paint.',
		fix: "Pass at least one theme pack: `themes={monolith}` from `'@sveltier/ui/themes/monolith'`, or several at once: `themes={{ ...monolith, ...maison }}`."
	},
	SV1002: {
		kind: 'error',
		title: 'Unknown theme',
		cause:
			'A theme was chosen by a name that is not registered: through the `theme` prop, `useTheme().set()`, or the `light`, `dark` or `fallback` options of `themeCss()`.',
		fix: 'Use a registered name, such as `"monolith-light"`, or `"system"` to follow the operating system. To offer another theme, register it in the `themes` of the root provider.'
	},
	SV1003: {
		kind: 'error',
		title: 'Invalid colour or variable name',
		cause:
			'The colours and variables of a theme become CSS custom properties, so their names must be valid identifiers.',
		fix: 'Start the name with a letter and use only letters, digits, `-` and `_`, for example `brand` or `radius-card`.'
	},
	SV1004: {
		kind: 'error',
		title: 'Unsafe theme value',
		cause:
			'Theme values are written into a `<style>` element. A value containing `<`, `>`, `{`, `}` or `;` could end the rule or the element early.',
		fix: 'Use a plain CSS value, such as `oklch(0.62 0.19 255)` or `8px`.'
	},
	SV1005: {
		kind: 'error',
		title: 'Invalid theme name',
		cause: 'Theme names are written into the `data-sv-theme` attribute and its CSS selectors.',
		fix: 'Start the name with a letter and use only letters, digits, `-` and `_`. `"system"` is reserved for following the operating system.'
	},
	SV1006: {
		kind: 'error',
		title: 'Invalid nonce',
		cause:
			"The nonce is copied into the attributes of the theme's `<style>` and `<script>`, so it must be a plain base64 value.",
		fix: "Pass the nonce of your Content Security Policy as it is, for example SvelteKit's `%sveltekit.nonce%`."
	},
	SV1007: {
		kind: 'error',
		title: 'useTheme() outside a ThemeProvider',
		cause:
			'`useTheme()` reads the theme from the component tree, and there is no `<UIProvider>` or `<ThemeProvider>` above the component that called it.',
		fix: 'Wrap the app in `<UIProvider>` in the root layout, and call `useTheme()` while a component inside it initialises.'
	},
	SV2001: {
		kind: 'error',
		title: 'Display thresholds out of order',
		cause: 'Breakpoints are minimum widths, so each one must be wider than the one before it.',
		fix: 'Give widths that increase from `sm` to `xxl`, for example `{ sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 }`.'
	},
	SV2002: {
		kind: 'warning',
		title: 'Invalid prop value',
		cause:
			'A prop that takes one of a fixed set of values got another one, for example `variant="primary"` on a `Button`. Types catch this when the code is checked; the warning catches values that get past them, such as data from an API.',
		fix: 'Use one of the values the message lists. The type of the prop and the props table of the component list them too.'
	},
	SV3001: {
		kind: 'error',
		title: 'Portal target not found',
		cause:
			'A Portal moves its content into its target, and no element matched the target selector when the Portal mounted.',
		fix: 'Render the target before the Portal, correct the selector, or pass the element itself.'
	},
	SV3002: {
		kind: 'error',
		title: 'Invalid item size',
		cause:
			'`virtualList` places items by their sizes, so every size must be a positive number of pixels.',
		fix: 'Pass a positive number, or a function that returns one for every index. For items whose size is unknown, pass an estimate and measure them with `{@attach list.measure}`.'
	},
	SV3003: {
		kind: 'error',
		title: 'Measured item without an index',
		cause:
			'`list.measure` reads the index of each measured element from its `data-index` attribute.',
		fix: 'Add `data-index={item.index}` to every element that has `{@attach list.measure}`.'
	},
	SV4001: {
		kind: 'error',
		title: 'Closable chip that is also a button or a link',
		cause:
			'A closable chip contains a close button, and a button cannot be placed inside another button or a link.',
		fix: 'Keep the chip `closable` and put its action in a `Button` next to it, or remove `closable`.'
	},
	SV4002: {
		kind: 'warning',
		title: 'Tooltip on a control without an accessible name',
		cause:
			'A tooltip describes the control it is on; it does not name it. A control with no text, `aria-label` or `aria-labelledby`, such as an icon-only button, is announced without a name.',
		fix: 'Give the control `aria-label`, as every icon-only button needs, or visible text. The tooltip can then say more than the name.'
	},
	SV4003: {
		kind: 'error',
		title: 'useToast() outside a UIProvider',
		cause:
			'`useToast()` reads the toasts from the component tree, and there is no `<UIProvider>` or `<ToastProvider>` above the component that called it.',
		fix: 'Wrap the app in `<UIProvider>` in the root layout, or in `<ToastProvider>` when it uses `<ThemeProvider>` alone, and call `useToast()` while a component inside it initialises.'
	},
	SV4004: {
		kind: 'warning',
		title: 'Layout part not directly inside AppLayout',
		cause:
			'`AppLayout` places `AppBar`, `NavigationDrawer` and `Main` on its grid by area, which works only for its own children. A part inside another element takes no area: it lands in a cell of its own, and the content can sit under the bar or beside an empty drawer.',
		fix: 'Write `AppBar`, `NavigationDrawer` and `Main` straight inside `AppLayout`, with no element around them. Put padding and wrappers inside `Main`.'
	},
	SV4005: {
		kind: 'warning',
		title: 'Two entries of a list with the same key',
		cause:
			'A component tells the entries of a list prop apart by their keys, as a `Table` does its columns by `key` or `id`. Two entries with the same key are one to the component: a sort or an update meant for one reaches the other.',
		fix: 'Give every entry its own key. For two `Table` columns that show the same property, keep `key` on one and give the other an `id` with a `value` function.'
	},
	SV5001: {
		kind: 'warning',
		title: 'Field, dialog or table without an accessible name',
		cause:
			'Assistive technology announces a form control, a dialog or a table by its name, and this one has no label, title, caption, `aria-label` or `aria-labelledby`.',
		fix: 'Give a field a `label`, a dialog a `title` and a table a `caption`, or name it with `aria-label`, or with `aria-labelledby` when its name is visible elsewhere.'
	}
} as const satisfies Record<`SV${number}`, ErrorEntry>;

/** A stable error code, such as `'SV1001'`. */
export type ErrorCode = keyof typeof ERROR_CODES;
