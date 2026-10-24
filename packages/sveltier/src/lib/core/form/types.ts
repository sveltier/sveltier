/**
 * A validation rule: `true` when the value is valid, otherwise the message to show. Rules run
 * in order after the control's HTML constraints, and the first message wins. They are
 * synchronous: a check that needs the server belongs in the submit handler, whose answer comes
 * back through the field's `error`.
 *
 * @example
 * const rules = [(value: string) => value.endsWith('.com') || 'Use a .com address'];
 */
export type Rule<T> = (value: T) => true | string;

/**
 * When a field shows its message: `'blur'` once the user has changed the value and leaves the
 * field, `'input'` from the first change, `'submit'` when the form is submitted. Once shown, the
 * message follows every change, so fixing the value clears it at once.
 */
export type ValidateOn = 'blur' | 'input' | 'submit';

/**
 * An error from outside the field, such as the server's answer: a message, a list of messages
 * of which the first is shown, or `true` for an invalid state described elsewhere.
 */
export type FieldError = string | readonly string[] | boolean | null;
