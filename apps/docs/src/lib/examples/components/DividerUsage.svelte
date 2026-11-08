<script>
	import { Button, Divider } from '@sveltier/ui';
</script>

<p>Available</p>
<Divider />
<p>Pending</p>

<!-- In a row, a vertical divider is as tall as the row. -->
<div style="display: flex">
	<Button variant="text">Week</Button>
	<Divider vertical />
	<Button variant="text">Export</Button>
</div>
