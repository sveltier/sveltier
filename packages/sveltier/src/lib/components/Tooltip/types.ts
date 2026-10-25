import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TriggerAttributes } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Align, Side } from '../../primitives/anchored/anchored.js';

/** The Tooltip props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface TooltipDefaults {
	/**
	 * The side of the control it shows on, moved to the opposite side when there is no room.
	 * `start` and `end` follow the writing direction.
	 * @default 'top'
	 */
	side: Side;
	/**
	 * Its alignment along that side.
	 * @default 'center'
	 */
	align: Align;
	/**
	 * How long the pointer rests on the control before it shows, in ms. Keyboard focus shows it
	 * at once, and so does moving on from another tooltip, as across a toolbar.
	 * @default 377
	 */
	delay: number;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Tooltip: TooltipDefaults;
	}
}

/**
 * A short text that describes a control: shown when the pointer rests on it and at once on
 * keyboard focus, hidden on Escape, on leaving and on a press. It stays while the pointer moves
 * onto it. It holds text only; for links, buttons or fields, use a Popover. The text is the
 * control's description (`aria-describedby`), not its name: an icon-only button still needs
 * `aria-label`. `class`, `style`, `ref` and other attributes go to the tooltip.
 *
 * @example
 * <Tooltip text="Copy the IBAN">
 *   {#snippet trigger(attributes)}
 *     <Button {...attributes} icon variant="text" aria-label="Copy the IBAN"><Icon path={copy} /></Button>
 *   {/snippet}
 * </Tooltip>
 */
export type TooltipProps = ElementProps<
	HTMLDivElement,
	Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'popover' | 'role'>,
	Partial<TooltipDefaults> & {
		/** The text. */
		text: string;
		/** The control it describes. Spread the attributes it receives onto it. */
		trigger: Snippet<[TriggerAttributes]>;
		/**
		 * Whether it shows. Bindable; it sets this as the pointer and focus come and go.
		 * @default false
		 */
		open?: boolean;
	}
>;
