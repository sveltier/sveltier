import { getContext, hasContext, setContext } from 'svelte';
import type { SharedProps } from '../props/types.js';

/** Defaults that reach every component which declares the prop. */
export type GlobalDefaults = Pick<
	SharedProps,
	'variant' | 'density' | 'size' | 'color' | 'rounded' | 'disabled'
>;

/**
 * Per-component defaults, keyed by component name. Sveltier's components register here,
 * and so can yours, by declaration merging:
 *
 * @example
 * declare module '@sveltier/ui' {
 *   interface ComponentDefaults {
 *     MyCard: { elevated?: boolean };
 *   }
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- extended by declaration merging
export interface ComponentDefaults {}

export type DefaultsConfig = { global?: GlobalDefaults } & {
	[Name in keyof ComponentDefaults]?: Partial<ComponentDefaults[Name]>;
};

type Bag = Record<string, unknown>;
type Merged = Record<string, Bag | undefined>;

interface DefaultsContext {
	/** The merged configuration of this provider and all its ancestors. */
	readonly config: Merged;
}

const KEY = Symbol('sveltier.defaults');

export const getDefaultsContext = (): DefaultsContext | undefined =>
	hasContext(KEY) ? getContext<DefaultsContext>(KEY) : undefined;
export const setDefaultsContext = (context: DefaultsContext): DefaultsContext =>
	setContext(KEY, context);

/** Merges a provider's own config over its parent's, per component and per key. */
export function mergeDefaults(parent: Merged | undefined, own: DefaultsConfig): Merged {
	const merged: Merged = { ...parent };
	for (const [name, values] of Object.entries(own as Merged)) {
		merged[name] = { ...parent?.[name], ...values };
	}
	return merged;
}

/**
 * Returns a resolver for a component's defaultable props. Call it during component
 * initialisation, then resolve inside `$derived` so prop and provider changes are tracked:
 *
 * @example
 * let { size, variant, ...rest }: ButtonProps = $props();
 * const resolve = useDefaults('Button', { size: 'md', variant: 'flat' });
 * const p = $derived(resolve({ size, variant }));
 *
 * Order: the prop passed in, then the nearest provider's defaults for `name`, then its
 * global defaults, then `builtins`. `undefined` and `null` mean "not set".
 */
export function useDefaults<T extends object>(name: string, builtins: T): (local: Partial<T>) => T {
	const context = getDefaultsContext();
	const keys = Object.keys(builtins) as Array<keyof T & string>;

	return (local) => {
		const config = context?.config;
		const own = config?.[name];
		const global = config?.global;
		const resolved = {} as T;
		for (const key of keys) {
			resolved[key] = (local[key] ?? own?.[key] ?? global?.[key] ?? builtins[key]) as T[typeof key];
		}
		return resolved;
	};
}
