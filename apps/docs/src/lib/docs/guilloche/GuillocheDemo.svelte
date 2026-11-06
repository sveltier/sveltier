<script lang="ts">
	// A premium account card with a rosette behind it, and a cheque-like band of waves.
	import { Amount, Guilloche, type GuillochePattern } from '@sveltier/ui';

	const patterns: { pattern: GuillochePattern; lines: number; title: string }[] = [
		{ pattern: 'rosette', lines: 8, title: 'Premium account' },
		{ pattern: 'waves', lines: 24, title: 'Certificate of deposit' }
	];
</script>

<div class="docs-demo docs-guilloches">
	{#each patterns as item (item.pattern)}
		<div class="docs-guilloche">
			<Guilloche class="docs-guilloche__art" pattern={item.pattern} lines={item.lines} />
			<div class="docs-guilloche__label">{item.title}</div>
			<div class="docs-guilloche__figure">
				<Amount value={250000} format={{ style: 'currency' }} />
			</div>
		</div>
	{/each}
</div>

<style>
	.docs-guilloches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--sv-space-21);
	}

	.docs-guilloche {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: end;
		gap: var(--sv-space-5);
		min-block-size: 10rem;
		padding: var(--sv-space-21);
		overflow: hidden;
		border: var(--sv-hairline) solid var(--sv-color-border);
		border-radius: var(--sv-radius-lg);
		background-color: var(--sv-color-surface-raised);
	}

	.docs-guilloche :global(.docs-guilloche__art) {
		position: absolute;
		inset: 0;
		z-index: -1;
	}

	.docs-guilloche__label {
		color: var(--sv-color-text-muted);
		font-size: var(--sv-text-sm);
	}

	.docs-guilloche__figure {
		font-size: var(--sv-text-xl);
		font-weight: var(--sv-weight-semibold);
	}
</style>
