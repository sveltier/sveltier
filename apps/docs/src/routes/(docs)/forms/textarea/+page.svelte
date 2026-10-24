<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TextareaDemo from '#lib/docs/textarea/TextareaDemo.svelte';
	import { textareaUsage } from '#lib/snippets/forms.js';
	import TEXTAREA_PROPS from 'virtual:sveltier-api/TextareaProps';
</script>

<DocPage
	title="Textarea"
	lede="Several lines of text, in the same field as a TextField: label, hint, validation, and the option to grow with its text."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code> and give it a <code>label</code>. <code>rows</code> sets how many
		lines show. The user can drag it taller; with <code>autoGrow</code> it grows with its text
		instead, from <code>rows</code> up to <code>maxRows</code>, and then scrolls.
	</p>
	<TextareaDemo />
	<Code title="PaymentNote.svelte" code={textareaUsage} />

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code>, <code>minlength</code>, <code>maxlength</code>, <code>rules</code>,
		<code>error</code> and <code>validateOn</code> work as they do on a
		<a href={resolve('forms/text-field')}>TextField</a>, and inside a
		<a href={resolve('forms/form')}>Form</a>.
	</p>

	<h2 id="layout">Next to other fields</h2>
	<p>
		The first line sits where a TextField puts its text, so a one-row Textarea is exactly as tall as
		a TextField of the same size and density, and the two line up in a row. Lines are spaced for
		reading.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The label, the hint and the error are linked to the <code>&lt;textarea&gt;</code> as on every field.
		</li>
		<li>
			Growing uses <code>field-sizing: content</code> where the browser has it, and measures the text
			where it does not, so no line is ever hidden under the edge.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Textarea props" rows={TEXTAREA_PROPS} />
</DocPage>
