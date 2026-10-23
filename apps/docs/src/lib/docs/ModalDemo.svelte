<script lang="ts">
	// A modal sheet built from primitives alone: portal, focus trap, inert page, scroll lock and
	// dismissal.
	import { Portal, dismissable, focusTrap, inertOthers, scrollLock } from 'sveltier';

	let open = $state(false);
	let opener = $state<HTMLButtonElement>();
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<button type="button" class="docs-button" bind:this={opener} onclick={() => (open = true)}
			>Review transfer</button
		>
	</div>
	{#if open}
		<Portal>
			<div class="docs-sheet-scrim"></div>
			<div
				class="docs-sheet"
				role="dialog"
				aria-modal="true"
				aria-labelledby="sheet-title"
				{@attach focusTrap({ returnFocus: opener })}
				{@attach inertOthers()}
				{@attach scrollLock()}
				{@attach dismissable({ onDismiss: () => (open = false) })}
			>
				<h2 id="sheet-title" class="docs-sheet__title">Confirm transfer</h2>
				<p>€1,250.00 to Alex Morgan, arriving in seconds.</p>
				<div class="docs-actions">
					<button type="button" class="docs-button" onclick={() => (open = false)}>Cancel</button>
					<button
						type="button"
						class="docs-button docs-button--primary"
						onclick={() => (open = false)}>Confirm</button
					>
				</div>
			</div>
		</Portal>
	{/if}
	<p class="docs-dim">
		The sheet is portaled to the end of the page. Behind it the page is inert and does not scroll;
		Escape or a press outside closes it, and focus returns to the button.
	</p>
</div>
