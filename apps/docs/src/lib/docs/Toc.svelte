<script lang="ts">
	// "On this page": the h2 headings of the current page, with the one in view highlighted.
	import { afterNavigate } from '$app/navigation';

	interface Entry {
		id: string;
		text: string;
	}

	let entries = $state<Entry[]>([]);
	let active = $state<string | undefined>();
	let observer: IntersectionObserver | undefined;

	afterNavigate(() => {
		observer?.disconnect();
		const headings = Array.from(document.querySelectorAll<HTMLElement>('.doc-body h2[id]'));
		entries = headings.map((h) => ({ id: h.id, text: h.textContent?.trim() ?? '' }));
		active = entries[0]?.id;
		observer = new IntersectionObserver(
			(records) => {
				const visible = records.filter((r) => r.isIntersecting);
				if (visible[0]) active = visible[0].target.id;
			},
			{ rootMargin: '-72px 0px -70% 0px' }
		);
		headings.forEach((h) => observer?.observe(h));
	});

	$effect(() => () => observer?.disconnect());
</script>

{#if entries.length > 1}
	<nav class="docs-toc" aria-labelledby="docs-toc-title">
		<h2 class="docs-toc__title" id="docs-toc-title">On this page</h2>
		<ul>
			{#each entries as entry (entry.id)}
				<li>
					<a href="#{entry.id}" aria-current={active === entry.id ? 'location' : undefined}
						>{entry.text}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
