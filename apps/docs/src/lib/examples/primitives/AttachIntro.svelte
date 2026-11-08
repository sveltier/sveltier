<script>
	import { focusTrap } from '@sveltier/ui';
	let open = $state(false);
</script>

<!-- Active while open; cleaned up when open turns false or the element goes away. -->
<div {@attach open && focusTrap()}>…</div>
