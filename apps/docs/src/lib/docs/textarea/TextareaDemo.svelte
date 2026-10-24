<script lang="ts">
	// A note that grows with its text, beside a fixed-height message with a minimum length.
	import { Textarea } from 'sveltier';

	let note = $state('');
	let message = $state('');
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<Textarea
			label="Note to the payee"
			name="note"
			hint="Grows from 2 to 8 lines, then scrolls"
			maxlength={280}
			rows={2}
			autoGrow
			maxRows={8}
			bind:value={note}
		/>
		<Textarea
			label="Message to support"
			name="message"
			hint="At least 20 characters, so we can help"
			minlength={20}
			required
			bind:value={message}
		/>
	</div>
	<p class="docs-dim">{note.length} / 280 characters in the note.</p>
</div>
