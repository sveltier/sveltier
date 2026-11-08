<script>
	import { rovingFocus } from '@sveltier/ui';
</script>

<div role="toolbar" aria-label="Chart" {@attach rovingFocus()}>
	<button type="button" data-sv-item>1D</button>
	<button type="button" data-sv-item>1W</button>
	<button type="button" data-sv-item aria-disabled="true">1M</button>
	<button type="button" data-sv-item>1Y</button>
</div>
