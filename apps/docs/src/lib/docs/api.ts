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
		default: 'monolith',
		description:
			'Root only. The registered themes, for example maison or { ...monolith, ...maison }.'
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
		default: 'base.dark ?? false',
		description: 'Whether the theme is dark. Picks Monolith dark or light as the base.'
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
		default: 'monolithLight / monolithDark',
		description: 'The theme to extend. It is never mutated.'
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
		type: "'flat' | 'tonal' | 'outlined' | 'text' | 'plain'",
		description:
			'sv-variant-<variant>: sets --sv-variant-bg, --sv-variant-fg and --sv-variant-border from the colour. plain also sets --sv-state-hover and --sv-state-press to 0%.'
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
