<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Path } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { NAV, toNavPath } from './nav.js';
	import { useShell } from './shell.svelte.js';

	const shell = useShell();
	const current = $derived(toNavPath(page.url.pathname));

	// A navigation from the mobile menu closes it.
	afterNavigate(() => (shell.menuOpen = false));

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && shell.menuOpen) shell.menuOpen = false;
	}
</script>

<svelte:window {onkeydown} />

{#if shell.menuOpen}
	<button
		type="button"
		class="docs-scrim"
		aria-label="Close navigation"
		tabindex="-1"
		onclick={() => (shell.menuOpen = false)}
	></button>
{/if}

<nav
	id="docs-sidebar"
	class="docs-sidebar"
	class:docs-sidebar--open={shell.menuOpen}
	aria-label="Documentation"
>
	{#each NAV as group (group.title)}
		<div class="docs-sidebar__group">
			<h2 class="docs-sidebar__title">{group.title}</h2>
			<ul>
				{#each group.items as item (item.path)}
					<li>
						<a
							href={resolve(item.path as Path)}
							aria-current={current === item.path ? 'page' : undefined}>{item.title}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
