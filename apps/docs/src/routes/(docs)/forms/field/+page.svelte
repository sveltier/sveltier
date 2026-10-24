<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import FieldDemo from '#lib/docs/field/FieldDemo.svelte';
	import { fieldUsage } from '#lib/snippets/forms.js';
	import FIELD_CONTROL from 'virtual:sveltier-api/FieldControlAttributes';
	import FIELD_PROPS from 'virtual:sveltier-api/FieldProps';
</script>

<DocPage
	title="Field"
	lede="The label, box, hint and error of every boxed field, around a control of your own."
>
	<h2 id="usage">Usage</h2>
	<p>
		Field draws everything around a control: a <a href={resolve('forms/text-field')}>TextField</a>
		is a Field with an input in it. Wrap any other control the same way. The
		<code>children</code> snippet receives the id, the ARIA links and the state; spread them onto your
		control, and it takes the field's size, variant and focus accent.
	</p>
	<FieldDemo />
	<Code title="Schedule.svelte" code={fieldUsage} />

	<h2 id="control">What the control receives</h2>
	<ApiTable label="Field control attributes" rows={FIELD_CONTROL} />

	<h2 id="errors">Errors</h2>
	<p>
		Field shows the <code>error</code> you give it, and does not check a value itself. TextField and
		the other form controls do, as described under
		<a href={resolve('forms/text-field')}>TextField validation</a>.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The label points at the control's id, and the hint or error describes it, so the control needs
			only the attributes it receives.
		</li>
		<li>A press on the box around the control focuses it, except on a button inside the box.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Field props" rows={FIELD_PROPS} />
</DocPage>
