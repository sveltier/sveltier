<script>
	import { Button, ButtonGroup } from '@sveltier/ui';

	let { exportCsv, exportPdf } = $props();
</script>

<ButtonGroup aria-label="Export">
	<Button onclick={exportCsv}>CSV</Button>
	<Button onclick={exportPdf}>PDF</Button>
</ButtonGroup>
