<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import AppLayoutDemo from '#lib/docs/app-layout/AppLayoutDemo.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { appLayoutCorner, appLayoutRail, appLayoutUsage } from '#lib/snippets/layout.js';
	import APP_BAR_PROPS from 'virtual:sveltier-api/AppBarProps';
	import APP_LAYOUT_PROPS from 'virtual:sveltier-api/AppLayoutProps';
	import MAIN_PROPS from 'virtual:sveltier-api/MainProps';
	import NAVIGATION_DRAWER_PROPS from 'virtual:sveltier-api/NavigationDrawerProps';
</script>

<DocPage
	title="App layout"
	lede="The frame of an app: a bar across the top, the navigation at the start and the main content, on a CSS grid that the server renders as it will stay."
>
	<h2 id="usage">Usage</h2>
	<p>
		Put <code>AppLayout</code> in the root layout with its parts: <code>AppBar</code>,
		<code>NavigationDrawer</code> and <code>Main</code>. Each part takes its own area of a CSS grid,
		so the content never sits under the bar or the drawer. Nothing is measured: the server sends the
		finished layout, and a part left out leaves no gap. The page itself scrolls, so the browser
		keeps its scroll position, find in page and printing as on any page. <code>Main</code> adds no padding:
		lay the page out inside it.
	</p>
	<AppLayoutDemo />
	<Code title="+layout.svelte" code={appLayoutUsage} />

	<h2 id="corner">Which part takes the corner</h2>
	<p>
		The part written first takes the top start corner. With the bar first, it runs across the top
		and the drawer starts under it. With the drawer first, the drawer runs the full height and the
		bar sits beside it, over the content only. Reading order follows: what comes first in the markup
		is what comes first on the screen.
	</p>
	<Code code={appLayoutCorner} />

	<h2 id="small-screens">Small screens</h2>
	<p>
		Below its <code>breakpoint</code> (<code>md</code>, 960px, by default), the drawer leaves the
		grid and the content takes the full width. The bar then starts with a menu button, which opens
		the drawer as a modal drawer from the start edge. Escape, a press outside it, or a link inside
		it closes it, and it closes by itself when the screen grows past the breakpoint.
		<code>bind:open</code> opens it from your own code. With <code>breakpoint="xs"</code>, the
		drawer stays beside the content at every width.
	</p>
	<p>
		The switch happens in CSS, so the server renders the right layout for every screen before any
		script runs. It uses the breakpoints' default widths (<code>sm</code> 600px, <code>md</code>
		960px, <code>lg</code> 1280px, <code>xl</code> 1920px): custom thresholds given to
		<code>UIProvider</code> do not move it.
	</p>

	<h2 id="rail">Rail</h2>
	<p>
		From the breakpoint up, <code>rail</code> narrows the drawer to the icons of the
		<code>List</code> in it. Each link keeps its text for assistive technology, out of sight.
		Content with <code>margin-block-start: auto</code> sits at the bottom of the drawer, which suits a
		toggle.
	</p>
	<Code code={appLayoutRail} />

	<h2 id="bar">The bar</h2>
	<p>
		<code>AppBar</code> holds a <code>title</code>, any content after it (links, a search field),
		which takes the free space, and <code>actions</code> at the end, on one line φ³ tall (about
		68px) at the default density. It stays at the top while the page scrolls;
		<code>sticky=&#123;false&#125;</code>
		lets it scroll away. Under a sticky bar, the page scrolls the target of a link and a focused control
		into view below the bar. Buttons in the bar keep their own defaults: an icon button reads best as
		<code>variant="text" color="neutral"</code>.
	</p>

	<h2 id="sizes">Sizes</h2>
	<p>
		The drawer is 10φ wide (16.18rem), and its rail as wide as a large control (4.24rem). To change
		them, set <code>--sv-navigation-drawer-width</code> and
		<code>--sv-navigation-drawer-rail-width</code> on the <code>AppLayout</code>; the modal drawer
		takes the same width.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The layout starts with a <q>Skip to content</q> link to <code>Main</code>, out of sight until
			it has focus.
		</li>
		<li>
			Landmarks: the bar is the banner (<code>&lt;header&gt;</code>), the drawer a navigation named
			<q>Main</q>, and the content the <code>&lt;main&gt;</code>.
		</li>
		<li>
			The menu button is named <q>Navigation</q> and tells whether the drawer is open (<code
				>aria-expanded</code
			>). The modal drawer is a modal dialog named <q>Navigation</q>: focus moves into it, stays
			there, and goes back to the menu button when it closes.
		</li>
		<li>
			The names come from the locale: <code>skipToContent</code>, <code>mainNavigation</code> and
			<code>navigation</code>. Give the drawer another name with <code>aria-label</code>.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="AppLayout props" rows={APP_LAYOUT_PROPS} />
	<ApiTable label="AppBar props" rows={APP_BAR_PROPS} />
	<ApiTable label="NavigationDrawer props" rows={NAVIGATION_DRAWER_PROPS} />
	<ApiTable label="Main props" rows={MAIN_PROPS} />
</DocPage>
