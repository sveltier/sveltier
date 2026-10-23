<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import CardDemo from '#lib/docs/card/CardDemo.svelte';
	import { cardUsage } from '#lib/snippets/components.js';
	import CARD_PROPS from 'virtual:sveltier-api/CardProps';
</script>

<DocPage
	title="Card"
	lede="A surface that groups content about one thing: a header with a title, the content, and actions."
>
	<h2 id="usage">Usage</h2>
	<p>
		A Card is a raised surface in the theme's colours. Its header holds a <code>title</code>, a
		<code>subtitle</code> and what you put in <code>prepend</code> and <code>append</code>; the
		content follows, and <code>actions</code> close it. Every variant works; a neutral outline uses the
		theme's border colour.
	</p>
	<CardDemo />
	<Code title="SavingsCard.svelte" code={cardUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Set <code>level</code> to make the title a heading of that level, so the card is in the page's outline.
			Pick the level that follows the heading above it.
		</li>
		<li>
			A card is not a control. Make what it leads to a link or a button inside it, so each action
			has its own name and the card's text stays readable.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Card props" rows={CARD_PROPS} />
</DocPage>
