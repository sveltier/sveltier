<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import GuillocheDemo from '#lib/docs/guilloche/GuillocheDemo.svelte';
	import { guillocheUsage } from '#lib/snippets/finance.js';
	import GUILLOCHE_PROPS from 'virtual:sveltier-api/GuillocheProps';
</script>

<DocPage
	title="Guilloche"
	lede="The fine interlaced lines of a banknote or a cheque, as decoration behind a card, a receipt or a hero."
>
	<h2 id="usage">Usage</h2>
	<p>
		A Guilloche fills its box, so place and size it yourself: usually absolute behind the content of
		a surface that clips it. <code>pattern</code> is a <code>rosette</code>, one curve turned about
		the centre, or <code>waves</code>, bands that cross; <code>lines</code> sets how many.
	</p>
	<GuillocheDemo />
	<Code title="PremiumCard.svelte" code={guillocheUsage} />

	<h2 id="colour">Colour</h2>
	<p>
		The lines are hairlines in the <code>color</code>, <code>primary</code> by default, drawn faint
		so text over them keeps its contrast. Set <code>--sv-guilloche-opacity</code> (0.236 by default) to
		make them stronger or fainter. They stay a hairline at any size.
	</p>

	<h2 id="weight">Weight</h2>
	<p>
		The pattern is one curve that every line reuses, so the page carries about the same few
		kilobytes whatever <code>lines</code> is. It is drawn the same on the server and in the browser.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>It is decoration: hidden from assistive technology, and it takes no pointer events.</li>
		<li>
			Keep it faint behind text: the contrast of the text is still checked against the surface.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Guilloche props" rows={GUILLOCHE_PROPS} />
</DocPage>
