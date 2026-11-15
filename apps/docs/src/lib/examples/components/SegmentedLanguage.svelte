<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SegmentedControl } from '@sveltier/ui';

	const LANGUAGES = [
		{ value: 'en', label: 'EN', attributes: { 'aria-label': 'EN · English', lang: 'en' } },
		{ value: 'vi', label: 'VI', attributes: { 'aria-label': 'VI · Tiếng Việt', lang: 'vi' } }
	];
	// The route owns the language: picking one goes to its address, and the check follows the page.
	const language = $derived(page.url.pathname.startsWith('/vi') ? 'vi' : 'en');
</script>

<SegmentedControl
	aria-label="Language"
	activation="manual"
	options={LANGUAGES}
	bind:value={() => language, (next) => goto(next === 'vi' ? '/vi' : '/')}
/>
