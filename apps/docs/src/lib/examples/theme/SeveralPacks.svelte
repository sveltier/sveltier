<script>
	import { UIProvider, monolith, milano } from '@sveltier/ui';
</script>

<!-- "system" switches between monolith-light and monolith-dark;
     users can also pick milano-light or milano-dark -->
<UIProvider themes={{ ...monolith, ...milano }} light="monolith-light" dark="monolith-dark">
	…
</UIProvider>
