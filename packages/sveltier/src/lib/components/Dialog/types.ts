import type { HTMLDialogAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Density, Rounded, Size } from '../../core/props/types.js';
import type { ModalContentProps } from '../Modal/types.js';

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
	Partial<DialogDefaults> &
		ModalContentProps & {
			/**
			 * The panel fills the screen, as on a phone.
			 * @default false
			 */
			fullscreen?: boolean;
		}
>;
