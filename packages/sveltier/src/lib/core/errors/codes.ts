/**
 * What an error code means: shown on the docs' errors page and in llms-full.txt. Code is marked
 * with backticks, as in Markdown.
 */
export interface ErrorEntry {
	/** The problem in a few words. */
	title: string;
	/** Why the library refuses. */
	cause: string;
	/** What to change. */
	fix: string;
}

/**
 * Every error Sveltier throws, by stable code. Thrown messages start with
 * `[sveltier SVxxxx]` and end with a link to the code's entry in the docs. A code keeps its
 * meaning forever; its words may improve. Codes group by area: 1xxx themes, 2xxx the core
 * engine, 3xxx primitives, 4xxx components, 5xxx forms.
 *
 * @example
 * import { ERROR_CODES } from 'sveltier';
 * ERROR_CODES.SV1001.fix; // "Pass at least one theme pack: …"
 */
export const ERROR_CODES = {
	SV1001: {
		title: 'The root ThemeProvider has no themes',
		cause:
			'The outermost `<ThemeProvider>`, which `<UIProvider>` renders, registers the themes an app can show. None were passed, so there is nothing to paint.',
		fix: "Pass at least one theme pack: `themes={monolith}` from `'sveltier/themes/monolith'`, or several at once: `themes={{ ...monolith, ...maison }}`."
	},
	SV1002: {
		title: 'Unknown theme',
		cause:
			'A theme was chosen by a name that is not registered: through the `theme` prop, `useTheme().set()`, or the `light`, `dark` or `fallback` options of `themeCss()`.',
		fix: 'Use a registered name, such as `"monolith-light"`, or `"system"` to follow the operating system. To offer another theme, register it in the `themes` of the root provider.'
	},
	SV1003: {
		title: 'Invalid colour or variable name',
		cause:
			'The colours and variables of a theme become CSS custom properties, so their names must be valid identifiers.',
		fix: 'Start the name with a letter and use only letters, digits, `-` and `_`, for example `brand` or `radius-card`.'
	},
	SV1004: {
		title: 'Unsafe theme value',
		cause:
			'Theme values are written into a `<style>` element. A value containing `<`, `>`, `{`, `}` or `;` could end the rule or the element early.',
		fix: 'Use a plain CSS value, such as `oklch(0.62 0.19 255)` or `8px`.'
	},
	SV1005: {
		title: 'Invalid theme name',
		cause: 'Theme names are written into the `data-sv-theme` attribute and its CSS selectors.',
		fix: 'Start the name with a letter and use only letters, digits, `-` and `_`. `"system"` is reserved for following the operating system.'
	},
	SV1006: {
		title: 'Invalid nonce',
		cause:
			"The nonce is copied into the attributes of the theme's `<style>` and `<script>`, so it must be a plain base64 value.",
		fix: "Pass the nonce of your Content Security Policy as it is, for example SvelteKit's `%sveltekit.nonce%`."
	},
	SV1007: {
		title: 'useTheme() outside a ThemeProvider',
		cause:
			'`useTheme()` reads the theme from the component tree, and there is no `<UIProvider>` or `<ThemeProvider>` above the component that called it.',
		fix: 'Wrap the app in `<UIProvider>` in the root layout, and call `useTheme()` while a component inside it initialises.'
	},
	SV2001: {
		title: 'Display thresholds out of order',
		cause: 'Breakpoints are minimum widths, so each one must be wider than the one before it.',
		fix: 'Give widths that increase from `sm` to `xxl`, for example `{ sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 }`.'
	},
	SV3001: {
		title: 'Portal target not found',
		cause:
			'A Portal moves its content into its target, and no element matched the target selector when the Portal mounted.',
		fix: 'Render the target before the Portal, correct the selector, or pass the element itself.'
	},
	SV3002: {
		title: 'Invalid item size',
		cause:
			'`virtualList` places items by their sizes, so every size must be a positive number of pixels.',
		fix: 'Pass a positive number, or a function that returns one for every index. For items whose size is unknown, pass an estimate and measure them with `{@attach list.measure}`.'
	},
	SV3003: {
		title: 'Measured item without an index',
		cause:
			'`list.measure` reads the index of each measured element from its `data-index` attribute.',
		fix: 'Add `data-index={item.index}` to every element that has `{@attach list.measure}`.'
	},
	SV4001: {
		title: 'Closable chip that is also a button or a link',
		cause:
			'A closable chip contains a close button, and a button cannot be placed inside another button or a link.',
		fix: 'Keep the chip `closable` and put its action in a `Button` next to it, or remove `closable`.'
	}
} as const satisfies Record<`SV${number}`, ErrorEntry>;

/** A stable error code, such as `'SV1001'`. */
export type ErrorCode = keyof typeof ERROR_CODES;
