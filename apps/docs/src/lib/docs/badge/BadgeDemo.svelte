<script lang="ts">
	// Counts and dots on buttons, capped counts, and badges standing in a line.
	import { Badge, Button, Icon } from 'sveltier';

	const BELL = 'M12 3a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0z';
	const MAIL = 'M3 6h18v12H3zm2 2v.5l7 4.5 7-4.5V8zm0 2.9V16h14v-5.1l-7 4.5z';
	let unread = $state(3);
</script>

<div class="docs-demo">
	<div class="docs-actions docs-actions--baseline">
		<Badge id="inbox" content={unread} label="unread messages">
			<Button icon variant="tonal" aria-label="Messages" aria-describedby="inbox-label">
				<Icon path={MAIL} />
			</Button>
		</Badge>
		<Badge id="alerts" content={120} label="alerts" color="error">
			<Button icon variant="tonal" aria-label="Alerts" aria-describedby="alerts-label">
				<Icon path={BELL} />
			</Button>
		</Badge>
		<Badge dot label="New activity" color="success">
			<span class="docs-badge-avatar">AM</span>
		</Badge>
		<Button variant="text" size="sm" onclick={() => (unread = unread === 0 ? 3 : unread - 1)}>
			{unread === 0 ? 'New messages' : 'Read one'}
		</Button>
	</div>
	<p>
		Savings <Badge content="New" /> · Disputes <Badge content={2} label="open" color="warning" />
	</p>
</div>
