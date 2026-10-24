import type { HTMLInputAttributes } from 'svelte/elements';
import type { FieldError, Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Size } from '../../core/props/types.js';

/** The Slider props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface SliderDefaults {
	/**
	 * The colour of the filled part of the track and of the thumb's ring. An invalid slider uses
	 * `error`.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The size of the thumb, the track and the text.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Multiplies the height of the slider's row, never the text.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Mutes the slider and disables its input.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Slider: SliderDefaults;
	}
}

/** A labelled tick under a Slider's track. */
export interface SliderTick {
	value: number;
	/** What the tick says. Read out as the slider's value while it sits on the tick. */
	label: string;
}

type SliderOwnProps = Partial<SliderDefaults> & {
	/**
	 * The value, between `min` and `max`, on a step. Bindable.
	 * @default min
	 */
	value?: number;
	/** @default 0 */
	min?: number;
	/** @default 100 */
	max?: number;
	/**
	 * The distance between the values the slider stops at.
	 * @default 1
	 */
	step?: number;
	/**
	 * Marks under the track: `true` for every step, a list of values, or values with labels such
	 * as `{ value: 50, label: 'Balanced' }`.
	 */
	ticks?: boolean | readonly number[] | readonly SliderTick[];
	/**
	 * How the value reads, beside the label and to screen readers, for example
	 * `(value) => value + '%'`. Defaults to the number in the locale's format, or the label of the
	 * tick the slider sits on.
	 */
	format?: (value: number) => string;
	/** The visible label, linked to the input. Without it, name the slider with `aria-label`. */
	label?: string;
	/** Help under the slider. An error replaces it. */
	hint?: string;
	/**
	 * An error from outside the slider, such as the server's answer: a message, a list of which
	 * the first is shown, or `true` for an invalid state described elsewhere.
	 */
	error?: FieldError;
	/** Checks run in order on the value. The first message is shown. */
	rules?: readonly Rule<number>[];
	/** When the message shows. Defaults to the form's setting, else `'blur'`. */
	validateOn?: ValidateOn;
	/** Inline style of the slider's root element. */
	style?: string | null;
};

/**
 * A number picked by dragging a thumb along a track: the platform's own range input, so the
 * keyboard, touch, forms and right-to-left pages work as they always do. The value shows beside
 * the label. A range always holds a value, so it takes no `required`. `class` and `style` apply
 * to the root; `id`, `ref`, `name` and every other attribute go to the `<input type="range">`.
 *
 * @example
 * <Slider
 *   label="Risk"
 *   name="risk"
 *   step={25}
 *   ticks={[
 *     { value: 0, label: 'Careful' },
 *     { value: 50, label: 'Balanced' },
 *     { value: 100, label: 'Bold' }
 *   ]}
 *   bind:value={risk}
 * />
 */
export type SliderProps = ElementProps<
	HTMLInputElement,
	Omit<HTMLInputAttributes, 'type' | 'children' | 'required'>,
	SliderOwnProps
>;
