import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Density, Rounded, Size } from '../../core/props/types.js';
import type { Align, Side } from '../../primitives/anchored/anchored.js';

/** The Popover props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface PopoverDefaults {
	/**
	 * The widest it grows, from `xs` (13rem) to `xl` (34rem); narrower content keeps it narrower.
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
		Popover: PopoverDefaults;
	}
}

/**
 * A panel next to the control that opens it, for content the user works in: a few fields, a
 * choice, a short explanation with a link. It does not block the page: Escape, a press outside
 * and focus moving out close it. Focus moves into it when it opens and back to the control when
 * it closes from inside. For text that only describes a control, use a Tooltip; for a task that
 * needs the whole screen, a Dialog. `class`, `style`, `ref` and other attributes go to the panel.
 *
 * @example
 * <Popover title="Amount range">
 *   {#snippet trigger(attributes)}<Button {...attributes} variant="outlined">Amount</Button>{/snippet}
 *   <NumberField label="From" bind:value={from} />
 *   {#snippet actions({ close })}<Button onclick={close}>Apply</Button>{/snippet}
 * </Popover>
 */
export type PopoverProps = ElementProps<
	HTMLDivElement,
	Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'popover' | 'role'>,
	Partial<PopoverDefaults> & {
		/** The control that opens and closes it. Spread the attributes it receives onto it. */
		trigger: Snippet<[TriggerAttributes]>;
		/**
		 * Whether it is open. Bindable; it sets this to `false` when it closes itself.
		 * @default false
		 */
		open?: boolean;
		/** A heading, which also names it. Without it, name it with `aria-label`. */
		title?: string;
		/** The content. */
		children?: Snippet;
		/** Buttons at the end. `close()` closes it with the reason `'action'`. */
		actions?: Snippet<[{ close: () => void }]>;
		/**
		 * The side of the control it opens on, moved to the opposite side when there is no room.
		 * `start` and `end` follow the writing direction.
		 * @default 'bottom'
		 */
		side?: Side;
		/**
		 * Its alignment along that side.
		 * @default 'start'
		 */
		align?: Align;
		/**
		 * The room between the control and the panel, in px.
		 * @default 8
		 */
		offset?: number;
		/**
		 * Escape, a press outside and focus moving out do not close it: an answer is needed.
		 * @default false
		 */
		persistent?: boolean;
		/** Called when it closes itself, with the reason. */
		onclose?: (reason: CloseReason) => void;
	}
>;
