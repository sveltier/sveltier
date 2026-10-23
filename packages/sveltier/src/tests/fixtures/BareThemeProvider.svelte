<script lang="ts">
	// A root provider without themes, which must fail with a message that says what to pass.
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
</script>

<ThemeProvider><span>content</span></ThemeProvider>
