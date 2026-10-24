import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The TextField props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type TextFieldDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		TextField: TextFieldDefaults;
	}
}

export const TEXT_FIELD_TYPES = ['text', 'email', 'password', 'search', 'tel', 'url'] as const;

/** The kinds of single-line text. Numbers and dates have their own fields. */
export type TextFieldType = (typeof TEXT_FIELD_TYPES)[number];

type TextFieldOwnProps = Partial<TextFieldDefaults> &
	FieldContentProps & {
		/** The text. Bindable. */
		value?: string;
		/**
		 * The kind of text: it picks the keyboard and autofill, and `email` and `url` are checked.
		 * @default 'text'
		 */
		type?: TextFieldType;
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
 * A single line of text with a label, a hint and validation. `class` and `style` apply to the
 * field; `id`, `ref` and every other attribute (`name`, `placeholder`, `autocomplete`,
 * `minlength`, `pattern`, events) go to the `<input>`.
 */
export type TextFieldProps = ElementProps<HTMLInputElement, HTMLInputAttributes, TextFieldOwnProps>;
