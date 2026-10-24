<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import FormDemo from '#lib/docs/form/FormDemo.svelte';
	import { formMethods, formSvelteKit, formUsage } from '#lib/snippets/forms.js';
	import FORM_PROPS from 'virtual:sveltier-api/FormProps';
</script>

<DocPage
	title="Form and validation"
	lede="A form that checks every field when it is submitted, focuses the first problem, and otherwise submits as HTML does, so it works with SvelteKit form actions."
>
	<h2 id="usage">Usage</h2>
	<p>
		Put fields and a submit Button in a <code>Form</code>. On submit it shows the message of every
		field. If one is invalid, the form does not submit and the first invalid field takes focus; if
		all are valid, it calls <code>onsubmit</code>. Without <code>onsubmit</code>, the form submits
		as HTML does.
	</p>
	<FormDemo />
	<Code title="SignUp.svelte" code={formUsage} />

	<h2 id="timing">When messages show</h2>
	<p>
		Each field always knows its own message; <code>validateOn</code> only decides when it shows:
	</p>
	<ul>
		<li>
			<code>"blur"</code> (default): when the user leaves a field they have changed. Tabbing through the
			form shows nothing.
		</li>
		<li><code>"input"</code>: from the first change.</li>
		<li><code>"submit"</code>: when the form is submitted.</li>
	</ul>
	<p>
		Once a message is shown, it follows every change, so fixing the value clears it at once. Set
		<code>validateOn</code> on the Form for all its fields, or on one field. What a field checks is
		described under <a href={resolve('forms/text-field')}>TextField validation</a>.
	</p>

	<h2 id="sveltekit">With SvelteKit form actions</h2>
	<p>
		Give the form <code>method="POST"</code> and pass the action's errors to the fields'
		<code>error</code>. To submit without a page reload, attach SvelteKit's <code>enhance</code>
		with <code>fromAction</code>; the Form runs first, so an invalid form is never sent. After a
		successful submission, enhance resets the form, which also hides the messages.
	</p>
	<Code title="+page.svelte" code={formSvelteKit} />

	<h2 id="methods">Methods</h2>
	<p>Through <code>bind:this</code>, a Form offers three methods:</p>
	<Code title="Methods" code={formMethods} />
	<p>
		<code>disabled</code> turns off every control inside, Buttons included, for a form the user
		cannot change. While a submission runs, prefer <code>loading</code> on the submit Button: it keeps
		focus and ignores a second press.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The form has <code>novalidate</code>, so the browser's own bubbles do not appear; the fields
			show the same messages in the page, linked to their controls.
		</li>
		<li>
			After a submission with errors, focus moves to the first invalid field in document order,
			which reads out its label and its message.
		</li>
		<li>A message that appears while the user is elsewhere is announced politely.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Form props" rows={FORM_PROPS} />
</DocPage>
