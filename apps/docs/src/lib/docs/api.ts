// Structured API reference for the theme engine. Plain data so the same source can feed the
// API pages and, later, machine-readable docs.

export interface ApiRow {
	name: string;
	type: string;
	default?: string;
	description: string;
}

export const THEME_PROVIDER_PROPS: ApiRow[] = [
	{
		name: 'theme',
		type: "'system' | string",
		default: "'system'",
		description:
			'The theme to show: a registered theme name, or "system" to follow prefers-color-scheme. Bindable. Nested providers inherit their parent’s choice when unset.'
	},
	{
		name: 'themes',
		type: 'Record<string, ThemeDefinition>',
		description:
			'Required at the root, where it registers the themes, for example monolith or { ...monolith, ...maison }. There is no default, so an app ships only the packs it registers.'
	},
	{
		name: 'light',
		type: 'string',
		default: 'first light theme',
		description: 'Root only. Theme used by "system" when the OS prefers light, and by toggle().'
	},
	{
		name: 'dark',
		type: 'string',
		default: 'first dark theme',
		description: 'Root only. Theme used by "system" when the OS prefers dark, and by toggle().'
	},
	{
		name: 'storageKey',
		type: 'string | false',
		default: "'sv-theme'",
		description:
			'Root only. localStorage key that remembers the choice and restores it before first paint. false turns persistence off.'
	},
	{
		name: 'nonce',
		type: 'string',
		description: 'Root only. CSP nonce added to the generated <style> and <script>.'
	},
	{
		name: 'withBackground',
		type: 'boolean',
		default: 'false',
		description: 'Nested only. Paints the scope with the theme’s background colour.'
	},
	{
		name: 'ref',
		type: 'HTMLDivElement | null',
		default: 'null',
		description: 'Nested only. Bindable reference to the wrapper element.'
	},
	{
		name: 'children',
		type: 'Snippet',
		description: 'The themed content.'
	},
	{
		name: '...rest',
		type: 'HTMLAttributes<HTMLDivElement>',
		description: 'Nested only. Spread on the wrapper element; class is merged.'
	}
];

export const THEME_INSTANCE: ApiRow[] = [
	{ name: 'choice', type: "'system' | string", description: 'The current choice.' },
	{
		name: 'name',
		type: 'string',
		description:
			'The theme in effect. With "system" it follows the OS; on the server it is the light theme.'
	},
	{
		name: 'current',
		type: 'ThemeDefinition',
		description: 'The definition of the theme in effect.'
	},
	{ name: 'isDark', type: 'boolean', description: 'Whether the theme in effect is dark.' },
	{
		name: 'themes',
		type: 'Readonly<Record<string, ThemeDefinition>>',
		description: 'All registered themes.'
	},
	{ name: 'light / dark', type: 'string', description: 'The pair used by "system" and toggle().' },
	{
		name: 'set(choice)',
		type: "(choice: 'system' | string) => void",
		description:
			'Selects a theme or "system". The root provider remembers it. Throws for unknown names.'
	},
	{
		name: 'toggle()',
		type: '() => void',
		description: 'Switches between the light and dark theme.'
	}
];

export const DEFINE_THEME: ApiRow[] = [
	{
		name: 'input.dark',
		type: 'boolean',
		default: 'base.dark',
		description: 'Whether the theme is dark.'
	},
	{
		name: 'input.colors',
		type: 'Partial<ThemeColors>',
		description:
			'Colours to override or add, as oklch() strings. Each overridden colour gets a fresh on- colour unless you pass one.'
	},
	{
		name: 'input.variables',
		type: 'Partial<ThemeVariables>',
		description: 'Theme contract variables to override, plus any extra custom properties.'
	},
	{
		name: 'base',
		type: 'ThemeDefinition',
		description:
			'Required. The theme to extend, usually a pack theme such as monolithLight. It is never mutated.'
	}
];

