<script lang="ts">
	// Two nested layers: Escape or a press outside closes the topmost one first.
	import { dismissable, type DismissReason } from '@sveltier/ui';

	let filters = $state(false);
	let more = $state(false);
	let filtersTrigger = $state<HTMLButtonElement>();
	let moreTrigger = $state<HTMLButtonElement>();
	let status = $state('Open Filters, then More filters.');

	function closeFilters(reason: DismissReason) {
		filters = false;
		more = false;
		status = `Filters closed by ${reason}.`;
	}

	function closeMore(reason: DismissReason) {
		more = false;
		status = `More filters closed by ${reason}; Filters is still open.`;
	}
</script>

<div class="docs-demo">
	<div class="docs-layer-anchor">
		<button
			type="button"
			class="docs-button"
			bind:this={filtersTrigger}
			aria-expanded={filters}
			onclick={() => (filters = !filters)}>Filters</button
		>
		{#if filters}
			<div
				class="docs-layer"
				role="group"
				aria-label="Filters"
				{@attach dismissable({ onDismiss: closeFilters, inside: [filtersTrigger] })}
			>
				<label class="docs-field">
					<span>Minimum amount</span>
					<input inputmode="decimal" />
				</label>
				<div class="docs-layer-anchor">
					<button
						type="button"
						class="docs-button"
						bind:this={moreTrigger}
						aria-expanded={more}
						onclick={() => (more = !more)}>More filters</button
					>
					{#if more}
						<div
							class="docs-layer"
							role="group"
							aria-label="More filters"
							{@attach dismissable({ onDismiss: closeMore, inside: [moreTrigger] })}
						>
							<label class="docs-field">
								<span>Currency</span>
								<input />
							</label>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<p class="docs-dim" aria-live="polite">{status}</p>
</div>
