<script lang="ts">
	let { id: idProp, label, hint }: { id?: string; label: string; hint?: string } = $props();

	// Unique per instance, and the same on the server and in the browser.
	const uid = $props.id();
	const id = $derived(idProp ?? uid);
</script>

<label for={id}>{label}</label>
<input {id} aria-describedby={hint ? `${id}-hint` : undefined} />
{#if hint}<p id="{id}-hint">{hint}</p>{/if}
