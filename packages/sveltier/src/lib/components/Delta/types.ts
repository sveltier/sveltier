import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';

/** The Delta props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface DeltaDefaults {
	/**
	 * An arrow before the figure, pointing up for a rise and down for a fall.
	 * @default false
	 */
	arrow: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Delta: DeltaDefaults;
	}
}

/**
 * A change: a rise in the theme's up colour with a plus, a fall in its down colour with a
 * minus, no change muted. The sign always shows, so colour is never the only cue. The figure
 * is an Amount: the same `format` and `decimals`, and it follows Amount's `masked`.
 *
 * @example
 * <script>
 * 	import { Delta } from '@sveltier/ui';
 * </script>
 *
 * <Delta value={4183.2} decimals={2} />
 * <Delta value={-0.0125} format={{ style: 'percent' }} arrow />
 */
export type DeltaProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	Partial<DeltaDefaults> & {
		/** The change: above zero a rise, below a fall. `null` or `undefined` shows a dash. */
		value: number | bigint | null | undefined;
		/** Intl.NumberFormat options, as Amount takes them; the sign shows unless the change is zero. */
		format?: Intl.NumberFormatOptions;
		/** Exactly this many fraction digits. Overrides `format`'s. */
		decimals?: number;
		/**
		 * When the value rises or falls, a wash of the up or down colour behind the figure fades
		 * out.
		 * @default false
		 */
		flash?: boolean;
		/**
		 * Hides the figure, its direction and its colour. Without it, the change follows
		 * Amount's `masked` default.
		 */
		masked?: boolean;
	}
>;
