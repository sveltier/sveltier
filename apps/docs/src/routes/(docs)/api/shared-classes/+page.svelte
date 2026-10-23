<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { SHARED_CLASSES, SHARED_TYPES } from '#lib/docs/api.js';
	import { sharedClassesSignature } from '#lib/snippets/core.js';
</script>

<DocPage
	title="sharedClasses"
	lede="Turns a component's shared props into classes that set the shared custom properties."
>
	<h2 id="signature">Signature</h2>
	<Code title="Signature" lang="ts" code={sharedClassesSignature} />
	<p>
		It returns classes only for the props you pass, in a fixed order, and imports the stylesheet
		that defines them. Use it in <code>$derived</code> or directly in the <code>class</code> attribute.
	</p>

	<h2 id="props">Props and classes</h2>
	<ApiTable label="sharedClasses props" rows={SHARED_CLASSES} />

	<h2 id="types">Types</h2>
	<ApiTable label="Shared props types" rows={SHARED_TYPES} />
	<p>
		See <a href={resolve('core/shared-props')}>Shared props</a> for the meaning of each value and a live
		preview.
	</p>
</DocPage>
