<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import CheckboxDemo from '#lib/docs/checkbox/CheckboxDemo.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { checkboxSelectAll, checkboxUsage } from '#lib/snippets/forms.js';
	import CHECKBOX_PROPS from 'virtual:sveltier-api/CheckboxProps';
</script>

<DocPage
	title="Checkbox"
	lede="A box that is checked or not, with its label beside it: the platform's own checkbox, drawn in the theme, so the keyboard, forms and autofill work as they always do."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind <code>checked</code>. The label is the press target, so a press anywhere on it toggles the
		box. While checked, the form submits <code>value</code> (<code>on</code> unless you set it)
		under
		<code>name</code>. When the label holds a link, give it as a snippet.
	</p>
	<CheckboxDemo />
	<Code title="Preferences.svelte" code={checkboxUsage} />

	<h2 id="indeterminate">Select all</h2>
	<p>
		<code>indeterminate</code> draws a dash for a state that is neither checked nor unchecked, such as
		a box over a list where only some items are chosen. Screen readers announce it as mixed. A press clears
		it and checks the box, as the platform does.
	</p>
	<Code title="Documents.svelte" code={checkboxSelectAll} />

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> means the box must be checked, as for accepting terms.
		<code>rules</code> receive the checked state, and <code>error</code> and
		<code>validateOn</code> work as on a <a href={resolve('forms/text-field')}>TextField</a>, with
		one difference: a toggle is a whole edit, so with the default <code>'blur'</code> the message shows
		as soon as the user unchecks a required box. A form reset goes back to the state the box started in.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is an <code>&lt;input type="checkbox"&gt;</code> inside its <code>&lt;label&gt;</code>:
			<kbd>Space</kbd> toggles it, and the hint or error is linked with
			<code>aria-describedby</code>.
		</li>
		<li>
			The label row is at least 24px tall at every size, and the box is never so round that it
			passes for a radio button.
		</li>
		<li>
			Without <code>label</code>, name the box with <code>aria-label</code>. Development builds warn
			about a checkbox without a name.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Checkbox props" rows={CHECKBOX_PROPS} />
</DocPage>
