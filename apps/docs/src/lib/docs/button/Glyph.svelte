<script lang="ts" module>
	// Stroke icons for the docs demos. The library bundles no icon set: any SVG works.
	const PATHS = {
		arrow: 'M5 12h14M13 6l6 6-6 6',
		plus: 'M12 5v14M5 12h14',
		download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
		send: 'M4 12l16-8-6 16-3-7z',
		close: 'M6 6l12 12M18 6L6 18',
		check: 'M5 12l5 5 9-10'
	};

	export type GlyphName = keyof typeof PATHS;
</script>

<script lang="ts">
	let { name }: { name: GlyphName } = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={PATHS[name]} />
</svg>
