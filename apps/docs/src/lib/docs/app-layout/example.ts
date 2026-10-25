// The example app of the App layout page: a small bank whose pages are routes under
// /examples/app-layout/[corner]/[page]. The corner says which part is written first.

export const CORNERS = ['bar', 'drawer'] as const;
export type Corner = (typeof CORNERS)[number];

export interface ExamplePage {
	id: string;
	title: string;
	/** SVG path data on a 24px grid. */
	icon: string;
}

export const PAGES: ExamplePage[] = [
	{ id: 'overview', title: 'Overview', icon: 'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z' },
	{
		id: 'accounts',
		title: 'Accounts',
		icon: 'M12 2 2 7v2h20V7zM4 11h3v7H4zm6.5 0h3v7h-3zM17 11h3v7h-3zM2 20h20v2H2z'
	},
	{
		id: 'payments',
		title: 'Payments',
		icon: 'M4 7h12.2l-3.6-3.6L14 2l6 6-6 6-1.4-1.4 3.6-3.6H4zm16 10H7.8l3.6 3.6L10 22l-6-6 6-6 1.4 1.4L7.8 15H20z'
	},
	{
		id: 'cards',
		title: 'Cards',
		icon: 'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2zm0 5h20v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z'
	},
	{
		id: 'settings',
		title: 'Settings',
		icon: 'M3 6h10v2H3zm14 0h4v2h-4zm-2-2h2v6h-2zM3 16h4v2H3zm8 0h10v2H11zm-2-2h2v6H9z'
	}
];
