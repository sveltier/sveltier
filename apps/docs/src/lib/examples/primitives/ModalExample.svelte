<script>
	import { Portal, dismissable, focusTrap, inertOthers, scrollLock } from '@sveltier/ui';
	let open = $state(false);
	let opener = $state();
</script>

<button type="button" bind:this={opener} onclick={() => (open = true)}>Review transfer</button>

{#if open}
	<Portal>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="sheet-title"
			{@attach focusTrap({ returnFocus: opener })}
			{@attach inertOthers()}
			{@attach scrollLock()}
			{@attach dismissable({ onDismiss: () => (open = false) })}
		>
			<h2 id="sheet-title">Confirm transfer</h2>
			…
		</div>
	</Portal>
{/if}
