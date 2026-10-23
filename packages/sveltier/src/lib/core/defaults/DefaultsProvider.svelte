<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { DefaultsConfig } from './context.js';

	export interface DefaultsProviderProps {
		/**
		 * Defaults for this subtree: `global` reaches every component with the prop, and a key
		 * per component name targets one component. Merged over any outer provider, key by key.
		 */
		defaults: DefaultsConfig;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getDefaultsContext, mergeDefaults, setDefaultsContext } from './context.js';

	let { defaults, children }: DefaultsProviderProps = $props();

	const parent = getDefaultsContext();
	const merged = $derived(mergeDefaults(parent?.config, defaults));

	setDefaultsContext({
		get config() {
			return merged;
		}
	});
</script>

{@render children?.()}
