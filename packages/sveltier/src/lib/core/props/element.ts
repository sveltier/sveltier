import type { ClassValue } from 'svelte/elements';

/**
 * The props of a component rendered as one root element: its own props `Own`, then every
 * attribute of `Attributes` that `Own` does not redefine (spread onto the root), `class`
 * (merged after the component's own classes) and a bindable `ref` to the root element.
 *
 * Own props win over same-named attributes, so a shared `size` or `color` never clashes
 * with the HTML attribute of the same name.
 *
 * @example
 * type PillProps = ElementProps<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>, { size?: Size }>;
 */
export type ElementProps<Element, Attributes, Own = object> = Own &
	Omit<Attributes, keyof Own | 'class'> & {
		/** Classes added after the component's own: a string, an array or an object. */
		class?: ClassValue | null;
		/** The root element, bindable with `bind:ref`. */
		ref?: Element | null;
	};
