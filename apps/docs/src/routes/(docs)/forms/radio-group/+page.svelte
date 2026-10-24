<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import RadioGroupDemo from '#lib/docs/radio-group/RadioGroupDemo.svelte';
	import { radioGroupUsage } from '#lib/snippets/forms.js';
	import RADIO_GROUP_PROPS from 'virtual:sveltier-api/RadioGroupProps';
</script>

<DocPage
	title="RadioGroup"
	lede="One choice among a few options, all on show: the platform's own radios in a fieldset, so the arrow keys, forms and screen readers work as they always do."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the choices as <code>options</code> and bind the <code>value</code>, which keeps the type
		of the option values, so numbers stay numbers. It is <code>null</code> until the user picks one.
		<code>label</code> is the question, as the group's legend; each option can carry a
		<code>hint</code>, read out with its radio. <code>inline</code> lays short options side by side.
	</p>
	<RadioGroupDemo />
	<Code title="Payout.svelte" code={radioGroupUsage} />

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> asks for a choice. <code>rules</code> receive the chosen value, and
		<code>error</code> and <code>validateOn</code> work as on a
		<a href={resolve('forms/text-field')}>TextField</a>; a choice is a whole edit, so a message
		updates as soon as the user picks. A form reset goes back to the option the group started with.
	</p>

	<h2 id="when">When to use it</h2>
	<p>
		For two to five options that are worth reading side by side. For a long list, a
		<a href={resolve('forms/native-select')}>NativeSelect</a> takes less room. For a view or a
		filter that changes at once, a
		<a href={resolve('components/segmented-control')}>SegmentedControl</a> fits better.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a <code>&lt;fieldset role="radiogroup"&gt;</code> named by its legend, holding native
			radios that share a <code>name</code> (generated when you give none). <kbd>Tab</kbd> enters the
			group at the chosen radio, and the arrow keys move the choice.
		</li>
		<li>
			The group's hint or error is linked to the group, and announced with it; an invalid or
			required group says so.
		</li>
		<li>Radios stay round in every theme, so they never pass for checkboxes.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="RadioGroup props" rows={RADIO_GROUP_PROPS} />
</DocPage>
