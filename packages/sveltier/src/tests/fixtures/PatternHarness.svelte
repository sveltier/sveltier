<script lang="ts">
	import PatternField, { type PatternFieldProps } from './PatternField.svelte';

	let { field = {} }: { field?: PatternFieldProps } = $props();
	let ref = $state<HTMLInputElement | null>(null);
</script>

<PatternField bind:ref {...field} />
<output data-testid="ref">{ref?.tagName ?? 'none'}</output>
