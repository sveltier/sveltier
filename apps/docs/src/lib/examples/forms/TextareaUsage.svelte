<script>
	import { Textarea } from '@sveltier/ui';
	let note = $state('');
</script>

<!-- Grows with its text from 2 to 8 lines, then scrolls. -->
<Textarea
	label="Note to the payee"
	name="note"
	hint="They see it on their statement"
	maxlength={280}
	rows={2}
	autoGrow
	maxRows={8}
	bind:value={note}
/>