export const THEME_CSS: ApiRow[] = [
	{
		name: 'themeCss(options)',
		type: '(options: ThemeCssOptions) => string',
		description:
			'The stylesheet ThemeProvider writes: one rule per theme keyed by data-sv-theme and "system" as prefers-color-scheme media rules, in @layer sv.tokens; plus a .sv-color-<name> class for every colour with an on- colour, in @layer sv.base. Throws on unsafe names or values.'
	},
	{
		name: 'options.themes',
		type: 'Record<string, ThemeDefinition>',
		description: 'The themes to emit.'
	},
	{ name: 'options.light / dark', type: 'string', description: 'The pair used by "system".' },
	{
		name: 'options.fallback',
		type: "'system' | string",
		description: 'What a bare <html> (no data-sv-theme yet) shows.'
	},
	{
		name: 'themeScript(key, choices)',
		type: '(storageKey: string, choices: string[]) => string',
		description:
			'The render-blocking restore script. Exposed so a Content Security Policy can allow it by hash.'
	}
];

export const DEFAULTS_PROVIDER_PROPS: ApiRow[] = [
	{
		name: 'defaults',
		type: 'DefaultsConfig',
		description:
			'Defaults for this subtree. global reaches every component that has the prop; a key per component name targets one component. Merged over any outer provider, key by key. Reactive.'
	},
	{
		name: 'children',
		type: 'Snippet',
		description: 'The content that receives the defaults. The provider renders no element.'
	}
];

export const USE_DEFAULTS: ApiRow[] = [
	{
		name: 'name',
		type: 'string',
		description:
			'The component’s key in DefaultsConfig and ComponentDefaults, for example "PriceTag".'
	},
	{
		name: 'builtins',
		type: 'T',
		description:
			'Every defaultable prop with its built-in value. Only these keys are resolved, so global defaults never add a prop the component does not have.'
	},
	{
		name: 'returns',
		type: '(local: Partial<T>) => T',
		description:
			'A pure resolver. Call it inside $derived with the props as passed; undefined and null mean "not set".'
	}
];

export const DEFAULTS_TYPES: ApiRow[] = [
	{
		name: 'DefaultsConfig',
		type: '{ global?: GlobalDefaults } & { [Name in keyof ComponentDefaults]?: Partial<…> }',
		description:
			'What a DefaultsProvider takes. Unknown component names and values are type errors.'
	},
	{
		name: 'GlobalDefaults',
		type: 'Pick<SharedProps, "variant" | "density" | "size" | "color" | "rounded" | "disabled">',
		description: 'Defaults that reach every component which declares the prop.'
	},
	{
		name: 'ComponentDefaults',
		type: 'interface',
		description:
			'Per-component defaults keyed by component name. Sveltier’s components register here, and so can yours, by declaration merging.'
	}
];

export const SHARED_CLASSES: ApiRow[] = [
	{
		name: 'variant',
		type: "'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'",
		description:
			'sv-variant-<variant>: sets --sv-variant-bg, --sv-variant-fg, --sv-variant-border and --sv-variant-shadow from the colour. plain also sets --sv-state-hover and --sv-state-press to 0%.'
	},
	{
		name: 'color',
		type: 'Color',
		description:
			'sv-color-<name>: sets --sv-color and --sv-on-color. Intents and custom colours get their class from the theme stylesheet.'
	},
	{
		name: 'size',
		type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
		description: 'sv-size-<size>: sets --sv-size-height (a control height) and --sv-size-text.'
	},
	{
		name: 'density',
		type: "'compact' | 'default' | 'comfortable'",
		description: 'sv-density-<density>: sets --sv-density, a multiplier for heights and paddings.'
	},
	{
		name: 'rounded',
		type: "boolean | 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
		description:
			'sv-rounded (true) clears --sv-rounded so the component default applies; false and none give 0, sm–xl a theme radius, full a pill in every theme.'
	}
];

export const SHARED_TYPES: ApiRow[] = [
	{
		name: 'SharedProps',
		type: 'interface',
		description:
			'variant, density, size, color, rounded, disabled and loading: the props every component that has them declares with these names and values.'
	},
	{
		name: 'SharedClassProps',
		type: "Pick<SharedProps, 'variant' | 'density' | 'size' | 'color' | 'rounded'>",
		description: 'What sharedClasses takes.'
	},
	{
		name: 'Color',
		type: "IntentColor | 'neutral' | keyof CustomColors",
		description: 'A theme colour. Anything else is a type error.'
	},
	{
		name: 'CustomColors',
		type: 'interface',
		description: 'Register custom colours from defineTheme here by declaration merging.'
	},
	{
		name: 'VARIANTS / SIZES / DENSITIES',
		type: 'readonly tuples',
		description: 'The allowed values, for building controls or validating input.'
	}
];

