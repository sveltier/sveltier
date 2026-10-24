<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TextFieldAffixes from '#lib/docs/text-field/TextFieldAffixes.svelte';
	import TextFieldDemo from '#lib/docs/text-field/TextFieldDemo.svelte';
	import TextFieldSizes from '#lib/docs/text-field/TextFieldSizes.svelte';
	import TextFieldValidation from '#lib/docs/text-field/TextFieldValidation.svelte';
	import TextFieldVariants from '#lib/docs/text-field/TextFieldVariants.svelte';
	import { textFieldAffixes, textFieldUsage, textFieldValidation } from '#lib/snippets/forms.js';
	import TEXT_FIELD_PROPS from 'virtual:sveltier-api/TextFieldProps';
</script>

<DocPage
	title="TextField"
	lede="A single line of text with a label, a hint and validation that waits until the user is done, then clears as soon as the value is fixed."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code> and give it a <code>label</code>. The input receives every other
		attribute you pass, such as <code>name</code>, <code>autocomplete</code>,
		<code>placeholder</code> and events, while <code>class</code> and <code>style</code> apply to the
		whole field.
	</p>
	<TextFieldDemo />
	<Code title="SignUp.svelte" code={textFieldUsage} />

	<h2 id="validation">Validation</h2>
	<p>A field's message comes from three places, checked in this order:</p>
	<ol>
		<li>
			<strong>The HTML constraints</strong> you already know: <code>required</code>,
			<code>minlength</code>, <code>maxlength</code>, <code>pattern</code>, and
			<code>type="email"</code> or <code>"url"</code>. Their messages come from the
			<a href={resolve('core/locale')}>locale</a>, so they read the same in every browser and
			translate with your app.
		</li>
		<li>
			<strong><code>rules</code></strong>: functions that return <code>true</code> or the message to show.
			They run in order and stop at the first message. Like the constraints, they skip an empty field
			that is not required.
		</li>
		<li>
			<strong><code>error</code></strong>: a message from outside the field, usually the answer of
			your server. It shows at once, and it never stops the form from being submitted again.
		</li>
	</ol>
	<p>
		A message appears when the user leaves a field they have changed, not while they tab through the
		form. Once it is shown, it follows every keystroke, so fixing the value clears it at once. Set <code
			>validateOn</code
		>
		to <code>"input"</code> to check from the first change, or to
		<code>"submit"</code> to wait for the form. Inside a plain <code>&lt;form&gt;</code>, the
		browser also refuses to submit an invalid field, with the same words.
	</p>
	<TextFieldValidation />
	<Code title="+page.svelte" code={textFieldValidation} />

	<h2 id="variants">Variants</h2>
	<p>
		Fields take five of the shared variants: <code>outlined</code> (the default) draws a border,
		<code>tonal</code> a wash with a rule under it, <code>elevated</code> a raised surface for a
		field over an image, <code>text</code> only the rule, and <code>plain</code> nothing, for a
		field inside another component. <code>color</code> is the accent of the focused field; an invalid
		field turns to the error colour.
	</p>
	<TextFieldVariants />

	<h2 id="size">Size and density</h2>
	<p>
		A field is as tall as a Button of the same <code>size</code> and <code>density</code>, so they
		line up in a row. The label keeps the theme's label style at every size.
	</p>
	<TextFieldSizes />

	<h2 id="icons">Icons and actions</h2>
	<p>
		<code>prepend</code> and <code>append</code> put content inside the box: an icon, a prefix, or a button.
		A press anywhere else in the box focuses the input.
	</p>
	<TextFieldAffixes />
	<Code title="Toolbar.svelte" code={textFieldAffixes} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The label is a <code>&lt;label&gt;</code> for the input. Without a visible label, name the
			input with <code>aria-label</code>.
		</li>
		<li>
			The hint, or the error in its place, describes the input, and an invalid field is marked
			<code>aria-invalid</code>. An <code>aria-describedby</code> of your own is kept alongside.
		</li>
		<li>An error that appears after the user has moved on is announced politely.</li>
		<li>
			<code>required</code> adds an asterisk that screen readers skip: the input already says it is required.
		</li>
		<li>
			Text is at least 16 px on touch screens, where smaller text makes iOS zoom into the page.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="TextField props" rows={TEXT_FIELD_PROPS} />
</DocPage>
