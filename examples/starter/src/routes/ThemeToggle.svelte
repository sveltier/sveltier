<script lang="ts">
	import { Button, useTheme } from '@sveltier/ui';

	// useTheme() reads the UIProvider above, so it lives in a component inside it.
	const theme = useTheme();
</script>

<Button variant="text" color="neutral" onclick={() => theme.toggle()}>
	{theme.isDark ? 'Light' : 'Dark'} mode
</Button>
