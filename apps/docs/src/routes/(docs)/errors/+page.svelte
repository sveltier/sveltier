<script lang="ts">
	import DocPage from '#lib/docs/DocPage.svelte';
	import { ERROR_CODES } from 'sveltier';

	// Codes group by area, by their first digit.
	const AREAS = [
		{ digit: '1', id: 'themes', title: 'Themes' },
		{ digit: '2', id: 'core', title: 'Core engine' },
		{ digit: '3', id: 'primitives', title: 'Primitives' },
		{ digit: '4', id: 'components', title: 'Components' },
		{ digit: '5', id: 'forms', title: 'Forms' }
	];
	const ENTRIES = Object.entries(ERROR_CODES);
</script>

<!-- The registry marks code with backticks, as Markdown does. -->
{#snippet rich(text: string)}
	{#each text.split('`') as part, index (index)}{#if index % 2}<code>{part}</code
			>{:else}{part}{/if}{/each}
{/snippet}

<DocPage
	title="Errors"
	lede="Every error Sveltier throws, and every warning it logs in development, has a stable code. The message says what happened and what to do, and links to its entry here."
>
	<p>A message reads like this, with the values involved and a link to its code:</p>
	<pre class="docs-error-sample"><code
			>[sveltier SV3001] Portal: no element matches "#dialogs". Render the target first, or pass the element itself. https://sveltier.com/errors#SV3001</code
		></pre>
	<p>
		A code keeps its meaning in every version, so it is safe to search for; the words may improve.
		The same list ships in the package as <code>ERROR_CODES</code>.
	</p>
	<p>
		Errors are thrown in every build. Warnings come from checks that run only under your bundler's
		development condition, such as the Vite dev server: a prop value outside its list, a field
		without a name. Production builds leave them out.
	</p>

	{#each AREAS as area (area.id)}
		{@const entries = ENTRIES.filter(([code]) => code[2] === area.digit)}
		{#if entries.length > 0}
			<h2 id={area.id}>{area.title}</h2>
			{#each entries as [code, entry] (code)}
				<h3 id={code} class="docs-error-code">
					<code>{code}</code>
					{entry.title}
					{#if entry.kind === 'warning'}<span class="docs-error-kind">Development warning</span
						>{/if}
				</h3>
				<p>{@render rich(entry.cause)}</p>
				<p><strong>Fix:</strong> {@render rich(entry.fix)}</p>
			{/each}
		{/if}
	{/each}
</DocPage>
