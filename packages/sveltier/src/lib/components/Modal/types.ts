import type { Snippet } from 'svelte';
import type { ClassValue, HTMLDialogAttributes } from 'svelte/elements';
import type { TransitionConfig } from 'svelte/transition';
import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { SheetSide } from '../Sheet/types.js';

/** The props Dialog and Sheet share. */
export interface ModalContentProps {
	/**
	 * Whether it is open. Bindable; it sets this to `false` when it closes itself.
	 * @default false
	 */
	open?: boolean;
	/** The heading, which also names it. Without it, name it with `aria-label`. */
	title?: string;
	/** The body. */
	children?: Snippet;
	/** Buttons at the end. `close()` closes it with the reason `'action'`. */
	actions?: Snippet<[{ close: () => void }]>;
	/** The control that opens it. Spread the attributes it receives onto it. */
	trigger?: Snippet<[TriggerAttributes]>;
	/**
	 * Escape and a press on the backdrop do not close it: an answer is needed.
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
	/** Called when it closes itself, with the reason. */
	onclose?: (reason: CloseReason) => void;
}

/** A modal `<dialog>` with a panel, the shell of Dialog and Sheet. Internal. */
export type ModalProps = ElementProps<
	HTMLDialogElement,
	Omit<HTMLDialogAttributes, 'open' | 'title' | 'children'>,
	ModalContentProps & {
		/** The component's name, for development warnings. */
		component: string;
		/** Where the panel sits: in the centre (a dialog) or against an edge (a sheet). */
		placement: 'center' | SheetSide;
		/** The shared-prop classes of the panel. */
		panelClass: ClassValue;
		/** How the panel comes in and goes: a dialog pops, a sheet slides. */
		enter: (node: Element) => TransitionConfig;
		/** The panel fills the screen. */
		fullscreen?: boolean;
	}
>;
