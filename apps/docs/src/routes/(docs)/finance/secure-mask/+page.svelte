<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SecureMaskDemo from '#lib/docs/secure-mask/SecureMaskDemo.svelte';
	import { secureMaskFetch, secureMaskUsage } from '#lib/snippets/finance.js';
	import SECURE_MASK_PROPS from 'virtual:sveltier-api/SecureMaskProps';
</script>

<DocPage
	title="SecureMask"
	lede="A secret shown in part, such as an account or card number: dots and its last characters, revealed on request."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the secret as <code>value</code> and say what it is with <code>label</code>. It shows four
		dots and its last <code>visible</code> characters, four by default; the dots are always four, so
		they do not give the length away. <code>toggle</code> adds a button that shows the whole value,
		and <code>hideAfter</code> hides it again after that many milliseconds.
	</p>
	<SecureMaskDemo />
	<Code title="Payout.svelte" code={secureMaskUsage} />

	<h2 id="security">What reaches the page</h2>
	<p>
		While masked, only the last characters are written to the page: copying it, the page's source or
		a tool reading the page gets no more than the eye sees. So the page need not hold the secret at
		all. Pass the last characters, bind <code>revealed</code>, and fetch the whole value when the
		user asks for it.
	</p>
	<Code title="CardNumber.svelte" code={secureMaskFetch} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a group named by <code>label</code>. The dots are hidden from assistive technology,
			which hears <q>ending in 3000</q>, or <q>Hidden</q> when no character is visible.
		</li>
		<li>
			The button is a toggle named <q>Show</q>: <code>aria-pressed</code> says whether the value is showing.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="SecureMask props" rows={SECURE_MASK_PROPS} />
</DocPage>
