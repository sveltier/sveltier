<script lang="ts">
	// A backup to restore beside a drop zone for statements. Nothing leaves the browser.
	import { FileField } from '@sveltier/ui';

	let backup = $state<File[]>([]);
	let statements = $state<File[]>([]);
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<FileField
			label="Backup"
			name="backup"
			accept=".json,application/json"
			hint="The file Export made"
			bind:files={backup}
		/>
		<FileField
			label="Statements"
			name="statements"
			accept="application/pdf"
			multiple
			drop
			hint="PDF statements, twelve at most"
			rules={[(files) => files.length <= 12 || 'Choose twelve statements at most']}
			bind:files={statements}
		/>
	</div>
	<p class="docs-dim">
		{backup.length + statements.length} file{backup.length + statements.length === 1 ? '' : 's'} chosen,
		read only in this browser.
	</p>
</div>
