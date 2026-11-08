<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import AppLayoutDemo from '#lib/docs/app-layout/AppLayoutDemo.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import {
		appLayoutBarLinks,
		appLayoutCorner,
		appLayoutFill,
		appLayoutPanes,
		appLayoutRail,
		appLayoutUsage
	} from '#lib/snippets/layout.js';
	import APP_BAR_PROPS from 'virtual:sveltier-api/AppBarProps';
	import APP_FOOTER_PROPS from 'virtual:sveltier-api/AppFooterProps';
	import APP_LAYOUT_PROPS from 'virtual:sveltier-api/AppLayoutProps';
	import MAIN_PROPS from 'virtual:sveltier-api/MainProps';
	import NAVIGATION_DRAWER_PROPS from 'virtual:sveltier-api/NavigationDrawerProps';
</script>

<DocPage
	title="App layout"
	lede="The frame of an app: a bar across the top, the navigation at the start, the main content and a status bar, on a CSS grid that the server renders as it will stay."
>
	<h2 id="usage">Usage</h2>
	<p>
		Put <code>AppLayout</code> in the root layout with its parts: <code>AppBar</code>,
		<code>NavigationDrawer</code>, <code>Main</code> and, for a status bar, <code>AppFooter</code>.
		Each part takes its own area of a CSS grid, so the content never sits under the bar or the
		drawer. Nothing is measured: the server sends the finished layout, and a part left out leaves no
		gap. The page itself scrolls, so the browser keeps its scroll position, find in page and
		printing as on any page. <code>Main</code> adds no padding: lay the page out inside it.
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

	<h2 id="bar-links">Links in the bar</h2>
	<p>
		An app can keep its navigation in the bar on a wide screen and in a drawer on a phone, as
		trading platforms do. Put the links in the bar's <code>nav</code> and make the drawer
		<code>modal</code>. From the drawer's breakpoint up, the links run across the bar and there is
		no drawer; below it, the bar shows its menu button instead, which opens the drawer. The page
		keeps one frame at every width, so turning a phone does not rebuild it.
	</p>
	<p>
		Write the links once, as a <code>List nav</code> in a snippet. In the bar's <code>nav</code> the
		list lays out in a row, each link as wide as its text, with the same rounded rows and the same
		mark on the current page (<code>ListItem active</code>, <code>aria-current="page"</code>) as in
		the drawer. The bar's <code>prepend</code> holds the app's mark, usually a link home, at every width.
	</p>
	<Code title="+layout.svelte" code={appLayoutBarLinks} />

	<h2 id="fill">Filling the window</h2>
	<p>
		A trading terminal or a mail client keeps its frame still and scrolls its panes.
		<code>fill</code> makes the layout the window's height: the page never scrolls, and
		<code>Main</code> takes the height the bar and the footer leave. Content with
		<code>block-size: 100%</code> fills it, and <code>Main</code> scrolls on its own if its content is
		taller. The drawer fills its area instead of sticking to the window.
	</p>
	<p>
		<code>fill</code> also takes a breakpoint: <code>fill="md"</code> fills from 960px up, and below it
		the page scrolls as usual, so a phone's browser bars collapse as the page moves. The switch is in
		CSS, so the server renders the right frame for every screen.
	</p>
	<Code title="+layout.svelte" code={appLayoutFill} />
	<Code title="+page.svelte" code={appLayoutPanes} />

	<h2 id="footer">Footer</h2>
	<p>
		<code>AppFooter</code> is a status bar along the bottom: a market clock, the state of a
		connection, a notice. The layout places it under the content, as wide as the bar (beside the
		drawer when the drawer comes first), one line a control tall (about 42px) at the default
		density, in the small, subtle text of a status. <code>sticky</code> keeps it at the bottom of
		the window while the page scrolls. A drawer under the bar leaves room for it, and toasts stay
		above it on their own. A site footer of several lines belongs at the end of <code>Main</code> instead.
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
		<code>AppBar</code> holds the app's mark in <code>prepend</code>, a <code>title</code>, the
		links of its <code>nav</code>, any content after them (a search field), which takes the free
		space, and <code>actions</code> at the end, on one line φ³ tall (about 68px) at the default
		density. It stays at the top while the page scrolls;
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
	<p>
		The layout gives the bar's height, at its density, to everything inside it as
		<code>--sv-app-bar-height</code>: content that places itself under a sticky bar, such as a
		sticky header, reads it for its offset.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The layout starts with a <q>Skip to content</q> link to <code>Main</code>, out of sight until
			it has focus.
		</li>
		<li>
			Landmarks: the bar is the banner (<code>&lt;header&gt;</code>), the drawer a navigation named
			<q>Main</q>, the content the <code>&lt;main&gt;</code>, and the footer the contentinfo (<code
				>&lt;footer&gt;</code
			>), as it sits outside <code>Main</code>. The bar's <code>nav</code> is a navigation named
			<q>Main</q>
			too; with a <code>modal</code> drawer, only one of them is there at a time.
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
	<ApiTable label="AppFooter props" rows={APP_FOOTER_PROPS} />
</DocPage>
