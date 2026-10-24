import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Density, Rounded, Variant } from '../../core/props/types.js';

/** The Alert props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface AlertDefaults {
	/**
	 * Visual weight.
	 * @default 'tonal'
	 */
	variant: Variant;
	/**
	 * The colour, when there is no `type` to take it from.
	 * @default 'info'
	 */
	color: Color;
	/**
	 * Multiplies the padding.
	 * @default 'default'
	 */
	density: Density;
	/**
	 * Corner rounding. `true` keeps the theme's radius.
	 * @default true
	 */
	rounded: Rounded;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Alert: AlertDefaults;
	}
}

/** A message about something that happened or needs attention. */
export type AlertProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<AlertDefaults> & {
		/**
		 * What kind of message: sets the colour and the icon. Warnings and errors are announced at
		 * once (`role="alert"`), the others politely (`role="status"`).
		 */
		type?: 'info' | 'success' | 'warning' | 'error';
		/** A short summary, above the text. */
		title?: string;
		/**
		 * Shows the icon of the `type`.
		 * @default true
		 */
		icon?: boolean;
		/**
		 * Shown while true; a closable alert sets it to false. Bindable.
		 * @default true
		 */
		open?: boolean;
		/**
		 * Adds a button that closes the alert and calls `onclose`.
		 * @default false
		 */
		closable?: boolean;
		/** The name of the close button. Defaults to the locale's `close`. */
		closeLabel?: string;
		/** Called when the close button closes the alert. */
		onclose?: () => void;
		/** Content in place of the type's icon. */
		prepend?: Snippet;
		/** Buttons or links after the text, such as `Retry`. */
		actions?: Snippet;
		/** The message. */
		children?: Snippet;
	}
>;
