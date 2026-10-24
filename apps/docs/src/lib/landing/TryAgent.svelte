<script lang="ts">
	// A prompt to paste into your own coding agent, pointing it at the machine-readable docs.
	import { onMount } from 'svelte';
	import { pageHref } from '#lib/docs/href.js';

	let docsUrl = $state(pageHref('llms-full.txt'));
	let copied = $state(false);

	const prompt = $derived(
		`Read ${docsUrl} first. Then build a portfolio card in Svelte 5 with Sveltier: ` +
			`the total value, today's change, a period switcher and the top holdings. ` +
			`Use Card, Chip, SegmentedControl and List, and only the shared props ` +
			`(variant, size, density, color, rounded) for styling.`
	);

	onMount(() => {
		docsUrl = new URL(pageHref('llms-full.txt'), location.href).href;
	});

	async function copy() {
		try {
			await navigator.clipboard.writeText(prompt);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard blocked; the prompt stays selectable.
		}
	}
</script>

<section class="landing-section landing-try" aria-labelledby="try-title">
	<header class="landing-head">
		<p class="landing-kicker">Try it</p>
		<h2 id="try-title">Run the replay with your own agent</h2>
		<p>
			Paste this into Claude Code, Cursor or any coding agent. It points the agent at
			<code>llms-full.txt</code>: setup, conventions and every component's props, generated from the
			same types your editor checks.
		</p>
	</header>
	<figure class="landing-card landing-prompt">
		<figcaption class="landing-prompt__bar">
			<span class="docs-label" id="try-prompt">Prompt</span>
			<button type="button" class="docs-code__copy" onclick={copy}
				>{copied ? 'Copied' : 'Copy'}</button
			>
		</figcaption>
		<p>{prompt}</p>
	</figure>
	<p class="landing-try__links">
		<!-- eslint-disable svelte/no-navigation-without-resolve -- pageHref() calls resolve() -->
		<a href={pageHref('llms.txt')} data-sveltekit-reload>llms.txt</a>: an index of the docs.
		<a href={pageHref('llms-full.txt')} data-sveltekit-reload>llms-full.txt</a>: everything in one
		file.
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</p>
</section>
