import type { Snippet } from 'svelte';
import type { HTMLFormAttributes } from 'svelte/elements';
import type { ValidateOn } from '../../core/form/types.js';
import type { ElementProps } from '../../core/props/element.js';

/**
 * A `<form>` that checks its fields when it is submitted. An invalid form does not submit: every
 * field shows its message and the first invalid one takes focus. A valid form calls `onsubmit`,
 * or submits as HTML does when there is no `onsubmit`, so SvelteKit form actions work as they
 * are. Other attributes go to the `<form>`. Through `bind:this` it offers `validate()`,
 * `reset()` and `resetValidation()`.
 *
 * @example
 * <Form method="POST" onsubmit={(event) => { event.preventDefault(); save(); }}>
 *   <TextField label="Email" name="email" type="email" required />
 *   <Button type="submit">Sign up</Button>
 * </Form>
 */
export type FormProps = ElementProps<
	HTMLFormElement,
	HTMLFormAttributes,
	{
		/**
		 * When the fields show their messages, unless a field sets its own.
		 * @default 'blur'
		 */
		validateOn?: ValidateOn;
		/**
		 * Disables every control inside, Buttons included, for example while a submission runs.
		 * @default false
		 */
		disabled?: boolean;
		/**
		 * Called when the form is submitted and every field is valid. Without it, the form submits
		 * as HTML does; call `event.preventDefault()` to handle the submission yourself.
		 */
		onsubmit?: (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => void;
		/** The fields and buttons. */
		children?: Snippet;
	}
>;
