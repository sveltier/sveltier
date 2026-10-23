import { aurora, heritage, maison, milano, monolith, type ThemeDefinition } from 'sveltier';

export type PackId = 'monolith' | 'heritage' | 'aurora' | 'maison' | 'milano';
export type Mode = 'light' | 'dark';

export interface Pack {
	id: PackId;
	name: string;
	mood: string;
	type: string;
	shape: string;
	motion: string;
	suits: string;
	install: string;
}

/** The docs register every theme of every pack, so any explicit choice is restored without a flash. */
export const THEMES: Record<string, ThemeDefinition> = {
	...monolith,
	...heritage,
	...aurora,
	...maison,
	...milano
};

export const PACKS: Pack[] = [
	{
		id: 'monolith',
		name: 'Monolith',
		mood: 'Quiet luxury with Swiss precision. Monochrome, ink-black actions; colour only carries meaning. The default.',
		type: 'Geist for everything, Geist Mono for figures. Tight, confident headings.',
		shape: 'Soft 6–16px corners, layered low shadows, near-invisible borders.',
		motion: 'Crisp and short: 150–320ms, standard ease-out.',
		suits: 'SaaS, dashboards, developer and productivity tools, neo-banks.',
		install: '@fontsource-variable/geist @fontsource-variable/geist-mono'
	},
	{
		id: 'heritage',
		name: 'Heritage',
		mood: 'Private banking, editorial. Ivory paper, Oxford navy and brass, ruled lines.',
		type: 'Instrument Serif for display and figures, Instrument Sans for interface, IBM Plex Mono for data.',
		shape: 'Crisp 2–4px corners, hairline rules, small-caps labels, almost no shadow.',
		motion: 'Calm and weighted: 160–380ms, long damped ease.',
		suits: 'Wealth management, premium commerce, publishing, legal and advisory products.',
		install:
			'@fontsource/instrument-serif @fontsource-variable/instrument-sans @fontsource/ibm-plex-mono'
	},
	{
		id: 'aurora',
		name: 'Aurora',
		mood: 'Modern depth, dark first. Frosted panels over a soft iris and mint glow.',
		type: 'Manrope for display and interface, JetBrains Mono for figures. Bold, rounded headings.',
		shape: 'Generous 8–20px corners, translucent cards with blur, deep soft shadows.',
		motion: 'Fluid: 160–420ms, expressive expo ease-out.',
		suits: 'Consumer fintech, crypto, AI and creative tools, mobile-first apps.',
		install: '@fontsource-variable/manrope @fontsource-variable/jetbrains-mono'
	},
	{
		id: 'maison',
		name: 'Maison',
		mood: 'Parisian couture house. Noir and off-white, a single Bordeaux accent, nothing superfluous.',
		type: 'Cormorant Garamond for display and figures, Jost for interface, DM Mono for data. Wide-tracked capitals.',
		shape: 'Square corners everywhere, crisp hairlines, flat surfaces with no shadow.',
		motion: 'Slow and composed: 200–450ms, gentle ease-in-out.',
		suits:
			'Fashion and beauty, private clubs, hospitality, high-end retail and concierge services.',
		install: '@fontsource-variable/cormorant-garamond @fontsource-variable/jost @fontsource/dm-mono'
	},
	{
		id: 'milano',
		name: 'Milano',
		mood: 'Milanese design. Cashmere cream, espresso brown and Siena terracotta; warm and tactile.',
		type: 'Bodoni Moda for display and figures, Titillium Web for interface, IBM Plex Mono for data.',
		shape: 'Pill-shaped controls, softly rounded 14–18px cards, warm diffused shadows.',
		motion: 'Lively: 180–380ms with a light overshoot on moving parts.',
		suits: 'Lifestyle and design brands, food and travel, boutique banking, premium marketplaces.',
		install: '@fontsource-variable/bodoni-moda @fontsource/titillium-web @fontsource/ibm-plex-mono'
	}
];

export const isPack = (value: string): value is PackId => PACKS.some((p) => p.id === value);

/** Splits a theme choice such as "maison-dark" into its parts. */
export function parseChoice(choice: string): { mode: Mode | 'system'; pack?: PackId } {
	if (choice === 'system') return { mode: 'system' };
	const [pack, mode] = choice.split('-') as [string, Mode];
	return isPack(pack) ? { mode, pack } : { mode: 'system' };
}
