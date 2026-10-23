<script lang="ts">
	// Dividers between stacked rows, and between controls in a row.
	import { Button, Divider } from 'sveltier';
</script>

<div class="docs-demo">
	<div class="docs-divider-stack">
		<div class="docs-divider-row">
			<span>Available</span><span class="docs-num">$12,480.00</span>
		</div>
		<Divider />
		<div class="docs-divider-row"><span>Pending</span><span class="docs-num">$310.25</span></div>
		<Divider />
		<div class="docs-divider-row"><span>Reserved</span><span class="docs-num">$1,200.00</span></div>
	</div>
	<div class="docs-divider-toolbar">
		<Button variant="text" size="sm">Day</Button>
		<Button variant="text" size="sm">Week</Button>
		<Divider vertical />
		<Button variant="text" size="sm">Export</Button>
	</div>
</div>
