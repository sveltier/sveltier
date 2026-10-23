<script lang="ts">
	import { resolve } from '$app/paths';
	import { useTheme } from 'sveltier';
	import Segmented from './Segmented.svelte';
	import { PACKS, parseChoice, type Mode, type PackId } from './site.js';

	/** Pack used while the mode is "system" (explicit choices carry their own pack). */
	let { pack = $bindable() }: { pack: PackId } = $props();

	const theme = useTheme();
	const parsed = $derived(parseChoice(theme.choice));
	const activePack = $derived(parsed.pack ?? pack);

	function setMode(mode: Mode | 'system') {
		theme.set(mode === 'system' ? 'system' : `${activePack}-${mode}`);
	}

	function setPack(next: PackId) {
		pack = next;
		if (parsed.mode !== 'system') theme.set(`${next}-${parsed.mode}`);
	}
</script>

<header class="docs-bar">
	<div class="docs-wrap docs-bar__inner">
		<a class="docs-brand" href={resolve('/')}>
			<span class="docs-brand__mark" aria-hidden="true"></span>
			<strong>Sveltier</strong>
		</a>
		<nav aria-label="Main">
			<a href={resolve('/')}>Overview</a>
			<a href={resolve('/theme')}>Themes</a>
		</nav>
		<div class="docs-bar__controls">
			<div class="docs-scroll-x">
				<Segmented
					label="Theme"
					name="pack"
					value={activePack}
					onchange={setPack}
					options={PACKS.map((p) => ({ value: p.id, label: p.name }))}
				/>
			</div>
			<Segmented
				label="Mode"
				name="mode"
				value={parsed.mode}
				onchange={setMode}
				options={[
					{ value: 'system', label: 'System' },
					{ value: 'light', label: 'Light' },
					{ value: 'dark', label: 'Dark' }
				]}
			/>
		</div>
	</div>
</header>
