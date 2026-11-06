import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';

/**
 * A secret shown in part, such as an account or card number: dots and its last characters,
 * "•••• 4821". The hidden characters are never written to the page, so copying it or reading
 * the page gets no more than the eye sees. `revealed` shows the whole value; `toggle` adds a
 * button that does it; `hideAfter` hides it again. Name it with `label`.
 *
 * @example
 * <script>
 * 	import { SecureMask } from '@sveltier/ui';
 * </script>
 *
 * <SecureMask label="Account number" value="DE89370400440532013000" toggle hideAfter={30000} />
 */
export type SecureMaskProps = ElementProps<
	HTMLSpanElement,
	HTMLAttributes<HTMLSpanElement>,
	{
		/**
		 * The secret. While it is masked only its last `visible` characters are used, so it can be
		 * just those until the user reveals it, then the whole value fetched.
		 */
		value: string;
		/** What the secret is, such as "Account number": the name screen readers hear first. */
		label: string;
		/**
		 * How many characters at the end stay in view. 0 hides them all.
		 * @default 4
		 */
		visible?: number;
		/**
		 * Shows the whole value. Bind it to know when the user reveals it.
		 * @default false
		 */
		revealed?: boolean;
		/**
		 * A button after the value that shows and hides it.
		 * @default false
		 */
		toggle?: boolean;
		/** Hides the value again this many milliseconds after it is revealed. */
		hideAfter?: number;
	}
>;
