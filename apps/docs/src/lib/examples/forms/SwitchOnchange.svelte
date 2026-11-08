<script>
	import { Switch } from '@sveltier/ui';
	let { settings, save } = $props();
</script>

<!-- Saved as soon as it changes: onchange receives the new state. -->
<Switch label="Sound" checked={settings.sound} onchange={(sound) => save({ ...settings, sound })} />
