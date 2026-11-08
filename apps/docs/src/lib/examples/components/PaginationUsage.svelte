<script>
	import { Pagination } from '@sveltier/ui';

	let page = $state(1);
</script>

<!-- Buttons: bind:page follows the page the user picks. -->
<Pagination count={9} bind:page />
