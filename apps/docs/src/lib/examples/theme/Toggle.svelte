<script>
	import { useTheme } from '@sveltier/ui';
	const theme = useTheme();
</script>

<button type="button" onclick={() => theme.toggle()}>
	{theme.isDark ? 'Light' : 'Dark'}
</button>
