<script lang="ts">
	import { FileField } from '@sveltier/ui';

	let message = $state('');

	// Reads the backup in the browser: nothing is uploaded.
	async function restore(files: File[]) {
		const file = files[0];
		if (!file) return;
		const backup = JSON.parse(await file.text());
		message = `${backup.orders.length} orders restored`;
	}
</script>

<FileField
	label="Backup"
	name="backup"
	accept=".json,application/json"
	hint="The file Export made"
	onchange={restore}
/>
{#if message}<p>{message}</p>{/if}
