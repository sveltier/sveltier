<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { USE_DEFAULTS } from '#lib/docs/api.js';
	import { defaultsComponent, useDefaultsSignature } from '#lib/snippets/core.js';
</script>

<DocPage
	title="useDefaults"
	lede="Resolves a component's defaultable props against the nearest DefaultsProvider."
>
	<h2 id="signature">Signature</h2>
	<Code title="Signature" lang="ts" code={useDefaultsSignature} />
	<p>
		Call it during component initialisation; it reads the provider context once. The resolver it
		returns is pure, so call it inside <code>$derived</code> to track both the props and the provider's
		defaults.
	</p>

	<h2 id="parameters">Parameters and result</h2>
	<ApiTable label="useDefaults" rows={USE_DEFAULTS} />

	<h2 id="example">Example</h2>
	<Code title="PriceTag.svelte" code={defaultsComponent} />
	<p>
		Pass the type registered in <code>ComponentDefaults</code> as <code>T</code> to keep literal
		types such as <code>Size</code>. See <a href={resolve('core/defaults')}>Defaults</a>.
	</p>
</DocPage>
