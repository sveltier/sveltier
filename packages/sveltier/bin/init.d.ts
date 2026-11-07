/** Marks the start of the Sveltier block in AGENTS.md. */
export const START: string;
/** Marks the end of the Sveltier block in AGENTS.md. */
export const END: string;

/** Where init writes: the app, the repository root above it, and the installed package. */
export interface Location {
	app: string;
	root: string;
	installed: string;
}

/**
 * Finds the repository root above `app` (the first folder with .git or pnpm-workspace.yaml,
 * below the home folder) and the installed package as the app sees it.
 */
export function locate(app: string): Location;
/** The block for the app's AGENTS.md, between its markers, with paths written from the app. */
export function agentsBlock(where?: Location): string;
/** The text of an AGENTS.md with the block in it: replaced where the markers are, appended otherwise. */
export function withBlock(text: string, block: string): string;
/** Hooks the app in `app` up to the docs of the installed Sveltier, and says what it did. */
export function init(app: string): string[];
