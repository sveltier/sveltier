<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { DISPLAY_INSTANCE } from '#lib/docs/api.js';
	import { useDisplaySignature } from '#lib/snippets/core.js';
</script>

<DocPage title="useDisplay" lede="Returns reactive breakpoint flags for the current viewport.">
	<h2 id="signature">Signature</h2>
	<Code title="Signature" lang="ts" code={useDisplaySignature} />
	<p>
		Call it during component initialisation. Every component gets the same instance, built on one
		<code>MediaQuery</code> per threshold; nothing listens to resize events.
	</p>

	<h2 id="returns">Returns</h2>
	<ApiTable label="DisplayInstance" rows={DISPLAY_INSTANCE} />
	<p>
		See <a href={resolve('core/display')}>Display</a> for the breakpoints and how server rendering works.
	</p>
</DocPage>
