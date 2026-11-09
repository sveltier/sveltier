<script lang="ts">
	import { FileField } from '@sveltier/ui';

	let statements = $state<File[]>([]);
</script>

<!-- A taller box to drop on, for several files at once. -->
<FileField
	label="Statements"
	name="statements"
	accept="application/pdf"
	multiple
	drop
	hint="PDF statements from your bank, twelve at most"
	rules={[(files) => files.length <= 12 || 'Choose twelve statements at most']}
	bind:files={statements}
/>
