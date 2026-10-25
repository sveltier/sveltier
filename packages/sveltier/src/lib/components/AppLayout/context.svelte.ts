import { getContext, hasContext, setContext } from 'svelte';

/** The navigation drawer of a layout, as the app bar's menu button sees it. */
export interface LayoutDrawer {
	/** Whether the modal drawer is open. */
	readonly open: boolean;
	/** The id of the modal drawer, for `aria-controls`. */
	readonly id: string;
	toggle(): void;
}

/** What an AppLayout shares with its parts. Internal. */
export class Layout {
	/** The id of the main content, which the skip link points to. */
	readonly mainId: string;
	/** The navigation drawer in the layout, if any. */
	drawer = $state.raw<LayoutDrawer | null>(null);
	/** The app bar's menu button, which gets focus back when the modal drawer closes. */
	menu = $state.raw<HTMLElement | null>(null);

	constructor(mainId: string) {
		this.mainId = mainId;
	}
}

const KEY = Symbol('sveltier.layout');

export const setLayout = (layout: Layout): Layout => setContext(KEY, layout);

/** The AppLayout around the component, or `undefined` outside one. */
export const getLayout = (): Layout | undefined =>
	hasContext(KEY) ? getContext<Layout>(KEY) : undefined;
