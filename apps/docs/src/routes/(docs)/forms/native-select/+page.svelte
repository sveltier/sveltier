<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import NativeSelectDemo from '#lib/docs/native-select/NativeSelectDemo.svelte';
	import { nativeSelectUsage } from '#lib/snippets/forms.js';
	import NATIVE_SELECT_PROPS from 'virtual:sveltier-api/NativeSelectProps';
</script>

<DocPage
	title="NativeSelect"
	lede="One choice from a list, as the platform's own select in a field: the phone's picker, the browser's keyboard behaviour and form submission come for free."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the choices as <code>options</code> and bind the <code>value</code>, which keeps the type
		of the option values, so numbers stay numbers. With <code>placeholder</code>, the select starts
		on a first option that stands for no choice, and the value is <code>null</code> until the user picks
		one.
	</p>
	<NativeSelectDemo />
	<Code title="Account.svelte" code={nativeSelectUsage} />
	<p>
		For groups, descriptions or options drawn your own way, in the theme's look in every browser,
		use a <a href={resolve('forms/select')}>Select</a>.
	</p>

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> makes a choice necessary: once the user has picked something, the
		placeholder cannot be chosen again. <code>rules</code>, <code>error</code> and
		<code>validateOn</code>
		work as on a
		<a href={resolve('forms/text-field')}>TextField</a>, and a form reset goes back to the option
		the select started with.
	</p>

	<h2 id="when">When to use it</h2>
	<p>
		For a short, fixed list whose labels are plain text, the native select is the lightest and most
		familiar control, and on phones it opens the system picker. For search, custom rows or many
		choices, a select of its own is coming with the next components. For a few options side by side,
		a
		<a href={resolve('components/segmented-control')}>SegmentedControl</a> shows them all at once.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a <code>&lt;select&gt;</code>: the label, hint and error are linked as on every field,
			and the keyboard works as the platform defines it.
		</li>
		<li>The arrow is drawn over the end of the box and lets presses through to the select.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="NativeSelect props" rows={NATIVE_SELECT_PROPS} />
</DocPage>
