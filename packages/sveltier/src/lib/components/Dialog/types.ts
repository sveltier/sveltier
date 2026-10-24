import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
import type { TriggerAttributes } from '../../core/overlay/trigger.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Density, Rounded, Size } from '../../core/props/types.js';

/** The Dialog props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface DialogDefaults {
	/**
	 * The width of the panel, from `xs` (21rem) to `xl` (55rem).
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding. `true` keeps the theme's radius for large surfaces.
	 * @default true
	 */
	rounded: Rounded;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Dialog: DialogDefaults;
	}
}

export const DIALOG_CLOSE_REASONS = ['escape', 'outside', 'action'] as const;

/**
 * Why a dialog closed: `'escape'` (the Escape key), `'outside'` (a press on the backdrop) or
 * `'action'` (its close button, or `close()` from the `actions` snippet).
 */
export type DialogCloseReason = (typeof DIALOG_CLOSE_REASONS)[number];

type DialogOwnProps = Partial<DialogDefaults> & {
	/**
	 * Whether the dialog is open. Bindable; the dialog sets it to `false` when it closes itself.
	 * @default false
	 */
	open?: boolean;
	/** The heading, which also names the dialog. Without it, name the dialog with `aria-label`. */
	title?: string;
	/** The body of the dialog. */
	children?: Snippet;
	/** Buttons at the end of the dialog. `close()` closes it with the reason `'action'`. */
	actions?: Snippet<[{ close: () => void }]>;
	/** The control that opens the dialog. Spread the attributes it receives onto it. */
	trigger?: Snippet<[TriggerAttributes]>;
	/**
	 * Escape and a press on the backdrop do not close the dialog: an answer is needed.
	 * @default false
	 */
	persistent?: boolean;
	/**
	 * Adds a close button to the heading.
	 * @default false
	 */
	closable?: boolean;
	/**
	 * The accessible name of the close button.
	 * @default 'Close' (from the locale)
	 */
	closeLabel?: string;
	/**
	 * The panel fills the screen, as on a phone.
	 * @default false
	 */
	fullscreen?: boolean;
	/** Called when the dialog closes itself, with the reason. */
	onclose?: (reason: DialogCloseReason) => void;
};

/**
 * A modal dialog: the platform's own `<dialog>`, in the top layer, with the rest of the page
 * inert and still. Focus moves into it and returns to the control that opened it; Escape and a
 * press on the backdrop close it unless it is `persistent`. `class`, `style`, `ref` and other
 * attributes go to the `<dialog>`.
 *
 * @example
 * <Dialog title="Delete this card?" bind:open>
 *   {#snippet trigger(attributes)}<Button {...attributes} color="error">Delete</Button>{/snippet}
 *   The card stops working at once. Payments already made are kept.
 *   {#snippet actions({ close })}
 *     <Button variant="text" onclick={close}>Keep it</Button>
 *     <Button color="error" onclick={remove}>Delete</Button>
 *   {/snippet}
 * </Dialog>
 */
export type DialogProps = ElementProps<
	HTMLDialogElement,
	Omit<HTMLDialogAttributes, 'open' | 'title' | 'children'>,
	DialogOwnProps
>;
