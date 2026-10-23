<script lang="ts">
	// The root mounted by Portal. It repeats the nearest theme scope, so portaled content
	// looks like the place it came from.
	import type { Snippet } from 'svelte';
	import type { ThemeInstance } from '../../core/theme/context.js';
	import './portal.css';

	let { children, theme }: { children: Snippet; theme?: ThemeInstance } = $props();
</script>

{#if theme}
	<div class="sv-portal" data-sv-theme={theme.name}>{@render children()}</div>
{:else}
	{@render children()}
{/if}
