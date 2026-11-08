<script>
	import { mdiEmail } from '@mdi/js';
	import { Badge, Button, Icon } from '@sveltier/ui';
</script>

<!-- The button is described by the badge's text, so the count is heard on focus. -->
<Badge id="inbox" content={3} label="unread messages">
	<Button icon aria-label="Messages" aria-describedby="inbox-label">
		<Icon path={mdiEmail} />
	</Button>
</Badge>

<!-- Alone in a line. -->
Savings <Badge content="New" />
