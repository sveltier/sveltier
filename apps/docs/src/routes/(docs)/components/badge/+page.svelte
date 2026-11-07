<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import BadgeDemo from '#lib/docs/badge/BadgeDemo.svelte';
	import { resolve } from '$app/paths';
	import { badgeTooltip, badgeUsage } from '#lib/snippets/components.js';
	import BADGE_PROPS from 'virtual:sveltier-api/BadgeProps';
</script>

<DocPage
	title="Badge"
	lede="Pins a count or a dot to the corner of a button, an avatar or an icon, or labels a line of text."
>
	<h2 id="usage">Usage</h2>
	<p>
		A Badge centres its count on the top end corner of what it wraps, in either writing direction.
		Counts above <code>max</code> show as 99+, and a count of 0 hides the badge. Without anything to wrap,
		it stands in the line.
	</p>
	<BadgeDemo />
	<Code title="Inbox.svelte" code={badgeUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<p>
		The badge's own text is hidden from screen readers, which hear the real count and its
		<code>label</code> instead: "120 alerts", not "99+". A dot says only its label, so give it one when
		it means something.
	</p>
	<p>
		Text next to a button is not read when the button is focused. Give the Badge an
		<code>id</code>, and its text gets the id <code>&lbrace;id&rbrace;-label</code>: point the
		button's <code>aria-describedby</code> at it, and the count is read with the button.
	</p>
	<p>
		A button with a <a href={resolve('overlays/tooltip')}>Tooltip</a> as well, such as a bell in a
		header, is described by both. The tooltip's attributes already carry an
		<code>aria-describedby</code>, so join the two ids rather than writing one over the other;
		development builds warn when the tooltip's is lost.
	</p>
	<Code title="AlertsButton.svelte" code={badgeTooltip} />

	<h2 id="api">API</h2>
	<ApiTable label="Badge props" rows={BADGE_PROPS} />
</DocPage>
