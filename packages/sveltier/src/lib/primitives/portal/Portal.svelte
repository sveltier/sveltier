<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface PortalProps {
		/** Where the content goes: an element or a selector. Defaults to `document.body`. */
		target?: HTMLElement | string;
		children: Snippet;
	}
</script>

<script lang="ts">
	// Renders its children as a separate root in another part of the document, with the same
	// contexts. Moving the element itself would break how Svelte removes it later.
	import { getAllContexts, mount, unmount } from 'svelte';
	import { sveltierError } from '../../core/errors/errors.js';
	import { hasThemeContext, useTheme } from '../../core/theme/context.js';
	import PortalContent from './PortalContent.svelte';

	let { target = 'body', children }: PortalProps = $props();

	const context = getAllContexts();
	const theme = hasThemeContext() ? useTheme() : undefined;

	$effect(() => {
		const parent = typeof target === 'string' ? document.querySelector(target) : target;
		if (!parent) {
			throw sveltierError(
				'SV3001',
				`Portal: no element matches "${target}". Render the target first, or pass the element itself.`
			);
		}
		const root = mount(PortalContent, { target: parent, props: { children, theme }, context });
		return () => {
			void unmount(root);
		};
	});
</script>
