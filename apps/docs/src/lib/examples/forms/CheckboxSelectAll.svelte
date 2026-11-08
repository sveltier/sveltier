<script>
	import { Checkbox } from '@sveltier/ui';

	const DOCUMENTS = ['Statements', 'Tax forms', 'Trade confirmations'];
	let chosen = $state(['Statements']);
	const all = $derived(chosen.length === DOCUMENTS.length);
</script>

<!-- Checked when every document is, a dash when only some are. -->
<Checkbox
	label="All documents"
	bind:checked={() => all, (on) => (chosen = on ? [...DOCUMENTS] : [])}
	indeterminate={chosen.length > 0 && !all}
/>
{#each DOCUMENTS as document (document)}
	<Checkbox
		label={document}
		bind:checked={
			() => chosen.includes(document),
			(on) => (chosen = on ? [...chosen, document] : chosen.filter((d) => d !== document))
		}
	/>
{/each}
