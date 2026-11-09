<script lang="ts">
	// A FileField in a themed scope and a form, with the bound files, each onchange and the
	// submitted file names written out.
	import FileField from '../../lib/components/FileField/FileField.svelte';
	import type { FileFieldProps } from '../../lib/components/FileField/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { files = $bindable([]), ...props }: FileFieldProps = $props();
	let changes = $state<string[]>([]);
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			submitted = data
				.getAll('backup')
				.map((file) => (file as File).name)
				.join(',');
		}}
	>
		<FileField
			label="Backup"
			name="backup"
			{...props}
			onchange={(next) => (changes = [...changes, next.map((file) => file.name).join(',')])}
			bind:files
		/>
		<input aria-label="Next" />
		<button type="submit">Send</button>
	</form>
	<span data-testid="files">{files.map((file) => file.name).join(',') || 'none'}</span>
	<span data-testid="changes">{changes.join('|')}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
