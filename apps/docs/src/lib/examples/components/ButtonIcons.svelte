<script>
	import { mdiClose, mdiPlus } from '@mdi/js';
	import { Button, Icon } from '@sveltier/ui';
</script>

<Button>
	{#snippet prepend()}<Icon path={mdiPlus} />{/snippet}
	New transfer
</Button>

<!-- An icon alone needs a label for screen readers. -->
<Button icon variant="text" aria-label="Close"><Icon path={mdiClose} /></Button>
