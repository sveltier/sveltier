<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TicketDemo from '#lib/docs/ticket/TicketDemo.svelte';
	import { priceInputUsage } from '#lib/snippets/finance.js';
	import PRICE_INPUT_PROPS from 'virtual:sveltier-api/PriceInputProps';
</script>

<DocPage
	title="PriceInput"
	lede="A price, stepped by its tick: a fixed tick, or ticks that change with the price, as many stock markets set them."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the <code>tick</code> and bind the <code>value</code>. The arrow keys and the buttons move
		by the tick at the price, Page Up and Page Down by ten ticks, and a typed price off the ticks is
		an error. The price shows as many decimals as the finest tick, so a column of prices lines up,
		and <code>min</code> defaults to the smallest tick, so a price is never zero.
	</p>
	<TicketDemo />
	<Code title="Ticket.svelte" code={priceInputUsage} />

	<h2 id="bands">Ticks that change with the price</h2>
	<p>
		Give the ticks as bands, each from the price where it starts. Each price must be a multiple of
		its band's tick: in the demo, 10,020 is an error and 10,050 is not. Stepping up moves onto the
		start of the next band, and stepping down from it uses the tick of the band below, so 50,000
		goes down to 49,950.
	</p>

	<h2 id="field">A NumberField</h2>
	<p>
		Everything else is a <a href={resolve('forms/number-field')}>NumberField</a>: the same props,
		defaults, validation and keys, typed in the reader's own format and submitted as a plain number.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a <code>spinbutton</code> with its value, minimum and maximum, named by its label. The arrow,
			Page, Home and End keys work as in any number field.
		</li>
		<li>
			A price off the ticks shows its message under the field, linked to it as its description.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="PriceInput props" rows={PRICE_INPUT_PROPS} />
</DocPage>
