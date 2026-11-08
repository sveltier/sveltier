<script lang="ts">
	import { CommandPalette, type CommandItem } from '@sveltier/ui';
	// A path from a path-based set, or a component from any other set.
	import { mdiCog } from '@mdi/js';
	import { ChartLine } from 'phosphor-svelte';

	const commands: CommandItem[] = [
		{ label: 'Markets', icon: ChartLine },
		{ label: 'Settings', icon: mdiCog }
	];
</script>

<CommandPalette label="Go to" items={commands} />
