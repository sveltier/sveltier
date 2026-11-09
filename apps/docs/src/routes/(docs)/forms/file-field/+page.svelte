<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import FileFieldDemo from '#lib/docs/file-field/FileFieldDemo.svelte';
	import { fileFieldDrop, fileFieldUsage } from '#lib/snippets/forms.js';
	import FILE_FIELD_PROPS from 'virtual:sveltier-api/FileFieldProps';
</script>

<DocPage
	title="FileField"
	lede="A file to choose, in the same field as a TextField: the platform's own file input, with a label, a hint, validation and the chosen names in the box."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give it a <code>label</code> and a <code>name</code>. A press anywhere in the box opens the
		chooser, and the box shows the chosen file's name, or how many files there are.
		<code>onchange</code> receives the files as an array when the user chooses, drops or clears
		them;
		<code>bind:files</code> keeps them. <code>accept</code> limits the chooser to the kinds of file
		you take. Read a file with <code>file.text()</code> or send it in a form: the field submits it
		under its
		<code>name</code>.
	</p>
	<FileFieldDemo />
	<Code title="RestoreBackup.svelte" code={fileFieldUsage} />

	<h2 id="drop">Dropping files</h2>
	<p>
		<code>drop</code> makes the box a place to drop files: taller, dashed, and washed in the field's
		colour while a file is dragged over it. With <code>multiple</code>, the user can choose or drop
		several at once.
	</p>
	<Code title="Statements.svelte" code={fileFieldDrop} />

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> asks for a file. The chooser filters by <code>accept</code>, but a dropped
		file is not filtered, so a file of another kind is an error. Its message names the extensions in
		<code>accept</code>
		("Choose a file of type .json"), or its media types when it names none; the locale's
		<code>fileType</code>
		message changes the words. <code>rules</code> receive the files (their number, size or names),
		and <code>error</code> and <code>validateOn</code> work as they do on a
		<a href={resolve('forms/text-field')}>TextField</a>
		and inside a
		<a href={resolve('forms/form')}>Form</a>.
	</p>

	<h2 id="code">Files from code</h2>
	<p>
		Setting <code>files</code> puts them in the input, so a form submits what the field shows;
		<code>[]</code> clears it. <code>onchange</code> is not called then. Once files are chosen, a clear
		button at the end of the box empties it and gives focus back to the input.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The control is the platform's <code>&lt;input type="file"&gt;</code>, over the whole box and
			out of sight: the keyboard opens it with Space or Enter, and screen readers say its label and
			the chosen file in their own words. The words drawn in the box are hidden from them.
		</li>
		<li>The label, the hint and the error are linked to the input as on every field.</li>
		<li>
			The clear button is named <q>Clear the file</q> (the locale's <code>clearFile</code>, or
			<code>clearFiles</code> for several).
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="FileField props" rows={FILE_FIELD_PROPS} />
</DocPage>
