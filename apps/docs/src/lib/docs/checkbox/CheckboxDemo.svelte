<script lang="ts">
	// A receipt preference with a hint and licence terms with a link in the label, beside a
	// "select all" box over three documents.
	import { Checkbox } from 'sveltier';

	const DOCUMENTS = ['Statements', 'Tax forms', 'Trade confirmations'];

	let receipt = $state(true);
	let accepted = $state(false);
	let chosen = $state<string[]>(['Statements']);
	const all = $derived(chosen.length === DOCUMENTS.length);

	const pick = (document: string, on: boolean) =>
		(chosen = on ? [...chosen, document] : chosen.filter((item) => item !== document));
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<div class="docs-choices">
			<Checkbox
				label="Email me a receipt"
				name="receipt"
				hint="Sent after every transfer"
				bind:checked={receipt}
			/>
			<Checkbox name="licence" required bind:checked={accepted}>
				{#snippet label()}I accept the
					<a href="https://github.com/sveltier/sveltier/blob/main/LICENSE" rel="external"
						>licence terms</a
					>{/snippet}
			</Checkbox>
		</div>
		<div class="docs-choices">
			<Checkbox
				label="All documents"
				bind:checked={() => all, (on) => (chosen = on ? [...DOCUMENTS] : [])}
				indeterminate={chosen.length > 0 && !all}
			/>
			<div class="docs-choices docs-choices--nested">
				{#each DOCUMENTS as document (document)}
					<Checkbox
						label={document}
						bind:checked={() => chosen.includes(document), (on) => pick(document, on)}
					/>
				{/each}
			</div>
		</div>
	</div>
	<p class="docs-dim">
		Bound values: <code>receipt = {JSON.stringify(receipt)}</code>,
		<code>accepted = {JSON.stringify(accepted)}</code>,
		<code>chosen = {JSON.stringify(chosen)}</code>
	</p>
</div>
