<script>
	import { Avatar } from '@sveltier/ui';

	let { user } = $props();
</script>

<!-- A name is shown next to it, so the avatar is decorative. -->
<Avatar src={user.photo}>AM</Avatar> Alex Morgan

<!-- On its own, it needs alt text. -->
<Avatar src={user.photo} alt="Alex Morgan" size="lg">AM</Avatar>
