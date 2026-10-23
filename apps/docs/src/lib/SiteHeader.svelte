<script lang="ts">
	import { resolve } from '$app/paths';
	import { useTheme } from 'sveltier';
	import Segmented from './Segmented.svelte';
	import { parseChoice, type AccentName, type Mode } from './site.js';

	/** Accent used while the mode is "system" (explicit choices carry their own accent). */
	let { accent = $bindable() }: { accent: AccentName } = $props();

	const theme = useTheme();
	const parsed = $derived(parseChoice(theme.choice));
	const activeAccent = $derived(parsed.accent ?? accent);

	function setMode(mode: Mode | 'system') {
		theme.set(mode === 'system' ? 'system' : `${mode}-${activeAccent}`);
	}

	function setAccent(next: AccentName) {
		accent = next;
		if (parsed.mode !== 'system') theme.set(`${parsed.mode}-${next}`);
	}
</script>

<header class="docs-bar">
	<div class="docs-wrap docs-bar__inner">
		<a class="docs-brand" href={resolve('/')}>
			<svg class="docs-brand__mark" viewBox="-100 -100 200 200" aria-hidden="true">
				<g fill="none" stroke="currentColor" stroke-width="3">
					{#each Array.from({ length: 12 }, (_, i) => i * 30) as angle (angle)}
						<ellipse rx="86" ry="34" transform="rotate({angle})" />
					{/each}
				</g>
			</svg>
			<span>
				<strong>Sveltier</strong>
				<small>Engraved Instrument for Svelte 5</small>
			</span>
		</a>
		<nav aria-label="Main">
			<a href={resolve('/')}>Overview</a>
			<a href={resolve('/theme')}>Theme</a>
		</nav>
		<div class="docs-bar__controls">
			<Segmented
				label="Base"
				name="mode"
				value={parsed.mode}
				onchange={setMode}
				options={[
					{ value: 'system', label: 'System' },
					{ value: 'ink', label: 'Ink' },
					{ value: 'bone', label: 'Bone' }
				]}
			/>
			<Segmented
				label="Accent"
				name="accent"
				value={activeAccent}
				onchange={setAccent}
				options={[
					{ value: 'champagne', label: 'Champagne' },
					{ value: 'verdigris', label: 'Verdigris' }
				]}
			/>
		</div>
	</div>
</header>
