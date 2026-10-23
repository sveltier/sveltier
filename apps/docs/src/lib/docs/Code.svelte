<script lang="ts">
	// A titled, keyboard-scrollable code block with a copy button.
	let { code, title, lang = 'svelte' }: { code: string; title?: string; lang?: string } = $props();

	const id = $props.id();
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard blocked (insecure context or permissions); the code stays selectable.
		}
	}
</script>

<figure class="docs-code">
	<figcaption>
		<span class="docs-label" id="{id}-title">{title ?? lang}</span>
		<button type="button" class="docs-code__copy" onclick={copy}>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</figcaption>
	<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1, axe scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<pre role="region" aria-labelledby="{id}-title" tabindex="0" data-lang={lang}><code>{code}</code
		></pre>
</figure>
