<script lang="ts">
	// Initials in the theme's colours, every size, an image with its fallback, and a status dot.
	import { Avatar, Badge, Icon, type Color, type Size } from '@sveltier/ui';

	const SIZES: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];
	const PEOPLE: Array<{ initials: string; color: Color }> = [
		{ initials: 'AM', color: 'neutral' },
		{ initials: 'JK', color: 'primary' },
		{ initials: 'RS', color: 'success' },
		{ initials: 'LT', color: 'info' }
	];
	const BUILDING = 'M4 21V9l8-6 8 6v12h-6v-6h-4v6zm2-2h2v-6h8v6h2V10l-6-4.5L6 10z';
	// An abstract picture drawn for these docs, standing in for a photo.
	const PICTURE = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#8a9aa9"/><circle cx="20" cy="16" r="7" fill="#e4e8ec"/><path d="M6 40c2-9 8-13 14-13s12 4 14 13z" fill="#e4e8ec"/></svg>'
	)}`;
</script>

<div class="docs-demo">
	<div class="docs-actions docs-actions--baseline">
		{#each SIZES as size (size)}<Avatar {size}>AM</Avatar>{/each}
	</div>
	<div class="docs-actions docs-actions--baseline">
		{#each PEOPLE as person (person.initials)}
			<Avatar color={person.color}>{person.initials}</Avatar>
		{/each}
		<Avatar color="primary" variant="flat"><Icon path={BUILDING} /></Avatar>
	</div>
	<div class="docs-actions docs-actions--baseline">
		<Avatar src={PICTURE} alt="Alex Morgan">AM</Avatar>
		<!-- Image data that cannot be decoded: it fails without a request. -->
		<Avatar src="data:image/png;base64,AAAA" alt="Jamie Kerr">JK</Avatar>
		<Badge dot label="Online" color="success">
			<Avatar src={PICTURE} alt="Riley Shaw">RS</Avatar>
		</Badge>
	</div>
</div>
