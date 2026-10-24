<script lang="ts">
	// Joined actions: an outlined set, a tonal set with icons, and a pill of flat buttons.
	import { Button, ButtonGroup, Icon } from '@sveltier/ui';

	const UP = 'M12 5 5 12l1.4 1.4 4.6-4.6V19h2V8.8l4.6 4.6L19 12z';
	const DOWN = 'M12 19 5 12l1.4-1.4 4.6 4.6V5h2v10.2l4.6-4.6L19 12z';
	const COPY = 'M8 3h11v13h-2V5H8zM5 7h10v14H5zm2 2v10h6V9z';
	let message = $state('Pick an action.');
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<ButtonGroup aria-label="Export">
			<Button onclick={() => (message = 'Exported as CSV.')}>CSV</Button>
			<Button onclick={() => (message = 'Exported as PDF.')}>PDF</Button>
			<Button onclick={() => (message = 'Exported as OFX.')}>OFX</Button>
		</ButtonGroup>
		<ButtonGroup variant="tonal" aria-label="Sort">
			<Button icon aria-label="Sort ascending" onclick={() => (message = 'Sorted ascending.')}>
				<Icon path={UP} />
			</Button>
			<Button icon aria-label="Sort descending" onclick={() => (message = 'Sorted descending.')}>
				<Icon path={DOWN} />
			</Button>
		</ButtonGroup>
		<ButtonGroup variant="flat" rounded="full" aria-label="Account number">
			<Button onclick={() => (message = 'Account number shown.')}>Show</Button>
			<Button onclick={() => (message = 'Account number copied.')}>
				{#snippet prepend()}<Icon path={COPY} />{/snippet}
				Copy
			</Button>
		</ButtonGroup>
	</div>
	<p class="docs-dim" aria-live="polite">{message}</p>
</div>
