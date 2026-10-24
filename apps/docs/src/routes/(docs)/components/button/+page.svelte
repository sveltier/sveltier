<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ButtonIcons from '#lib/docs/button/ButtonIcons.svelte';
	import ButtonSizes from '#lib/docs/button/ButtonSizes.svelte';
	import ButtonStates from '#lib/docs/button/ButtonStates.svelte';
	import ButtonVariants from '#lib/docs/button/ButtonVariants.svelte';
	import {
		buttonDefaults,
		buttonIcons,
		buttonLink,
		buttonLoading,
		buttonUsage
	} from '#lib/snippets/components.js';
	import BUTTON_PROPS from 'virtual:sveltier-api/ButtonProps';
</script>

<DocPage
	title="Button"
	lede="Starts an action, or goes somewhere when it has a link. Six variants in any colour of the theme, sizes on the golden scale, and a loading state that keeps focus."
>
	<h2 id="usage">Usage</h2>
	<p>
		A Button is a <code>&lt;button type="button"&gt;</code>, so it never submits a form by accident;
		pass <code>type="submit"</code> for the one that should. Every attribute you give it reaches the element.
	</p>
	<Code title="Transfer.svelte" code={buttonUsage} />

	<h2 id="variants">Variants and colours</h2>
	<p>
		<code>elevated</code> sets the colour on a raised surface, <code>flat</code> fills with it,
		<code>tonal</code> tints with it,
		<code>outlined</code> adds a border, <code>text</code> is the colour alone, and
		<code>plain</code> has no hover or press wash. Every pairing meets WCAG AA contrast in all five theme
		packs, light and dark.
	</p>
	<ButtonVariants />

	<h2 id="size">Size and density</h2>
	<p>
		<code>size</code> moves the height half a step of φ and the text a quarter step;
		<code>density</code> tightens or loosens height and padding without touching the text. See
		<a href={resolve('core/shared-props')}>Shared props</a>.
	</p>
	<ButtonSizes />

	<h2 id="icons">Icons</h2>
	<p>
		<code>prepend</code> and <code>append</code> put content before and after the label. Icons are
		sized to φ^½ of the text. With <code>icon</code>, the button is square and holds only its icon,
		so give it an <code>aria-label</code>.
	</p>
	<ButtonIcons />
	<Code title="Toolbar.svelte" code={buttonIcons} />

	<h2 id="states">Loading and disabled</h2>
	<p>
		<code>loading</code> shows a spinner over the label and ignores presses, while the button keeps its
		size and focus. Screen readers hear that it is loading. A disabled button cannot be focused or pressed.
	</p>
	<ButtonStates />
	<Code title="PayInvoice.svelte" code={buttonLoading} />

	<h2 id="links">Links</h2>
	<p>
		With <code>href</code>, the Button is an <code>&lt;a&gt;</code>: it navigates, opens in a new
		tab and works with your router like any link. A disabled link drops its <code>href</code>.
	</p>
	<Code title="Nav.svelte" code={buttonLink} />

	<h2 id="defaults">Defaults</h2>
	<p>
		Set Button props for a whole app or section with <code>defaults</code> on
		<a href={resolve('api/ui-provider')}>UIProvider</a> or a
		<a href={resolve('core/defaults')}>DefaultsProvider</a>. A prop on the Button itself still wins.
	</p>
	<Code title="+layout.svelte" code={buttonDefaults} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			<kbd>Enter</kbd> and <kbd>Space</kbd> press a button; <kbd>Enter</kbd> follows a link. Both
			are reached with <kbd>Tab</kbd>.
		</li>
		<li>
			Disabled buttons use the native <code>disabled</code> attribute and leave the tab order. A
			loading button stays focusable and is marked <code>aria-disabled</code>; you can do the same
			for a button that should stay discoverable while unavailable.
		</li>
		<li>An icon button needs <code>aria-label</code> or <code>aria-labelledby</code>.</li>
		<li>
			Hover and press are shown with a tint and a one-pixel press, and reduced motion keeps it
			still.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Button props" rows={BUTTON_PROPS} />
</DocPage>
