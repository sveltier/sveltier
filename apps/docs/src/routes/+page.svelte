<script lang="ts">
	import { getThemeSpike } from '#lib/spike-theme/ThemeProviderSpike.svelte';
	import type { ThemeChoice } from '#lib/spike-theme/theme.js';
	import { version } from 'sveltier';

	const theme = getThemeSpike();
	const choices: ThemeChoice[] = ['system', 'ink', 'bone'];
</script>

<svelte:head>
	<title>Sveltier</title>
</svelte:head>

<h1>Sveltier</h1>
<p>Package version {version}</p>

<div role="group" aria-label="Theme">
	{#each choices as option (option)}
		<button
			type="button"
			aria-pressed={theme.choice === option}
			disabled={theme.choice === undefined}
			onclick={() => theme.set(option)}>{option}</button
		>
	{/each}
</div>
