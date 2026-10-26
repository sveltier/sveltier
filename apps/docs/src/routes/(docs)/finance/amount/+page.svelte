<script lang="ts">
	import AmountDemo from '#lib/docs/amount/AmountDemo.svelte';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { amountFormats, amountPrivacy, amountUsage } from '#lib/snippets/finance.js';
	import AMOUNT_PROPS from 'virtual:sveltier-api/AmountProps';
</script>

<DocPage
	title="Amount"
	lede="A figure for people to read: a number, a price, money or a percentage, in the locale, with tabular figures and a true minus sign."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the <code>value</code>. <code>decimals</code> fixes the fraction digits, as a price shows
		them; <code>format</code> takes the options of <code>Intl.NumberFormat</code> for anything else.
		A missing value (<code>null</code> or <code>undefined</code>) shows a dash. Turn on
		<q>Live</q> to watch the price flash as it moves.
	</p>
	<AmountDemo />
	<Code title="Quote.svelte" code={amountUsage} />

	<h2 id="formats">Formats</h2>
	<p>
		Numbers group their digits and use the locale's separators. The defaults keep the data where
		Intl's would round it away: without <code>decimals</code> or fraction digits in
		<code>format</code>, a number keeps up to 8 decimals and a percentage 2; money keeps its
		currency's digits. Money with no <code>currency</code> is in the locale's currency.
	</p>
	<p>
		<code>style: 'percent'</code> multiplies by 100, so a ratio of 0.0125 reads 1.25%. For a value
		that is already a percentage, use <code>style: 'unit', unit: 'percent'</code>.
	</p>
	<Code title="Formats.svelte" code={amountFormats} />

	<h2 id="flash">Live figures</h2>
	<p>
		With <code>flash</code>, a rise or a fall washes the figure in the theme's up or down colour,
		which fades out. The first render does not flash, and with reduced motion nothing does: the
		theme's durations are then near zero. Pair a flashing figure with its change, so the direction
		is not left to colour alone.
	</p>

	<h2 id="privacy">Hiding amounts</h2>
	<p>
		<code>masked</code> shows <q>••••</q> in place of the figure, for a screen others can see. Set
		it through <code>DefaultsProvider</code> and one switch hides every Amount in the section, and every
		Delta, whose colour and arrow would give the direction away.
	</p>
	<Code title="Balance.svelte" code={amountPrivacy} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The figure is text, read as written: <q>−639</q> with a true minus sign is read as
			<q>minus 639</q>.
		</li>
		<li>
			A masked figure is hidden from screen readers too, which hear <q>Amount hidden</q>, from the
			locale's <code>amountHidden</code> message.
		</li>
		<li>The flash is hidden from assistive technology and changes nothing but a background.</li>
		<li>
			Figures that update on their own need a way to pause them on the page, as the demo's
			<q>Live</q> switch is.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Amount props" rows={AMOUNT_PROPS} />
</DocPage>
