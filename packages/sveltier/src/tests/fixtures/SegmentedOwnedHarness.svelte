<script lang="ts">
	// A language switch whose value the app owns: picking asks for a change, and only the app's
	// own value, applied later or never, moves the check.
	import SegmentedControl from '../../lib/components/SegmentedControl/SegmentedControl.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { activation = 'manual' }: { activation?: 'automatic' | 'manual' } = $props();

	let language = $state('en');
	let asked = $state('');
	const OPTIONS = [
		{
			value: 'en',
			label: 'EN',
			tooltip: 'English',
			attributes: { 'aria-label': 'EN · English', lang: 'en', 'aria-describedby': 'language-note' }
		},
		{
			value: 'vi',
			label: 'VI',
			tooltip: 'Tiếng Việt',
			attributes: { 'aria-label': 'VI · Tiếng Việt', lang: 'vi' }
		}
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<SegmentedControl
		aria-label="Language"
		{activation}
		options={OPTIONS}
		bind:value={() => language, (next) => (asked = next)}
	/>
	<span id="language-note">Reloads the page</span>
	<span data-testid="asked">{asked}</span>
	<button type="button" onclick={() => (language = asked)}>Apply</button>
</ThemeProvider>
