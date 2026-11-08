<script>
	import { Button, TextField } from '@sveltier/ui';
</script>

<div class="square">
	<Button>Square corners</Button>
	<TextField label="Reference" />
</div>

<style>
	/* Tokens are custom properties: set one on a container and
     everything inside follows. */
	.square {
		--sv-radius-md: 0;
	}
</style>
