<script>
	import { Button, UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
</script>

<UIProvider themes={monolith} defaults={{ Button: { variant: 'tonal', rounded: 'full' } }}>
	<!-- Every Button below is tonal and round unless it says otherwise. -->
	<Button>Send</Button>
	<Button variant="text">Cancel</Button>
</UIProvider>
