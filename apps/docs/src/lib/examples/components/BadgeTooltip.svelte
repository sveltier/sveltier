<script>
	import { mdiBell } from '@mdi/js';
	import { Badge, Button, Icon, Tooltip } from '@sveltier/ui';
	let { waiting } = $props();
</script>

<!-- Described by the tooltip and by the count: join the ids, the tooltip's first. -->
<Badge id="alerts" content={waiting} label="alerts waiting">
	<Tooltip text="Price alerts">
		{#snippet trigger(attributes)}
			<Button
				{...attributes}
				icon
				aria-label="Alerts"
				aria-describedby={[attributes['aria-describedby'], waiting > 0 && 'alerts-label']
					.filter(Boolean)
					.join(' ')}
			>
				<Icon path={mdiBell} />
			</Button>
		{/snippet}
	</Tooltip>
</Badge>
