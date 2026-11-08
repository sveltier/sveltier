<script lang="ts">
	// The live regions that read the toasts out, apart from the region that shows them, so they
	// are in the page from the start: a live region added with its text is not read. The
	// provider renders one at the end of the page, and the modal shell one inside each open
	// dialog; only the topmost outlet's speak.
	import '../../styles/visually-hidden.css';
	import type { Toasts } from './toast.svelte.js';

	let {
		toasts,
		outlet
	}: {
		toasts: Toasts;
		/** The outlet's token, which the toasts compare with their topmost outlet. */
		outlet: object;
	} = $props();

	const notes = $derived(toasts.top === outlet ? toasts.announcements : []);
</script>

<!-- Read out once each, then emptied: the toasts themselves are not live. -->
{#snippet read(assertive: boolean)}
	{#each notes as note (note.id)}
		{#if note.assertive === assertive}<p>{note.message}</p>
			{#if note.action}<p>{note.action}</p>{/if}{/if}
	{/each}
{/snippet}
<div class="sv-visually-hidden" aria-live="polite">{@render read(false)}</div>
<div class="sv-visually-hidden" aria-live="assertive">{@render read(true)}</div>
