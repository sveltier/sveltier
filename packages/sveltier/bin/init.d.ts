/** Marks the start of the Sveltier block in AGENTS.md. */
export const START: string;
/** Marks the end of the Sveltier block in AGENTS.md. */
export const END: string;
/** The block for AGENTS.md, between its markers. */
export function agentsBlock(): string;
/** The text of an AGENTS.md with the block in it: replaced where the markers are, appended otherwise. */
export function withBlock(text: string, block: string): string;
/** Hooks the app in `root` up to the docs of the installed Sveltier, and says what it did. */
export function init(root: string): string[];
