import type { HTMLDialogAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Density, Rounded, Size } from '../../core/props/types.js';
import type { ModalContentProps } from '../Modal/types.js';

/** The Sheet props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface SheetDefaults {
	/**
	 * The width of the panel, from `xs` (21rem) to `xl` (55rem); for a sheet from the top or the
	 * bottom, the most it spans.
	 * @default 'sm'
	 */
	size: Size;
	/**
	 * Multiplies the padding, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding of the inner corners. `true` keeps the theme's radius for large surfaces.
	 * @default true
	 */
	rounded: Rounded;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Sheet: SheetDefaults;
	}
}

export const SHEET_SIDES = ['start', 'end', 'top', 'bottom'] as const;

/** The edge a sheet comes from. `start` and `end` follow the writing direction. */
export type SheetSide = (typeof SHEET_SIDES)[number];

/**
 * A modal panel that slides in from an edge of the screen: a drawer from the start or the end,
 * a sheet from the bottom or the top. It is a Dialog in every other way: the platform's own
 * `<dialog>`, focus moved in and given back, Escape and the backdrop close it. `class`, `style`,
 * `ref` and other attributes go to the `<dialog>`.
 *
 * @example
 * <Sheet title="Filters" side="end">
 *   {#snippet trigger(attributes)}<Button {...attributes} variant="outlined">Filters</Button>{/snippet}
 *   <Checkbox label="Pending only" bind:checked={pending} />
 *   {#snippet actions({ close })}<Button onclick={close}>Show results</Button>{/snippet}
 * </Sheet>
 */
export type SheetProps = ElementProps<
	HTMLDialogElement,
	Omit<HTMLDialogAttributes, 'open' | 'title' | 'children'>,
	Partial<SheetDefaults> &
		ModalContentProps & {
			/**
			 * The edge it slides in from.
			 * @default 'end'
			 */
			side?: SheetSide;
		}
>;
