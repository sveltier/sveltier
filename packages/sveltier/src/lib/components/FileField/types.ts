import type { HTMLInputAttributes } from 'svelte/elements';
import type { Rule, ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { FieldContentProps, FieldDefaults } from '../Field/types.js';

/** The FileField props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type FileFieldDefaults = FieldDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		FileField: FileFieldDefaults;
	}
}

type FileFieldOwnProps = Partial<FileFieldDefaults> &
	Omit<FieldContentProps, 'append'> & {
		/**
		 * The chosen files, `[]` when none. Bindable. Files set from code go into the input, so a
		 * form submits what the field shows; `[]` clears it.
		 * @default []
		 */
		files?: File[];
		/**
		 * Called with the files when the user chooses, drops or clears them; not when `files` is
		 * set from code.
		 */
		onchange?: (files: File[]) => void;
		/**
		 * The kinds of file to choose, as on `<input type="file">`: extensions and media types,
		 * comma-separated (`'.json,application/json'`, `'image/*'`). The chooser filters by it;
		 * a dropped file of another kind is an error, which names the extensions (".json"), or
		 * the media types when there are none. For other words, set the locale's `fileType`.
		 */
		accept?: string;
		/**
		 * Lets the user choose several files.
		 * @default false
		 */
		multiple?: boolean;
		/**
		 * A taller box that says files can be dropped on it, marked while a file is dragged over.
		 * @default false
		 */
		drop?: boolean;
		/** Checks run in order after `required` and `accept`. The first message is shown. */
		rules?: readonly Rule<File[]>[];
		/** When the message shows. Defaults to the form's setting, else `'blur'`. */
		validateOn?: ValidateOn;
		/**
		 * A file must be chosen. Adds an asterisk to the label.
		 * @default false
		 */
		required?: boolean;
		/**
		 * The chosen files show but cannot be changed: no chooser, no drop, no clear button.
		 * @default false
		 */
		readonly?: boolean;
		/** Inline style of the field's root element. */
		style?: string | null;
	};

/**
 * A file to choose, as a field: the platform's own file input, with a label, a hint and
 * validation, showing the chosen names in the box. A press anywhere in the box opens the
 * chooser; `drop` makes it a place to drop files too; a clear button empties it. The form
 * submits the files under `name`. `class` and `style` apply to the field; `id`, `ref` and every
 * other attribute (`name`, `capture`, events) go to the `<input type="file">`.
 *
 * @example
 * <FileField
 *   label="Backup"
 *   name="backup"
 *   accept=".json,application/json"
 *   hint="The file the export made"
 *   required
 *   onchange={(files) => restore(files[0])}
 * />
 */
export type FileFieldProps = ElementProps<
	HTMLInputElement,
	Omit<HTMLInputAttributes, 'type' | 'value' | 'files'>,
	FileFieldOwnProps
>;
