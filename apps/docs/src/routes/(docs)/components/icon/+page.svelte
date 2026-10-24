<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import IconDemo from '#lib/docs/icon/IconDemo.svelte';
	import { iconCustom, iconLabel, iconUsage } from '#lib/snippets/components.js';
	import ICON_PROPS from 'virtual:sveltier-api/IconProps';
</script>

<DocPage
	title="Icon"
	lede="Draws icons from SVG path data, or sizes and colours any icon you bring. No icon set is bundled, so you ship only the icons you use."
>
	<h2 id="usage">Usage</h2>
	<p>
		<code>path</code> takes SVG path data on a 24-unit square, the format path-based icon sets export.
		The icon is filled with the current colour.
	</p>
	<Code title="Account.svelte" code={iconUsage} />

	<h2 id="custom">Your own icons</h2>
	<p>
		Put any other icon inside: an <code>&lt;svg&gt;</code> or a component from an icon library. It is
		sized and coloured the same way.
	</p>
	<Code title="Account.svelte" code={iconCustom} />

	<h2 id="size">Size and colour</h2>
	<p>
		Without <code>size</code>, an icon is φ^½ the size of the text around it, the proportion used in
		<a href={resolve('components/button')}>buttons</a>, and takes its colour.
		<code>size</code> and <code>color</code> set them from the shared scale and the theme.
	</p>
	<IconDemo />

	<h2 id="accessibility">Accessibility</h2>
	<p>
		An icon is decorative and hidden from assistive technology unless it has a <code>label</code>.
		Label an icon that means something on its own, such as a status; leave it unlabelled next to
		text that says the same thing. An icon inside a button is named by the button.
	</p>
	<Code title="Status.svelte" code={iconLabel} />

	<h2 id="api">API</h2>
	<ApiTable label="Icon props" rows={ICON_PROPS} />
</DocPage>