export const DISPLAY_INSTANCE: ApiRow[] = [
	{
		name: 'name',
		type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'",
		description: 'The current breakpoint.'
	},
	{
		name: 'xs … xxl',
		type: 'boolean',
		description: 'Whether the viewport is within that breakpoint.'
	},
	{
		name: 'smAndUp … xlAndUp',
		type: 'boolean',
		description: 'Whether the viewport is at that breakpoint or wider.'
	},
	{
		name: 'smAndDown … xlAndDown',
		type: 'boolean',
		description: 'Whether the viewport is at that breakpoint or narrower.'
	},
	{
		name: 'mobile',
		type: 'boolean',
		description: 'Whether the viewport is narrower than the mobile breakpoint (md by default).'
	},
	{
		name: 'thresholds',
		type: 'Readonly<DisplayThresholds>',
		description: 'The minimum width in px of sm, md, lg, xl and xxl.'
	}
];

export const LOCALE_INSTANCE: ApiRow[] = [
	{
		name: 'locale',
		type: 'string',
		default: "'en-US'",
		description: 'The BCP 47 locale used for formatting.'
	},
	{
		name: 'currency',
		type: 'string',
		default: "'USD'",
		description: 'The ISO 4217 currency of formatCurrency().'
	},
	{
		name: 'timeZone',
		type: 'string | undefined',
		default: 'runtime zone',
		description: 'The IANA time zone of formatDate().'
	},
	{
		name: 't(key, values?)',
		type: '(key: MessageKey, values?: Record<string, string | number>) => string',
		description: 'A message, with {name} placeholders filled from values.'
	},
	{
		name: 'formatNumber(value, options?)',
		type: '(value: number | bigint, options?: Intl.NumberFormatOptions) => string',
		description: 'A number in the locale.'
	},
	{
		name: 'formatCurrency(value, currency?, options?)',
		type: '(value: number | bigint, currency?: string, options?) => string',
		description: 'Money, with the fraction digits of the currency (USD 2, JPY 0).'
	},
	{
		name: 'formatPercent(value, options?)',
		type: '(value: number, options?: Intl.NumberFormatOptions) => string',
		description: 'A ratio as a percentage: 0.0184 is 2%, or 1.84% with two fraction digits.'
	},
	{
		name: 'formatDate(value, options?)',
		type: '(value: Date | number, options?: Intl.DateTimeFormatOptions) => string',
		description: 'A date in the time zone setting, unless options.timeZone says otherwise.'
	},
	{
		name: 'formatRelative(value, now?)',
		type: '(value: Date | number, now?: Date | number) => string',
		description: 'Time from now in the largest unit that fits: "5 minutes ago", "tomorrow".'
	}
];

export const UI_PROVIDER_PROPS: ApiRow[] = [
	{
		name: 'themes',
		type: 'Record<string, ThemeDefinition>',
		description:
			'Required. The registered themes, for example monolith or { ...monolith, ...maison }. An app ships only the packs it registers.'
	},
	{
		name: 'theme',
		type: "'system' | string",
		default: "'system'",
		description: 'The theme to show, or "system" to follow prefers-color-scheme. Bindable.'
	},
	{
		name: 'light / dark',
		type: 'string',
		default: 'first light / dark theme',
		description: 'The pair used by "system" and toggle().'
	},
	{
		name: 'storageKey',
		type: 'string | false',
		default: "'sv-theme'",
		description:
			'Where the theme choice is remembered and restored before first paint. false turns it off.'
	},
	{
		name: 'nonce',
		type: 'string',
		description: 'CSP nonce for the generated <style> and <script>.'
	},
	{
		name: 'defaults',
		type: 'DefaultsConfig',
		description: 'Default props for every component below: global, and per component.'
	},
	{
		name: 'display',
		type: 'DisplayOptions',
		description:
			'Breakpoint thresholds, the mobile breakpoint and the width assumed on the server (ssrWidth). Read once.'
	},
	{
		name: 'locale',
		type: 'LocaleOptions',
		description: 'Locale, currency, time zone and messages. Changes apply at once.'
	},
	{
		name: 'children',
		type: 'Snippet',
		description: 'The app.'
	}
];

