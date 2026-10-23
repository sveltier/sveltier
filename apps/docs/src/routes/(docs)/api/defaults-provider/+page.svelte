<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { DEFAULTS_PROVIDER_PROPS, DEFAULTS_TYPES } from '#lib/docs/api.js';
	import { defaultsNested } from '#lib/snippets/core.js';
</script>

<DocPage
	title="DefaultsProvider"
	lede="Gives every component below it default prop values. Renders no element of its own."
>
	<h2 id="props">Props</h2>
	<ApiTable label="DefaultsProvider props" rows={DEFAULTS_PROVIDER_PROPS} />

	<h2 id="types">Types</h2>
	<ApiTable label="Defaults types" rows={DEFAULTS_TYPES} />

	<h2 id="example">Example</h2>
	<Code title="Nested providers" code={defaultsNested} />
	<p>
		See <a href={resolve('core/defaults')}>Defaults</a> for how values resolve and how to register your
		own components.
	</p>
</DocPage>
