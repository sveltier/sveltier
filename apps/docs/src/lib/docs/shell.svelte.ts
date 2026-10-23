import { getContext, setContext } from 'svelte';

/** State shared by the app bar and the docs sidebar (the mobile menu). */
export class Shell {
	menuOpen = $state(false);
}

const KEY = Symbol('docs.shell');

export const createShell = (): Shell => setContext(KEY, new Shell());
export const useShell = (): Shell => getContext<Shell>(KEY);
