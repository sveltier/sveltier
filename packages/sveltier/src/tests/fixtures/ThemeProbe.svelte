<script lang="ts">
	// Shows what useTheme() sees and exposes its actions as buttons.
	import { useTheme } from '../../lib/core/theme/context.js';

	let { label = 'probe' }: { label?: string } = $props();
	const theme = useTheme();
</script>

<output data-testid={label}>{theme.choice}|{theme.name}|{theme.isDark}</output>
<button type="button" onclick={() => theme.set('bone')}>{label} bone</button>
<button type="button" onclick={() => theme.set('ink')}>{label} ink</button>
<button type="button" onclick={() => theme.toggle()}>{label} toggle</button>
