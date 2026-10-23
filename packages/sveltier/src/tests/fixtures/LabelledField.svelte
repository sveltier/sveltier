<script lang="ts">
	// The ID convention: the id prop when given, else $props.id(); parts derive from it, and
	// only parts that render are referenced.
	let { id: idProp, label, hint }: { id?: string; label: string; hint?: string } = $props();

	const uid = $props.id();
	const id = $derived(idProp ?? uid);
</script>

<div class="field">
	<label for={id} id="{id}-label">{label}</label>
	<input {id} aria-describedby={hint ? `${id}-hint` : undefined} />
	{#if hint}<p id="{id}-hint">{hint}</p>{/if}
</div>
