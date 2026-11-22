<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SegmentedDemo from '#lib/docs/segmented/SegmentedDemo.svelte';
	import { segmentedLanguage, segmentedUsage } from '#lib/snippets/components.js';
	import SEGMENTED_PROPS from 'virtual:sveltier-api/SegmentedControlProps';
	import SEGMENTED_OPTION from 'virtual:sveltier-api/SegmentedControlOption';
</script>

<DocPage
	title="SegmentedControl"
	lede="One choice among a few options side by side, such as a chart range or a view."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the choices as <code>options</code> and bind the <code>value</code>. The segments are as
		wide as the widest, and the selected one slides into place. It is a raised surface by default;
		any variant and colour paints it.
	</p>
	<p>
		The track behind the options follows the variant. <code>elevated</code>, <code>flat</code> and
		<code>tonal</code> sit on a filled track; <code>outlined</code> draws a hairline around the row
		with no fill, for a page of lines rather than surfaces; <code>text</code> and <code>plain</code>
		have no track. Set it once for the app with
		<code>{"defaults={{ SegmentedControl: { variant: 'outlined' } }}"}</code>
		on the <code>UIProvider</code>.
	</p>
	<SegmentedDemo />
	<Code title="ChartRange.svelte" code={segmentedUsage} />

	<h2 id="wrap">Many options</h2>
	<p>
		A segmented control holds a few short options on one line. For more, or for labels with counts
		in a narrow panel, <code>wrap</code> lets the options flow onto more lines, each as wide as its label.
		The selected one is painted in place, every arrow key moves, and it is still one stop in the tab order.
	</p>

	<h2 id="labels">Short labels</h2>
	<p>
		An option's <code>attributes</code> go on its radio: a name that says more than a short label,
		its language and a title, as a language switch needs:
		<code
			>{"{ value: 'en', label: 'EN', attributes: { 'aria-label': 'EN · English', lang: 'en' } }"}</code
		>. A name should start with the label's words, so speech input finds it by what it shows. For
		sighted users, an option's <code>tooltip</code> shows the full name in the theme's
		<a href={resolve('overlays/tooltip')}>Tooltip</a> on hover and on keyboard focus, and screen
		readers read it as the option's description:
		<code>{"{ value: 'en', label: 'EN', tooltip: 'English', attributes: { lang: 'en' } }"}</code>.
		Touch has no hover, so the name still goes in <code>aria-label</code>.
	</p>

	<h2 id="side-effects">A choice that changes the page</h2>
	<p>
		The arrow keys pick as they move, which is right for a chart range. When picking goes to another
		address or reloads part of the page, as a language switch does, give it
		<code>activation="manual"</code>: the arrows only move, and Enter or Space picks. When the app
		owns the value, as a route does, bind it through a getter and a setter: picking calls the
		setter, and the control checks only what the getter returns, so a change the app makes later, or
		never, is what it shows.
	</p>
	<Code title="LanguageSwitch.svelte" code={segmentedLanguage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a radio group: one stop in the tab order, on the selected option. The arrow keys move
			and select, following the writing direction, and skip disabled options; with
			<code>activation="manual"</code> they move and Enter or Space selects, so moving never changes
			the page. Name it with <code>aria-label</code>.
		</li>
		<li>
			For actions rather than a choice, use a <a href={resolve('components/button-group')}
				>ButtonGroup</a
			>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="SegmentedControl props" rows={SEGMENTED_PROPS} />
	<ApiTable label="SegmentedControlOption" rows={SEGMENTED_OPTION} />
</DocPage>
