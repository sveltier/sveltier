<script lang="ts">
	// Shows a toast while it initialises, as a component that reports something on load would.
	import { useToast } from '../../lib/core/toast/toast.svelte.js';

	useToast().show('Shown while rendering');
</script>

<p>Ready</p>
