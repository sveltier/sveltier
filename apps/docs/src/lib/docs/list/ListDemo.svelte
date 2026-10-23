<script lang="ts">
	// Accounts with balances, and a navigation list that marks the current page.
	import { Avatar, Icon, List, ListItem } from 'sveltier';

	const HOME = 'M4 21V9l8-6 8 6v12h-6v-6h-4v6zm2-2h2v-6h8v6h2V10l-6-4.5L6 10z';
	const CARD = 'M3 6h18v12H3zm2 2v2h14V8zm0 5v3h14v-3z';
	const CHART = 'M4 20V4h2v14h14v2zm4-4v-5h2v5zm4 0V8h2v8zm4 0v-3h2v3z';
	const PAGES = [
		{ title: 'Overview', path: HOME },
		{ title: 'Cards', path: CARD },
		{ title: 'Insights', path: CHART }
	];
	let current = $state('Overview');
</script>

<div class="docs-demo">
	<div class="docs-list-grid">
		<div class="docs-list-panel">
			<List>
				<ListItem title="Current account" subtitle="•• 4471">
					{#snippet prepend()}<Avatar size="sm" color="primary">CA</Avatar>{/snippet}
					{#snippet append()}<span class="docs-num">$3,240.18</span>{/snippet}
				</ListItem>
				<ListItem title="Savings" subtitle="Instant access">
					{#snippet prepend()}<Avatar size="sm" color="success">SV</Avatar>{/snippet}
					{#snippet append()}<span class="docs-num">$12,480.00</span>{/snippet}
				</ListItem>
				<ListItem title="Travel fund" subtitle="Locked until June">
					{#snippet prepend()}<Avatar size="sm" color="info">TF</Avatar>{/snippet}
					{#snippet append()}<span class="docs-num">$860.50</span>{/snippet}
				</ListItem>
			</List>
		</div>
		<nav class="docs-list-panel" aria-label="Banking">
			<List nav>
				{#each PAGES as page (page.title)}
					<ListItem
						title={page.title}
						active={current === page.title}
						onclick={() => (current = page.title)}
					>
						{#snippet prepend()}<Icon path={page.path} />{/snippet}
					</ListItem>
				{/each}
				<ListItem title="Loans" disabled onclick={() => {}}>
					{#snippet prepend()}<Icon path={CHART} />{/snippet}
				</ListItem>
			</List>
		</nav>
	</div>
	<p class="docs-dim" aria-live="polite">Showing {current}.</p>
</div>
