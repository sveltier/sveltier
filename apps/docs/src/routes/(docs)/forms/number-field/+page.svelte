<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import NumberFieldDemo from '#lib/docs/number-field/NumberFieldDemo.svelte';
	import { numberFieldUsage } from '#lib/snippets/forms.js';
	import NUMBER_FIELD_PROPS from 'virtual:sveltier-api/NumberFieldProps';
</script>

<DocPage
	title="NumberField"
	lede="A number typed in the reader's own format, stepped with the keyboard or two buttons, and bound and submitted as a plain number."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>: a number, or <code>null</code> when the field is empty. The user
		types the number as their locale writes it, such as <code>1,234.5</code> or
		<code>1.234,5</code>; when they leave the field it is written with the locale's grouping and the
		digits of <code>format</code>.
	</p>
	<NumberFieldDemo />
	<Code title="Order.svelte" code={numberFieldUsage} />

	<h2 id="steps">Range and steps</h2>
	<p>
		<code>min</code> and <code>max</code> stop the keys and the buttons. A typed value outside them
		is not changed for the user: the field says what to enter instead. With <code>step</code>, the
		keys and buttons move along the steps counted from <code>min</code>, and a typed value between
		two steps is an error; without it they move by 1 and any number is accepted.
	</p>
	<p>
		A step can change with the value, as a market's tick size changes with the price: give
		<code>step</code> bands such as
		<code>[&#123; from: 0, step: 10 &#125;, &#123; from: 10000, step: 50 &#125;]</code>. Each value
		must then be a multiple of its band's step, and the keys move onto the start of the next band.
		For prices, <a href={resolve('finance/price-input')}>PriceInput</a> takes the bands as its
		<code>tick</code>.
	</p>

	<h2 id="format">Format and currency</h2>
	<p>
		<code>format</code> takes <code>Intl.NumberFormat</code> options for the digits only: grouping
		and fraction digits. A currency or percent sign in the text would make it unreadable as a number
		once the user edits it, so put the currency or unit in <code>prepend</code> or
		<code>append</code>; in development, a currency or percent style warns.
	</p>

	<h2 id="forms">In a form</h2>
	<p>
		With <code>name</code>, a hidden input submits the plain number, such as <code>1234.5</code>,
		while the field shows <code>1,234.50</code>. Validation works as on a
		<a href={resolve('forms/text-field')}>TextField</a>: <code>required</code>, <code>rules</code>
		(they receive the number), <code>error</code> and <code>validateOn</code>.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The input is a <code>spinbutton</code> with its value, range and the formatted text as
			<code>aria-valuetext</code>.
		</li>
		<li>
			<kbd>↑</kbd> and <kbd>↓</kbd> move one step, <kbd>Page Up</kbd> and <kbd>Page Down</kbd> ten,
			<kbd>Home</kbd> and <kbd>End</kbd> go to <code>min</code> and <code>max</code>.
		</li>
		<li>
			The decrease and increase buttons are named, stay out of the tab order (the keys do the same),
			keep focus in the field, and are at least 24 px square.
		</li>
		<li>
			Phones show a number keypad: a numeric one for whole numbers of zero or more, a decimal one
			otherwise.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="NumberField props" rows={NUMBER_FIELD_PROPS} />
</DocPage>
