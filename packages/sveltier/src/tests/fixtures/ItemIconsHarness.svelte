<script lang="ts">
	// A Menu, a Tree or a CommandPalette, open, with one item whose icon is a path and one whose
	// icon is a component of another icon set.
	import {
		Button,
		CommandPalette,
		Menu,
		Tree,
		type CommandItem,
		type MenuItem,
		type TreeItem
	} from '../../lib/index.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
	import GlyphIcon from './GlyphIcon.svelte';

	let { kind }: { kind: 'menu' | 'tree' | 'palette' } = $props();

	const PENCIL =
		'M3 17.2V21h3.8l11-11-3.8-3.8zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0L15.2 5.1 19 8.9z';
	const menuItems: MenuItem[] = [
		{ label: 'Rename', value: 'rename', icon: PENCIL },
		{ label: 'Settings', value: 'settings', icon: GlyphIcon }
	];
	const treeItems: TreeItem[] = [
		{ value: 'path', label: 'Path', icon: PENCIL },
		{ value: 'glyph', label: 'Glyph', icon: GlyphIcon }
	];
	const commands: CommandItem[] = [
		{ label: 'Rename', icon: PENCIL },
		{ label: 'Settings', icon: GlyphIcon }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	{#if kind === 'menu'}
		<Menu items={menuItems} open>
			{#snippet trigger(attributes)}<Button {...attributes}>Actions</Button>{/snippet}
		</Menu>
	{:else if kind === 'tree'}
		<Tree aria-label="Lists" items={treeItems} />
	{:else}
		<CommandPalette label="Go to" items={commands} open />
	{/if}
</ThemeProvider>
