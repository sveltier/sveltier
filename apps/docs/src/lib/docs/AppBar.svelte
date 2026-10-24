<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { useTheme } from '@sveltier/ui';
	import Logo from '../brand/Logo.svelte';
	import Segmented from '../Segmented.svelte';
	import { PACKS, parseChoice, type Mode, type PackId } from '../site.js';
	import { useShell } from './shell.svelte.js';

	/** Pack used while the mode is "system" (explicit choices carry their own pack). */
	let { pack = $bindable() }: { pack: PackId } = $props();

	const theme = useTheme();
	const shell = useShell();
	const parsed = $derived(parseChoice(theme.choice));
	const activePack = $derived(parsed.pack ?? pack);
	const inDocs = $derived(page.route.id?.startsWith('/(docs)') ?? false);

	function setMode(mode: Mode | 'system') {
		theme.set(mode === 'system' ? 'system' : `${activePack}-${mode}`);
	}

	function setPack(next: PackId) {
		pack = next;
		if (parsed.mode !== 'system') theme.set(`${next}-${parsed.mode}`);
	}
</script>

<header class="docs-bar">
	<div class="docs-bar__inner">
		{#if inDocs}
			<button
				type="button"
				class="docs-icon-button docs-bar__menu"
				aria-controls="docs-sidebar"
				aria-expanded={shell.menuOpen}
				aria-label={shell.menuOpen ? 'Close navigation' : 'Open navigation'}
				onclick={() => (shell.menuOpen = !shell.menuOpen)}
			>
				<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
					<path
						d={shell.menuOpen ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 10h14M3 14h14'}
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		{/if}
		<a class="docs-brand" href={resolve('/')}>
			<Logo />
			<span class="docs-visually-hidden">Sveltier</span>
		</a>
		<nav class="docs-bar__nav" aria-label="Site">
			<a
				href={resolve('getting-started/installation')}
				aria-current={page.url.pathname.includes('getting-started') ? 'page' : undefined}>Docs</a
			>
			<a
				href={resolve('theme-packs')}
				aria-current={page.url.pathname.includes('theme-packs') ? 'page' : undefined}>Themes</a
			>
			<a href="https://github.com/sveltier/sveltier" rel="external">GitHub</a>
		</nav>
		<div class="docs-bar__controls">
			<label class="docs-select">
				<span class="docs-visually-hidden">Theme</span>
				<select
					value={activePack}
					onchange={(event) => setPack(event.currentTarget.value as PackId)}
				>
					{#each PACKS as option (option.id)}
						<option value={option.id}>{option.name}</option>
					{/each}
				</select>
			</label>
			<Segmented
				label="Mode"
				name="mode"
				value={parsed.mode}
				onchange={setMode}
				options={[
					{ value: 'system', label: 'Auto' },
					{ value: 'light', label: 'Light' },
					{ value: 'dark', label: 'Dark' }
				]}
			/>
		</div>
	</div>
</header>