export const FOCUS_TRAP_OPTIONS: ApiRow[] = [
	{
		name: 'initialFocus',
		type: 'HTMLElement | SVGElement | string | false',
		default: 'first tabbable',
		description:
			'Where focus goes when the trap starts, unless it is already inside: an element, a selector inside the container, or false to leave it. With nothing tabbable inside, the container itself takes focus.'
	},
	{
		name: 'returnFocus',
		type: 'boolean | HTMLElement | SVGElement | null',
		default: 'true',
		description:
			'Where focus goes when the trap ends, if it is still inside or lost to the page: true for the element that had it when the trap started, an element (pass the trigger, since Safari does not focus a clicked button), or false.'
	}
];

export const ROVING_FOCUS_OPTIONS: ApiRow[] = [
	{
		name: 'orientation',
		type: "'horizontal' | 'vertical' | 'both'",
		default: "'horizontal'",
		description: 'Which arrow keys move. Left and right follow the writing direction.'
	},
	{
		name: 'loop',
		type: 'boolean',
		default: 'true',
		description: 'Wrap from the last item to the first and back.'
	},
	{
		name: 'items',
		type: 'string',
		default: "'[data-sv-item]'",
		description: 'Selector for the items inside the container.'
	}
];

export const DISMISSABLE_OPTIONS: ApiRow[] = [
	{
		name: 'onDismiss',
		type: "(reason: 'escape' | 'outside' | 'focus') => void",
		description: 'Called when the user dismisses the layer. The component decides whether to close.'
	},
	{
		name: 'escape',
		type: 'boolean',
		default: 'true',
		description: 'Dismiss on Escape, unless an element inside handled it (event.preventDefault()).'
	},
	{
		name: 'outside',
		type: 'boolean',
		default: 'true',
		description:
			'Dismiss on a press outside: on pointerdown for mouse and pen, on the click that ends a tap for touch.'
	},
	{
		name: 'focusOutside',
		type: 'boolean',
		default: 'false',
		description: 'Dismiss when focus moves outside, as menus and non-modal popovers do on Tab.'
	},
	{
		name: 'inside',
		type: 'Element[] | (() => Element[])',
		default: '[]',
		description: 'Elements that count as inside, such as the trigger.'
	}
];

export const PORTAL_PROPS: ApiRow[] = [
	{
		name: 'target',
		type: 'HTMLElement | string',
		default: "'body'",
		description: 'Where the content goes: an element, or a selector for one.'
	},
	{
		name: 'children',
		type: 'Snippet',
		description: 'The content, rendered with the contexts and theme scope of where Portal is used.'
	}
];

export const ANCHORED_OPTIONS: ApiRow[] = [
	{
		name: 'anchor',
		type: 'Element | null | undefined',
		description: 'The element to place against. Nothing happens until it exists.'
	},
	{
		name: 'side',
		type: "'top' | 'bottom' | 'start' | 'end'",
		default: "'bottom'",
		description: 'Side of the anchor. Start and end follow the writing direction.'
	},
	{
		name: 'align',
		type: "'start' | 'center' | 'end'",
		default: "'start'",
		description: 'Alignment along that side, following the writing direction.'
	},
	{
		name: 'offset',
		type: 'number',
		default: '5',
		description: 'Gap between the anchor and the element, in px.'
	},
	{
		name: 'flip',
		type: 'boolean',
		default: 'true',
		description: 'Move to the opposite side when there is not enough room.'
	}
];

export const KEYMAP_API: ApiRow[] = [
	{
		name: 'keymap(map)',
		type: '(map: Record<string, KeyHandler>) => Attachment',
		description:
			'Calls the handler bound to a key combination and prevents the default when it ran. A handler returning false lets the event through.'
	},
	{
		name: 'combinations',
		type: "'Ctrl+Alt+Shift+Meta+Key'",
		description:
			'Modifiers in that order, then the event.key name. Shift is left out for characters ("?", not "Shift+/"). ArrowForward and ArrowBackward follow the writing direction.'
	}
];

export const TYPEAHEAD_OPTIONS: ApiRow[] = [
	{
		name: 'items',
		type: 'string',
		default: "'[data-sv-item]'",
		description: 'Selector for the items inside the container.'
	},
	{
		name: 'timeout',
		type: 'number',
		default: '500',
		description: 'How long typed characters keep building one search, in ms.'
	},
	{
		name: 'onMatch',
		type: '(item: HTMLElement) => void',
		default: 'focus the item',
		description: 'What a match does.'
	}
];

