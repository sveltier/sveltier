<script lang="ts">
	// Size budgets, read from the package's size-limit config: the numbers CI enforces.
	import config from '../../../../../packages/sveltier/size.config.js';

	interface Entry {
		name: string;
		limit: string;
	}

	function bytes(limit: string): number {
		const [value = '0', unit = 'B'] = limit.split(' ');
		return Number(value) * (unit.toUpperCase() === 'KB' ? 1000 : 1);
	}

	const entries = (config as Entry[]).filter((entry) => /^[A-Z]/.test(entry.name));
	const components = entries.map((entry) => ({
		name: entry.name,
		limit: entry.limit,
		size: bytes(entry.limit)
	}));
	const largest = Math.max(...components.map((entry) => entry.size));
	const total = (config as Entry[]).find((entry) => entry.name.startsWith('index'));
</script>

<section class="landing-section" aria-labelledby="size-title">
	<header class="landing-head">
		<p class="landing-kicker">Small by design</p>
		<h2 id="size-title">Zero dependencies. A budget on every entry.</h2>
		<p>
			Each component's own JavaScript and CSS, gzipped, as CI enforces it: a change that grows past
			its budget fails the build. Everything together stays under {total?.limit ?? '24 KB'}.
		</p>
	</header>
	<div class="landing-card landing-budget">
		<table class="landing-table landing-budget__table">
			<caption class="docs-visually-hidden">Size budget per component, gzip</caption>
			<thead>
				<tr
					><th scope="col">Entry</th><th scope="col">Budget</th><th scope="col"
						><span class="docs-visually-hidden">Bar</span></th
					></tr
				>
			</thead>
			<tbody>
				{#each components as entry (entry.name)}
					<tr>
						<th scope="row">{entry.name}</th>
						<td class="docs-num">{entry.limit}</td>
						<td class="landing-budget__cell" aria-hidden="true">
							<span class="landing-budget__bar" style:inline-size="{(entry.size / largest) * 100}%"
							></span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
