<!-- src/ThemeToggle.svelte -->
<script lang="ts">
	import { Button, useTheme } from '@sveltier/ui';

	// Inside the provider, so it finds the theme.
	const theme = useTheme();
</script>

<Button variant="text" onclick={() => theme.toggle()}>
	{theme.isDark ? 'Light' : 'Dark'} mode
</Button>
