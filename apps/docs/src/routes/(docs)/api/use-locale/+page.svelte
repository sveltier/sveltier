<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { LOCALE_INSTANCE } from '#lib/docs/api.js';
	import { useLocaleSignature } from '#lib/snippets/core.js';
</script>

<DocPage title="useLocale" lede="Returns messages and cached Intl formatters for the app's locale.">
	<h2 id="signature">Signature</h2>
	<Code title="Signature" lang="ts" code={useLocaleSignature} />
	<p>
		Call it during component initialisation. The functions read the current settings on every call,
		so they stay correct when the settings change, and they keep working when destructured.
	</p>

	<h2 id="returns">Returns</h2>
	<ApiTable label="LocaleInstance" rows={LOCALE_INSTANCE} />
	<p>See <a href={resolve('core/locale')}>Locale</a> for examples and server rendering.</p>
</DocPage>
