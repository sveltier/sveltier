import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Density } from '../../core/props/types.js';

/** The Accordion props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface AccordionDefaults {
	/**
	 * Multiplies the padding of the headers and panels, never the text.
	 * @default 'default'
	 */
	density: Density;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Accordion: AccordionDefaults;
	}
}

/** One section: a header that opens and closes it, and the panel the `panel` snippet renders. */
export interface AccordionItem<T extends string | number = string> {
	/** Identifies the section in `value`. */
	value: T;
	/** The header's text. */
	title: string;
	/** Its header no longer opens or closes it; it keeps its state. */
	disabled?: boolean;
}

/** One section open at a time: opening one closes the others. */
interface Single<T> {
	/**
	 * Lets several sections be open at once; `value` is then a list.
	 * @default false
	 */
	multiple?: false;
	/** The open section, or `null` when all are closed. Bindable. */
	value?: T | null;
	/** Called with the new value when the user opens or closes a section. */
	onchange?: (value: T | null) => void;
}

/** Any number of sections open. */
interface Multiple<T> {
	multiple: true;
	/** The open sections. Bindable. */
	value?: T[];
	/** Called with the new value when the user opens or closes a section. */
	onchange?: (value: T[]) => void;
}

/**
 * Sections that open and close under their headers, built on the platform's `<details>`: they
 * work before scripts load, and finding text in the page opens the section it is in. One opens
 * at a time unless `multiple` is set. `class`, `style`, `ref` and other attributes go to the
 * root element.
 *
 * @example
 * <Accordion items={[{ value: 'fees', title: 'Fees' }, { value: 'limits', title: 'Limits' }]} bind:value={open}>
 *   {#snippet panel(item)}{answers[item.value]}{/snippet}
 * </Accordion>
 */
export type AccordionProps<T extends string | number = string> = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<AccordionDefaults> & {
		/** The sections, in order. */
		items: readonly AccordionItem<T>[];
		/** The content of a section, under its header. */
		panel: Snippet<[AccordionItem<T>]>;
	} & (Single<T> | Multiple<T>)
>;
