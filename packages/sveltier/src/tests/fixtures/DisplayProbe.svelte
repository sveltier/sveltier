<script lang="ts">
	import { useDisplay } from '../../lib/core/display/display.js';

	const display = useDisplay();
</script>

<p data-testid="display">
	{display.name}|{display.mobile}|{display.mdAndUp}|{display.smAndDown}
</p>
