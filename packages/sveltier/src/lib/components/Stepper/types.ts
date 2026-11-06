import type { HTMLOlAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density } from '../../core/props/types.js';

export const STEPPER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

/** How the steps are laid out: in a row, or in a column. */
export type StepperOrientation = (typeof STEPPER_ORIENTATIONS)[number];

/** The Stepper props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface StepperDefaults {
	/**
	 * The colour of the current and completed steps.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * Multiplies the spacing of the steps, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * In a row, or in a column.
	 * @default 'horizontal'
	 */
	orientation: StepperOrientation;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Stepper: StepperDefaults;
	}
}

/** One step. */
export interface StepperItem<T extends string = string> {
	/** Identifies the step in `value`. */
	value: T;
	/** What the step is called. */
	label: string;
	/** A line under the label. */
	description?: string;
	/** Marks the step as needing attention, in the error colour with a `!`. */
	error?: boolean;
	/** Cannot be gone to by clicking it. */
	disabled?: boolean;
}

/**
 * The steps of a task done in order, and where the user is: an ordered list with the current
 * step marked `aria-current="step"`. Steps before the current one are complete and, as buttons,
 * take the user back; the app moves forward with its own button once a step is valid. With
 * `linear={false}` every step is a button. `class`, `style`, `ref` and other attributes go to
 * the `<ol>`.
 *
 * @example
 * <Stepper
 *   aria-label="Transfer"
 *   items={[
 *     { value: 'details', label: 'Details' },
 *     { value: 'review', label: 'Review' },
 *     { value: 'confirm', label: 'Confirm' }
 *   ]}
 *   bind:value={step}
 * />
 */
export type StepperProps<T extends string = string> = ElementProps<
	HTMLOListElement,
	HTMLOlAttributes,
	Partial<StepperDefaults> & {
		/** The steps, in order. */
		items: readonly StepperItem<T>[];
		/** The current step. Bindable; the first step when not set. */
		value?: T;
		/** Called with the step the user goes to by clicking it. */
		onchange?: (value: T) => void;
		/**
		 * Only steps before the current one can be clicked; `false` lets the user go to any step.
		 * @default true
		 */
		linear?: boolean;
	}
>;
