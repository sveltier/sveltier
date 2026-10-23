<script lang="ts">
	import type { ApiRow } from './api.js';

	let { rows, label }: { rows: ApiRow[]; label: string } = $props();
	const hasDefault = $derived(rows.some((row) => row.default !== undefined));

	// Descriptions written in JSDoc mark code with backticks: every odd part is code.
	const parts = (text: string) => text.split('`');
</script>

<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="docs-table-scroll" role="region" aria-label={label} tabindex="0">
	<table class="docs-api">
		<thead>
			<tr>
				<th scope="col">Name</th>
				<th scope="col">Type</th>
				{#if hasDefault}<th scope="col">Default</th>{/if}
				<th scope="col">Description</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.name)}
				<tr>
					<td><code>{row.name}</code></td>
					<td><code class="docs-dim">{row.type}</code></td>
					{#if hasDefault}<td><code class="docs-dim">{row.default ?? '–'}</code></td>{/if}
					<td>
						{#each parts(row.description) as part, i (i)}{#if i % 2}<code>{part}</code
								>{:else}{part}{/if}{/each}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
