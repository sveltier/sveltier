import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Size } from '../../core/props/types.js';

interface ProgressOwnProps {
	/** How far along, from 0 to 100. Values outside are clamped. */
	value?: number;
	/**
	 * Busy for an unknown time: no value, and moving.
	 * @default false
	 */
	indeterminate?: boolean;
	/**
	 * The name screen readers give the bar, such as `Uploading statement`. Defaults to the
	 * locale's `loading` when indeterminate and `progress` otherwise.
	 */
	label?: string;
}

/** The ProgressLinear props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ProgressLinearDefaults {
	/**
	 * The colour of the bar; its track is a tint of it.
	 * @default 'primary'
	 */
	color: Color;
}

/** The ProgressCircular props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ProgressCircularDefaults {
	/**
	 * The colour of the arc; its track is a tint of it.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The diameter: the control height of the size.
	 * @default 'md'
	 */
	size: Size;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		ProgressLinear: ProgressLinearDefaults;
		ProgressCircular: ProgressCircularDefaults;
	}
}

/** A horizontal progress bar. */
export type ProgressLinearProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<ProgressLinearDefaults> & ProgressOwnProps
>;

/** A circular progress indicator, with optional content in its centre. */
export type ProgressCircularProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<ProgressCircularDefaults> &
		ProgressOwnProps & {
			/** Content in the centre, such as the percentage. */
			children?: Snippet;
		}
>;
