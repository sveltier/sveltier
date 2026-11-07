import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color, Size } from '../../core/props/types.js';

/** The PinPad props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface PinPadDefaults {
	/**
	 * The colour of the filled dots and of the keys' focus.
	 * @default 'primary'
	 */
	color: Color;
	/**
	 * The size of the keys: φ times a control of this size, so `md` keys are about 68px.
	 * @default 'md'
	 */
	size: Size;
	/**
	 * Ignores the keys.
	 * @default false
	 */
	disabled: boolean;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		PinPad: PinPadDefaults;
	}
}

/**
 * A PIN or passcode entered on a keypad of its own: a row of dots that fill as digits go in, and
 * keys 1–9, 0 and Delete in the phone layout. The digits are never shown or read aloud: screen
 * readers hear how many are in. Digit keys and Backspace on a keyboard work while focus is in the
 * pad. `class`, `style`, `ref` and other attributes go to the group around it.
 *
 * @example
 * <script>
 * 	import { PinPad } from '@sveltier/ui';
 * 	let pin = $state('');
 * </script>
 *
 * <PinPad label="Enter your trading PIN" bind:value={pin} oncomplete={(pin) => confirm(pin)} />
 */
export type PinPadProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<PinPadDefaults> & {
		/** What to enter, such as "Enter your trading PIN". It names the pad and shows above it. */
		label: string;
		/** The digits entered so far. Bind it to read or clear it. */
		value?: string;
		/**
		 * How many digits the PIN has.
		 * @default 6
		 */
		length?: number;
		/** Runs when the last digit goes in, with the PIN. */
		oncomplete?: (value: string) => void;
		/** A message under the dots, such as "Wrong PIN, 2 tries left". The dots shake once. */
		error?: string;
		/** Submits the PIN under this name with a form, from a hidden input. */
		name?: string;
		/**
		 * Puts the digits in a random order, against someone watching over a shoulder. The order
		 * is set once the pad is in the page.
		 * @default false
		 */
		shuffle?: boolean;
		/** The key at the bottom left, beside 0, such as a button to use the fingerprint. */
		extra?: Snippet;
	}
>;
