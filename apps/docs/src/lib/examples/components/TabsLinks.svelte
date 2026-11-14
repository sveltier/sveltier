<script>
	import { page } from '$app/state';
	import { Tabs } from '@sveltier/ui';

	const SECTIONS = [
		{ value: 'lessons', label: 'Lessons', href: '/learn/lessons' },
		{ value: 'lab', label: 'Lab', href: '/learn/lab' },
		{ value: 'exercise', label: 'Exercise', href: '/learn/exercise' }
	];
</script>

<!-- src/routes/learn/+layout.svelte: the address says which page is current. -->
<Tabs
	aria-label="Learn"
	items={SECTIONS}
	value={SECTIONS.find((section) => page.url.pathname.startsWith(section.href))?.value}
/>
