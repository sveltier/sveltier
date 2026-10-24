<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DialogDemo from '#lib/docs/dialog/DialogDemo.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { dialogControlled, dialogUsage } from '#lib/snippets/overlays.js';
	import DIALOG_PROPS from 'virtual:sveltier-api/DialogProps';
</script>

<DocPage
	title="Dialog"
	lede="A modal dialog on the platform's own <dialog>: in the top layer, with the rest of the page inert and still, focus moved in and given back."
>
	<h2 id="usage">Usage</h2>
	<p>
		The control that opens the dialog is a <code>trigger</code> snippet: spread the attributes it
		receives onto your Button, and the dialog wires the rest, from <code>aria-haspopup</code> to
		giving focus back when it closes. <code>title</code> is the heading and names the dialog;
		<code>actions</code> receives <code>close()</code> for its buttons.
	</p>
	<DialogDemo />
	<Code title="DeleteCard.svelte" code={dialogUsage} />

	<h2 id="open">Opening from code</h2>
	<p>
		Without a trigger, <code>bind:open</code> alone opens and closes the dialog. The dialog sets it
		to <code>false</code> when it closes itself, and <code>onclose</code> says why:
		<code>'escape'</code>, <code>'outside'</code> (a press on the backdrop) or <code>'action'</code>
		(its close button or <code>close()</code>).
	</p>
	<Code title="Rename.svelte" code={dialogControlled} />

	<h2 id="closing">Closing</h2>
	<ul>
		<li>
			Escape and a press on the backdrop close the dialog; <code>persistent</code> turns both off, for
			a question that needs an answer.
		</li>
		<li><code>closable</code> adds a close button to the heading.</li>
		<li>
			Dialogs stack with every other layer: Escape closes the one on top, and the one beneath takes
			over.
		</li>
	</ul>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a <code>&lt;dialog&gt;</code> opened with <code>showModal()</code>: the browser makes
			the rest of the page inert, and the dialog keeps <kbd>Tab</kbd> inside it.
		</li>
		<li>
			Focus moves to the element marked <code>autofocus</code>, else to the first one that takes
			focus, and returns to the trigger on close.
		</li>
		<li>
			<code>title</code> names the dialog. Without it, name the dialog with
			<code>aria-label</code>; development builds warn about a dialog without a name.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Dialog props" rows={DIALOG_PROPS} />
</DocPage>
