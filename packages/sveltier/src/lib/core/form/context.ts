import { getContext, hasContext, setContext } from 'svelte';
import type { ValidateOn } from './types.js';

/** What a field gives the form it is in. */
export interface FormField {
	/** Shows the field's message; `true` when its value passes its own checks. */
	validate(): boolean;
	/** Hides the message and forgets that the user changed the value. */
	resetValidation(): void;
	/** The control, focused when it is the first invalid one. */
	control(): HTMLElement | null | undefined;
}

/** What a `Form` gives its fields. */
export interface FormContext {
	/** When fields without their own `validateOn` show their messages. */
	readonly validateOn: ValidateOn | undefined;
	/** Adds a field; returns the function that removes it. */
	register(field: FormField): () => void;
}

const KEY = Symbol('sveltier.form');

export const getFormContext = (): FormContext | undefined =>
	hasContext(KEY) ? getContext<FormContext>(KEY) : undefined;
export const setFormContext = (context: FormContext): FormContext => setContext(KEY, context);
