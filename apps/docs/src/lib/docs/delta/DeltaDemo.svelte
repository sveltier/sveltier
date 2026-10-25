<script lang="ts">
	// Changes of a portfolio: a rise, a fall with an arrow, no change, and one not known yet.
	import { Delta } from '@sveltier/ui';
</script>

<div class="docs-demo">
	<dl class="docs-deltas">
		<div>
			<dt>P&L today</dt>
			<dd><Delta value={4183.2} format={{ style: 'currency' }} /></dd>
		</div>
		<div>
			<dt>Since open</dt>
			<dd><Delta value={-0.0125} format={{ style: 'percent' }} arrow /></dd>
		</div>
		<div>
			<dt>This week</dt>
			<dd><Delta value={0} format={{ style: 'percent' }} arrow /></dd>
		</div>
		<div>
			<dt>Dividends</dt>
			<dd><Delta value={null} /></dd>
		</div>
	</dl>
</div>
