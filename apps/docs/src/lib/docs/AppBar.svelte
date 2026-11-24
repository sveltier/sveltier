<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { SegmentedControl, Select, useTheme } from '@sveltier/ui';
	import Logo from '../brand/Logo.svelte';
	import { PACKS, THEMES, parseChoice, type Mode, type PackId } from '../site.js';
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

<!-- A pack's name after its paper and ink, in the mode shown, so the list previews each pack. -->
{#snippet packOption(id: PackId, name: string)}
	{@const colors = THEMES[`${id}-${theme.isDark ? 'dark' : 'light'}`]?.colors}
	<span class="docs-pack-option">
		<span
			class="docs-pack-swatch"
			style:--paper={colors?.background}
			style:--ink={colors?.primary}
			aria-hidden="true"
		></span>
		{name}
	</span>
{/snippet}

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
			<Select
				aria-label="Theme"
				size="sm"
				class="docs-bar__theme"
				options={PACKS.map((option) => ({ value: option.id, label: option.name }))}
				value={activePack}
				onchange={setPack}
			>
				{#snippet option(item)}
					{@render packOption(item.value, item.label)}
				{/snippet}
				{#snippet selection(item)}
					{@render packOption(item.value, item.label)}
				{/snippet}
			</Select>
			<SegmentedControl
				aria-label="Mode"
				size="sm"
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
