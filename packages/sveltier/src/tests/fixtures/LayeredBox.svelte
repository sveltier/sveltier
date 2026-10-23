<script lang="ts">
	// Fixture for infrastructure tests: mirrors how every component ships its stylesheet
	// (a side-effect CSS import inside the .svelte file, rules wrapped in @layer).
	import type { Snippet } from 'svelte';
	import './layered-box.css';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="sv-layered-box">{@render children?.()}</div>
