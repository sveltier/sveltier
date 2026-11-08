<script>
	import { mdiCheck } from '@mdi/js';
	import { Icon } from '@sveltier/ui';
</script>

<!-- Decorative: next to text that says the same thing. -->
<Icon path={mdiCheck} /> Verified

<!-- Meaningful on its own: give it a name. -->
<Icon path={mdiCheck} label="Verified" color="success" />
