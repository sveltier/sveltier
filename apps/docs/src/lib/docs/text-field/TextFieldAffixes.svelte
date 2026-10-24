<script lang="ts">
	// An icon before a search, and a fixed prefix before a web address.
	import { TextField } from 'sveltier';
	import Glyph from '../button/Glyph.svelte';
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<TextField label="Search" type="search" placeholder="Payees, notes, amounts">
			{#snippet prepend()}<Glyph name="search" />{/snippet}
		</TextField>
		<TextField label="Website" placeholder="example.com">
			{#snippet prepend()}<span>https://</span>{/snippet}
		</TextField>
	</div>
</div>
