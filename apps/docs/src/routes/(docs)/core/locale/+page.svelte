<script lang="ts">
	import { resolve } from '$app/paths';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { localeExample } from '#lib/snippets/core.js';
	import { useLocale } from 'sveltier';

	const locale = useLocale();
	// Fixed instants, so the server and the browser render the same text.
	const NOW = Date.UTC(2026, 9, 23, 12);
	const examples = $derived([
		{ call: 'formatCurrency(1250.5)', result: locale.formatCurrency(1250.5) },
		{ call: "formatCurrency(1250.5, 'EUR')", result: locale.formatCurrency(1250.5, 'EUR') },
		{ call: "formatCurrency(1250, 'JPY')", result: locale.formatCurrency(1250, 'JPY') },
		{
			call: 'formatPercent(0.0184, { minimumFractionDigits: 2 })',
			result: locale.formatPercent(0.0184, { minimumFractionDigits: 2 })
		},
		{
			call: "formatNumber(2.5, { signDisplay: 'exceptZero' })",
			result: locale.formatNumber(2.5, { signDisplay: 'exceptZero' })
		},
		{
			call: "formatNumber(12_400_000, { notation: 'compact' })",
			result: locale.formatNumber(12_400_000, { notation: 'compact' })
		},
		{
			call: "formatDate(date, { dateStyle: 'medium', timeZone: 'UTC' })",
			result: locale.formatDate(NOW, { dateStyle: 'medium', timeZone: 'UTC' })
		},
		{ call: 'formatRelative(fiveMinutesAgo)', result: locale.formatRelative(NOW - 300_000, NOW) },
		{ call: "t('close')", result: locale.t('close') }
	]);
</script>

<DocPage
	title="Locale"
	lede="Messages and number, money, date and relative-time formatting in one place, on the browser's own Intl."
>
	<h2 id="formatting">Formatting</h2>
	<p>
		<code>useLocale()</code> returns formatters for the app's locale. They take the native Intl options,
		so signs, compact notation and date styles need no extra API. Fraction digits follow the currency.
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Formatting examples" tabindex="0">
		<table class="docs-api">
			<thead>
				<tr>
					<th scope="col">Call</th>
					<th scope="col" class="docs-num">Result</th>
				</tr>
			</thead>
			<tbody>
				{#each examples as example (example.call)}
					<tr>
						<td><code>{example.call}</code></td>
						<td class="docs-num">{example.result}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<Code title="BalanceCard.svelte" code={localeExample} />

	<h2 id="settings">Settings</h2>
	<p>
		The locale (default <code>en-US</code>), currency (<code>USD</code>), time zone (the runtime's)
		and messages are app-wide settings of the root provider. They can change at runtime, for example
		when a user picks another currency, and every formatted value updates. A section that shows
		another currency or zone passes it per call.
	</p>

	<h2 id="messages">Messages</h2>
	<p>
		Components announce themselves with built-in English messages such as <code>close</code> and
		<code>loading</code>. <code>t(key, values)</code> returns one, with
		<code>&lbrace;name&rbrace;</code>
		placeholders filled. To translate, pass your own messages; any you leave out stay in English.
	</p>

	<h2 id="performance">Performance</h2>
	<p>
		Building an Intl formatter is the slow part, so each one is built once per locale and options
		and then reused. Formatting thousands of cells per second, as a price board does, costs only the
		format calls.
	</p>

	<h2 id="server">Server rendering</h2>
	<p>
		Numbers and money render the same on the server and in the browser. Dates without a time zone do
		not: the server formats them in its own zone, the browser in the user's. Set a time zone, or
		format such dates only in the browser.
	</p>
	<p>See <a href={resolve('api/use-locale')}>useLocale</a> for every function.</p>
</DocPage>
