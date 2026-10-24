import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The Textarea props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type TextareaDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Textarea: TextareaDefaults;
	}
}

type TextareaOwnProps = Partial<TextareaDefaults> &
	FieldContentProps & {
		/** The text. Bindable. */
		value?: string;
		/**
		 * Visible lines, and the fewest it shows when it grows.
		 * @default 3
		 */
		rows?: number;
		/**
		 * Grows with its text instead of scrolling, up to `maxRows`.
		 * @default false
		 */
		autoGrow?: boolean;
		/** With `autoGrow`, the most lines it grows to before it scrolls. Unlimited when not set. */
		maxRows?: number;
		/** Checks run in order after the HTML constraints. The first message is shown. */
		rules?: readonly Rule<string>[];
		/** When the message shows. Defaults to the form's setting, else `'blur'`. */
		validateOn?: ValidateOn;
		/**
		 * The field must not be empty. Adds an asterisk to the label.
		 * @default false
		 */
		required?: boolean;
		/**
		 * The text can be read, selected and copied but not changed.
		 * @default false
		 */
		readonly?: boolean;
		/** Inline style of the field's root element. */
		style?: string | null;
	};

/**
 * Several lines of text with a label, a hint and validation. `class` and `style` apply to the
 * field; `id`, `ref` and every other attribute (`name`, `placeholder`, `minlength`,
 * `maxlength`, events) go to the `<textarea>`.
 *
 * @example
 * <Textarea
 *   label="Note to the payee"
 *   name="note"
 *   maxlength={280}
 *   autoGrow
 *   maxRows={8}
 *   bind:value={note}
 * />
 */
export type TextareaProps = ElementProps<
	HTMLTextAreaElement,
	HTMLTextareaAttributes,
	TextareaOwnProps
>;
