<script lang="ts">
	import type { DefaultsConfig } from '../../lib/core/defaults/context.js';
	import DefaultsProvider from '../../lib/core/defaults/DefaultsProvider.svelte';
	import DefaultsProbe, { type DefaultsProbeProps } from './DefaultsProbe.svelte';

	let {
		outer,
		inner,
		probe = {},
		value = $bindable('initial')
	}: {
		outer?: DefaultsConfig;
		inner?: DefaultsConfig;
		probe?: DefaultsProbeProps;
		value?: string;
	} = $props();
</script>

{#snippet subject()}
	<DefaultsProbe {...probe} bind:value />
{/snippet}

<output data-testid="parent-value">{value}</output>

{#if outer}
	<DefaultsProvider defaults={outer}>
		{#if inner}
			<DefaultsProvider defaults={inner}>{@render subject()}</DefaultsProvider>
		{:else}
			{@render subject()}
		{/if}
	</DefaultsProvider>
{:else}
	{@render subject()}
{/if}
