<script lang="ts">
	// Questions about transfers, one answer open at a time, with one question not available yet.
	import { Accordion, type AccordionItem } from '@sveltier/ui';

	const items: AccordionItem[] = [
		{ value: 'fees', title: 'What does a transfer cost?' },
		{ value: 'timing', title: 'How long does a transfer take?' },
		{ value: 'limits', title: 'How much can I send?' },
		{ value: 'instalments', title: 'Can I pay in instalments? (coming soon)', disabled: true }
	];
	const answers: Record<string, string> = {
		fees: 'Transfers in euros are free. Other currencies cost 0.4% of the amount, shown before you confirm.',
		timing:
			'Most transfers arrive the same day. Some banks take up to two working days, and transfers made at the weekend leave on Monday.',
		limits: 'You can send up to €20,000 a day. Contact support to raise the limit for one payment.',
		instalments: 'Instalments are not available yet.'
	};

	let open = $state<string | null>('fees');
</script>

<div class="docs-demo">
	<Accordion {items} bind:value={open}>
		{#snippet panel(item)}
			<p>{answers[item.value]}</p>
		{/snippet}
	</Accordion>
	<p class="docs-dim">Open: <code>{JSON.stringify(open)}</code></p>
</div>
