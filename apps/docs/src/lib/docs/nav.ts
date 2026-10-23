// The docs navigation. One source for the sidebar, previous/next links, page eyebrows and
// the test suites that visit every page.

export interface NavItem {
	title: string;
	/** Pathname without a leading slash, as SvelteKit's resolve() expects. */
	path: string;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

export const NAV: NavGroup[] = [
	{
		title: 'Getting started',
		items: [
			{ title: 'Installation', path: 'getting-started/installation' },
			{ title: 'Quick start', path: 'getting-started/quick-start' },
			{ title: 'Fonts', path: 'getting-started/fonts' },
			{ title: 'Server-side rendering', path: 'getting-started/server-rendering' }
		]
	},
	{
		title: 'Theming',
		items: [
			{ title: 'Overview', path: 'theming' },
			{ title: 'Custom themes', path: 'theming/custom-themes' },
			{ title: 'Theme contract', path: 'theming/contract' },
			{ title: 'Colours', path: 'theming/colors' },
			{ title: 'Design scale', path: 'theming/scale' }
		]
	},
	{
		title: 'Theme packs',
		items: [
			{ title: 'All packs', path: 'theme-packs' },
			{ title: 'Monolith', path: 'theme-packs/monolith' },
			{ title: 'Heritage', path: 'theme-packs/heritage' },
			{ title: 'Aurora', path: 'theme-packs/aurora' },
			{ title: 'Maison', path: 'theme-packs/maison' },
			{ title: 'Milano', path: 'theme-packs/milano' }
		]
	},
	{
		title: 'Core',
		items: [
			{ title: 'Defaults', path: 'core/defaults' },
			{ title: 'Shared props', path: 'core/shared-props' },
			{ title: 'Display', path: 'core/display' },
			{ title: 'Locale', path: 'core/locale' },
			{ title: 'Building components', path: 'core/building-components' }
		]
	},
	{
		title: 'Primitives',
		items: [
			{ title: 'Focus', path: 'primitives/focus' },
			{ title: 'Layers', path: 'primitives/layers' }
		]
	},
	{
		title: 'Accessibility',
		items: [{ title: 'Overview', path: 'accessibility' }]
	},
	{
		title: 'API',
		items: [
			{ title: 'UIProvider', path: 'api/ui-provider' },
			{ title: 'ThemeProvider', path: 'api/theme-provider' },
			{ title: 'useTheme', path: 'api/use-theme' },
			{ title: 'defineTheme', path: 'api/define-theme' },
			{ title: 'themeCss and themeScript', path: 'api/theme-css' },
			{ title: 'DefaultsProvider', path: 'api/defaults-provider' },
			{ title: 'useDefaults', path: 'api/use-defaults' },
			{ title: 'sharedClasses', path: 'api/shared-classes' },
			{ title: 'useDisplay', path: 'api/use-display' },
			{ title: 'useLocale', path: 'api/use-locale' }
		]
	}
];

export const FLAT: Array<NavItem & { group: string }> = NAV.flatMap((group) =>
	group.items.map((item) => ({ ...item, group: group.title }))
);

/** Normalises a URL pathname (with or without base, slashes) to a nav path. */
export function toNavPath(pathname: string, base = ''): string {
	return pathname.slice(base.length).replace(/^\/+|\/+$/g, '');
}

export function locate(path: string) {
	const index = FLAT.findIndex((item) => item.path === path);
	return {
		current: FLAT[index],
		previous: index > 0 ? FLAT[index - 1] : undefined,
		next: index >= 0 && index < FLAT.length - 1 ? FLAT[index + 1] : undefined
	};
}
