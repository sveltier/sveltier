<script lang="ts">
	// A Textarea in a themed scope, with its bound value shown, a TextField to compare heights
	// with, and a field after it to move focus to.
	import Textarea from '../../lib/components/Textarea/Textarea.svelte';
	import type { TextareaProps } from '../../lib/components/Textarea/types.js';
	import TextField from '../../lib/components/TextField/TextField.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = $bindable(''), ref = $bindable(null), ...props }: TextareaProps = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Textarea label="Note" {...props} bind:value bind:ref />
	<TextField label="Reference" />
	<span data-testid="value">{value}</span>
</ThemeProvider>
