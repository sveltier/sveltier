<script lang="ts">
	// The example app in a frame the size of a phone or a desktop screen, so the layout's
	// breakpoints apply as on that screen; a desktop frame is scaled down to fit the page.
	import { SegmentedControl } from '@sveltier/ui';
	import { pageHref } from '../href.js';

	const SCREENS = {
		phone: { width: 390, height: 720 },
		desktop: { width: 1280, height: 800 }
	};
	type Screen = keyof typeof SCREENS;
	type Corner = 'bar' | 'drawer';

	let screen = $state<Screen>('desktop');
	let corner = $state<Corner>('bar');
	let available = $state(0);
	const size = $derived(SCREENS[screen]);
	const scale = $derived(available ? Math.min(1, available / size.width) : 1);
</script>

<div class="docs-demo">
	<div class="docs-device-controls">
		<SegmentedControl
			aria-label="Screen"
			size="sm"
			options={[
				{ value: 'desktop', label: 'Desktop' },
				{ value: 'phone', label: 'Phone' }
			]}
			bind:value={screen}
		/>
		<SegmentedControl
			aria-label="Corner"
			size="sm"
			options={[
				{ value: 'bar', label: 'Bar first' },
				{ value: 'drawer', label: 'Drawer first' }
			]}
			bind:value={corner}
		/>
	</div>
	<!-- The frame keeps the screen's proportions in CSS, so its height is right before scripts run. -->
	<div
		class="docs-device"
		bind:clientWidth={available}
		style:inline-size="min(100%, {size.width}px)"
		style:aspect-ratio="{size.width} / {size.height}"
	>
		<iframe
			title="App layout example"
			src={pageHref(`examples/app-layout/${corner}/overview`)}
			width={size.width}
			height={size.height}
			style:transform="scale({scale})"
		></iframe>
	</div>
</div>
