<script lang="ts">
	import { resolve } from '$app/paths';
	import { Breadcrumbs } from '@sveltier/ui';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import { breadcrumbsUsage } from '#lib/snippets/components.js';
	import BREADCRUMBS_ITEM from 'virtual:sveltier-api/BreadcrumbsItem';
	import BREADCRUMBS_PROPS from 'virtual:sveltier-api/BreadcrumbsProps';
</script>

<DocPage
	title="Breadcrumbs"
	lede="Where the current page sits in the site: the pages above it as links, and the page itself last."
>
	<h2 id="usage">Usage</h2>
	<p>
		List the <code>items</code> from the top: each step has a <code>label</code> and, when it leads
		somewhere, an <code>href</code>. The last step is the current page. Long trails wrap.
	</p>
	<div class="docs-demo">
		<Breadcrumbs
			items={[
				{ label: 'Docs', href: resolve('/') },
				{ label: 'Components', href: resolve('components/accordion') },
				{ label: 'Breadcrumbs' }
			]}
		/>
	</div>
	<Code title="Statement.svelte" code={breadcrumbsUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The trail is a <code>&lt;nav&gt;</code> landmark named <q>Breadcrumb</q>, from the locale's
			<code>breadcrumb</code> message; give it another name with <code>aria-label</code>.
		</li>
		<li>
			The steps are an ordered list, and the last one has <code>aria-current="page"</code>, whether
			it is a link or text.
		</li>
		<li>
			The separators are drawn by CSS with empty alternative text, so screen readers do not read
			them out.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Breadcrumbs props" rows={BREADCRUMBS_PROPS} />
	<ApiTable label="BreadcrumbsItem" rows={BREADCRUMBS_ITEM} />
</DocPage>
