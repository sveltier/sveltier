import type { Attachment } from 'svelte/attachments';

export const CLOSE_REASONS = ['escape', 'outside', 'focus', 'action'] as const;

/**
 * Why an overlay closed itself: `'escape'` (the Escape key), `'outside'` (a press outside it,
 * on the backdrop of a modal), `'focus'` (focus moved out of a menu or a popover) or `'action'`
 * (its close button, `close()` from its snippets, or a choice made in it).
 */
export type CloseReason = (typeof CLOSE_REASONS)[number];

/**
 * What an overlay passes to its `trigger` snippet: the ARIA that ties the control to the
 * overlay, the handlers that open it, and an attachment that tells the overlay which element
 * opened it (focus goes back there on close). Spread it onto the control.
 *
 * @example
 * <Dialog title="Rename the account">
 *   {#snippet trigger(attributes)}<Button {...attributes}>Rename</Button>{/snippet}
 *   …
 * </Dialog>
 */
export interface TriggerAttributes {
	/** The kind of overlay the control opens. */
	'aria-haspopup'?: 'dialog' | 'menu' | 'true';
	/** Whether the overlay is open, for overlays that stay beside the control. */
	'aria-expanded'?: boolean;
	/** The overlay's id while it is open. */
	'aria-controls'?: string;
	/** The overlay's id, for a tooltip that describes the control. */
	'aria-describedby'?: string;
	onclick?: (event: MouseEvent) => void;
	onkeydown?: (event: KeyboardEvent) => void;
	/** The attachment that hands the control to the overlay. */
	[attachment: symbol]: Attachment<HTMLElement>;
}
