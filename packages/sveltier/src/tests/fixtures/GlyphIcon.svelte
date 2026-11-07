<script lang="ts">
	// An icon component as icon sets other than path sets ship them: an <svg> on a 256 grid that
	// sizes itself, with optional props only.
	let { size = 32, weight = 'regular' }: { size?: number | string; weight?: string } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 256 256"
	fill="currentColor"
	data-testid="glyph"
	data-weight={weight}
>
	<rect x="32" y="32" width="192" height="192" rx="32" />
</svg>
