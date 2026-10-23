<script lang="ts">
	// Stands in for the root provider: gives its subtree a display built from options.
	import { untrack } from 'svelte';
	import {
		createDisplay,
		setDisplayContext,
		type DisplayOptions
	} from '../../lib/core/display/display.js';
	import DisplayProbe from './DisplayProbe.svelte';

	let { options }: { options: DisplayOptions } = $props();

	// Options are read once, as the root provider does.
	setDisplayContext(untrack(() => createDisplay(options)));
</script>

<DisplayProbe />
