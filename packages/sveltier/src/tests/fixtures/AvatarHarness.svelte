<script lang="ts">
	// An avatar with initials as its fallback, in a themed scope.
	import Avatar from '../../lib/components/Avatar/Avatar.svelte';
	import type { AvatarProps } from '../../lib/components/Avatar/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { ...props }: AvatarProps = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Avatar data-testid="avatar" {...props}>am</Avatar>
</ThemeProvider>
