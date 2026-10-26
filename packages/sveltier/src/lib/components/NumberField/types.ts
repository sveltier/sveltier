import type { HTMLInputAttributes } from 'svelte/elements';
import type { NumberStep } from '../../core/form/number.js';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The NumberField props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type NumberFieldDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		NumberField: NumberFieldDefaults;
	}
}

type NumberFieldOwnProps = Partial<NumberFieldDefaults> &
	FieldContentProps & {
		/** The number, or `null` when the field is empty. Bindable. */
		value?: number | null;
		/** The smallest value. The keys and buttons stop here; a smaller typed value is an error. */
		min?: number;
		/** The largest value. The keys and buttons stop here; a larger typed value is an error. */
		max?: number;
		/**
		 * How far the arrow keys and the buttons move; Page Up and Page Down move ten steps. When
		 * set, a typed value off the steps, counted from `min`, is an error. When not set, they move
		 * by 1 and any number is accepted, decimals included.
		 *
		 * Bands give a step that changes with the value, as a market's tick size changes with the
		 * price: `[{ from: 0, step: 10 }, { from: 10000, step: 50 }]`. Each value must then be a
		 * multiple of its band's step, and the keys move into the next band on its start.
		 */
		step?: NumberStep;
		/**
		 * How the number is written once the user leaves the field, as `Intl.NumberFormat` options
		 * in the app's locale: digits only, such as `{ minimumFractionDigits: 2 }`, so the user can
		 * edit what they see. Put a currency or a unit in `prepend` or `append`.
		 * @default { maximumFractionDigits: 20 }
		 */
		format?: Intl.NumberFormatOptions;
		/**
		 * Shows decrease and increase buttons at the end of the field.
		 * @default true
		 */
		controls?: boolean;
		/** Checks run in order after the HTML constraints, with the number. The first message is shown. */
		rules?: readonly Rule<number>[];
		/** When the message shows. Defaults to the form's setting, else `'blur'`. */
		validateOn?: ValidateOn;
		/**
		 * The field must not be empty. Adds an asterisk to the label.
		 * @default false
		 */
		required?: boolean;
		/**
		 * The number can be read and copied but not changed.
		 * @default false
		 */
		readonly?: boolean;
		/** Submits the plain number, such as `1234.5`, under this name in a form. */
		name?: string;
		/** Inline style of the field's root element. */
		style?: string | null;
	};

/**
 * A number typed in the app's locale, stepped with the arrow keys or the buttons, and checked
 * against `min`, `max` and `step`. The field shows the number formatted, for example
 * `1,234.50`, and binds and submits the plain number. `class` and `style` apply to the field;
 * `id`, `ref` and other attributes go to the `<input>`.
 *
 * @example
 * <NumberField
 *   label="Quantity"
 *   name="quantity"
 *   min={1}
 *   max={99}
 *   required
 *   bind:value={quantity}
 * />
 */
export type NumberFieldProps = ElementProps<
	HTMLInputElement,
	HTMLInputAttributes,
	NumberFieldOwnProps
>;
