<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import AccordionDemo from '#lib/docs/accordion/AccordionDemo.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { accordionMultiple, accordionUsage } from '#lib/snippets/components.js';
	import ACCORDION_ITEM from 'virtual:sveltier-api/AccordionItem';
	import ACCORDION_PROPS from 'virtual:sveltier-api/AccordionProps';
</script>

<DocPage
	title="Accordion"
	lede="Sections that open and close under their headers, such as answers to questions, built on the platform's own disclosure element."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the sections as <code>items</code>, render each one's content in the <code>panel</code>
		snippet, which receives the item, and bind the <code>value</code>: the open section, or
		<code>null</code> when all are closed. Opening a section closes the one that was open.
	</p>
	<AccordionDemo />
	<Code title="TransferQuestions.svelte" code={accordionUsage} />

	<h2 id="multiple">Several open at once</h2>
	<p>
		With <code>multiple</code>, any number of sections stay open and the <code>value</code> is the list
		of them. Prefer it when people compare sections, or when one may hold a form they are filling in.
	</p>
	<Code title="Notifications.svelte" code={accordionMultiple} />

	<h2 id="details">On the platform's details</h2>
	<ul>
		<li>
			Every section is a <code>&lt;details&gt;</code>, so the accordion works before scripts load,
			and finding text in the page opens the section it is in.
		</li>
		<li>
			The sections of one accordion share a <code>name</code>, which is how the browser keeps one
			open at a time; with <code>multiple</code> they have none.
		</li>
		<li>
			The content fades in as a section opens and out before it closes. Only opacity and position
			move: the height changes at once. Browsers without <code>::details-content</code> simply open the
			section.
		</li>
	</ul>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Each header is the section's <code>&lt;summary&gt;</code>: a button that says whether the
			section is expanded. <kbd>Tab</kbd> moves between headers, and <kbd>Enter</kbd> or
			<kbd>Space</kbd> opens and closes.
		</li>
		<li>
			A <code>disabled</code> section keeps its state: its header still takes focus and is announced as
			unavailable, so people learn it exists.
		</li>
		<li>
			Keep titles short and the content inside the panel; for a choice between views of one page,
			use <a href={resolve('components/tabs')}>Tabs</a>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Accordion props" rows={ACCORDION_PROPS} />
	<ApiTable label="AccordionItem" rows={ACCORDION_ITEM} />
</DocPage>
