<script lang="ts">
	// Native date and time inputs, which have no Sveltier component yet, in a Field.
	import { Field } from 'sveltier';

	let date = $state('');
	let time = $state('09:00');
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<Field label="Start date" hint="The first payment goes out on this day" required>
			{#snippet children(attributes)}
				<input type="date" name="start" {...attributes} bind:value={date} />
			{/snippet}
		</Field>
		<Field label="Send at" hint="In your time zone">
			{#snippet children(attributes)}
				<input type="time" name="time" {...attributes} bind:value={time} />
			{/snippet}
		</Field>
	</div>
</div>
