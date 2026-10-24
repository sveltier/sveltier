<script lang="ts">
	// A panel that keeps focus while it is open, and gives it back when it closes.
	import { focusTrap } from '@sveltier/ui';

	let open = $state(false);
	let opener = $state<HTMLButtonElement>();
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<button type="button" class="docs-button" bind:this={opener} onclick={() => (open = true)}
			>Open the panel</button
		>
	</div>
	{#if open}
		<div
			class="docs-trap"
			role="group"
			aria-labelledby="trap-title"
			{@attach focusTrap({ returnFocus: opener })}
		>
			<p class="docs-label" id="trap-title">Transfer</p>
			<label class="docs-field">
				<span>Amount</span>
				<input inputmode="decimal" />
			</label>
			<label class="docs-field">
				<span>Reference</span>
				<input />
			</label>
			<div class="docs-actions">
				<button type="button" class="docs-button" onclick={() => (open = false)}>Close</button>
			</div>
		</div>
	{/if}
	<p class="docs-dim">
		While the panel is open, Tab and Shift+Tab stay inside it. Close gives focus back to the button
		that opened it.
	</p>
</div>