export const TRANSITION_OPTIONS: ApiRow[] = [
	{
		name: 'duration',
		type: 'number',
		default: "the theme's normal duration",
		description: 'Length in ms. Under reduced motion the theme duration is 0.01ms.'
	},
	{
		name: 'delay',
		type: 'number',
		default: '0',
		description: 'Wait before starting, in ms.'
	},
	{
		name: 'distance',
		type: 'number',
		default: '8',
		description: 'rise only: how far the element travels, in px.'
	},
	{
		name: 'scale',
		type: 'number',
		default: '0.944',
		description: 'pop only: the scale it grows from, 1 − φ⁻⁶.'
	}
];

export const SPRING_API: ApiRow[] = [
	{
		name: 'spring(value, preset)',
		type: '<T>(value: T, preset?: SpringPreset) => Spring<T>',
		default: "'standard'",
		description:
			'A Svelte Spring with a preset. Set target to move it and render current. While the user prefers reduced motion, updates land at once unless set() is called with instant: false.'
	},
	{
		name: 'snappy',
		type: '{ stiffness: 0.236, damping: 0.764 }',
		description: '1/φ³. Small, quick things: toggles, thumbs, indicators.'
	},
	{
		name: 'standard',
		type: '{ stiffness: 0.146, damping: 0.854 }',
		description: "1/φ⁴, close to Svelte's own default. Most movement."
	},
	{
		name: 'gentle',
		type: '{ stiffness: 0.09, damping: 0.91 }',
		description: '1/φ⁵. Large surfaces and numbers that count up or down.'
	}
];

export const MOTION_API: ApiRow[] = [
	{
		name: 'motion(element)',
		type: '(element: Element) => Motion',
		description:
			'The timing where the element is: fast, normal and slow in ms, and ease as a CSS easing. Call it in the browser, from an attachment, an effect or a handler.'
	},
	{
		name: 'easing(ease)',
		type: '(ease: string) => (t: number) => number',
		description:
			'A CSS easing as a function. Reads cubic-bezier() and the keywords; anything else falls back to ease.'
	},
	{
		name: 'cubicBezier(x1, y1, x2, y2)',
		type: '(x1: number, y1: number, x2: number, y2: number) => (t: number) => number',
		description: 'An easing function from control points, as CSS defines them.'
	}
];

export const VIRTUAL_LIST_OPTIONS: ApiRow[] = [
	{
		name: 'count',
		type: 'number',
		description: 'How many items the list has.'
	},
	{
		name: 'itemSize',
		type: 'number | ((index: number) => number)',
		description:
			'Item height in px: one number when every item is as tall, or an estimate per index. Measured items use their measurement.'
	},
	{
		name: 'overscan',
		type: 'number',
		default: '3',
		description: 'Items rendered beyond each edge of the viewport, so fast scrolling shows no gaps.'
	},
	{
		name: 'key',
		type: '(index: number) => string | number',
		default: 'the index',
		description:
			'A stable key per item, so measured heights follow items that move. It is read for every item when measurements change, so keep large data in $state.raw.'
	},
	{
		name: 'ssrHeight',
		type: 'number',
		default: '0',
		description: 'Viewport height in px assumed until the viewport is measured, as on the server.'
	}
];

export const VIRTUAL_LIST_API: ApiRow[] = [
	{
		name: 'items',
		type: 'VirtualItem[]',
		description:
			'The items to render, each with index, key, and start, size and end in px from the top of the list.'
	},
	{
		name: 'totalSize',
		type: 'number',
		description: 'Height of all the items in px, for the element that holds them.'
	},
	{
		name: 'viewport',
		type: 'Attachment<HTMLElement>',
		description:
			"For the scrolling element. Turns off the browser's scroll anchoring there: the list keeps items steady itself."
	},
	{
		name: 'measure',
		type: 'Attachment<HTMLElement>',
		description: 'For items whose height is measured. They need data-index={item.index}.'
	},
	{
		name: 'scrollToIndex(index, options)',
		type: "(index: number, options?: { align?: 'auto' | 'start' | 'center' | 'end' }) => void",
		description:
			'Scrolls the item into view at once and renders it in the same update, then keeps it in place while the rows around it are measured. auto moves as little as possible, and not at all when the item is in view. Indexes outside the list are ignored.'
	}
];
