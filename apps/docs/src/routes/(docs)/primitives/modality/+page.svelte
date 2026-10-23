<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ModalDemo from '#lib/docs/ModalDemo.svelte';
	import { PORTAL_PROPS } from '#lib/docs/api.js';
	import { modalExample, portalExample } from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Portal and modality"
	lede="Build modal surfaces from parts: move content out of its container, make the page behind it inert, and stop the page from scrolling."
>
	<h2 id="together">Together</h2>
	<p>
		A modal sheet is these primitives on one element, plus the focus trap and dismissable layer.
		Sveltier's Dialog and Sheet will be built the same way.
	</p>
	<ModalDemo />
	<Code title="TransferSheet.svelte" code={modalExample} />

	<h2 id="portal">Portal</h2>
	<p>
		<code>Portal</code> renders its children somewhere else in the document, by default at the end
		of
		<code>&lt;body&gt;</code>. Theme, defaults, breakpoints and locale keep working inside, and
		content from a nested theme scope keeps that theme.
	</p>
	<Code title="Toasts.svelte" code={portalExample} />
	<ApiTable label="Portal props" rows={PORTAL_PROPS} />
	<p>
		Prefer the top layer when you can: an element shown with <code>popover</code> or
		<code>&lt;dialog&gt;</code> already sits above the page and stays in place in the DOM. Portaled content
		renders only in the browser, after hydration.
	</p>

	<h2 id="inert">Inert page</h2>
	<p>
		<code>inertOthers()</code> makes everything outside the element inert: not focusable, not
		clickable, hidden from screen readers. Live regions stay active, so announcements still come
		through, and a modal inside another never reactivates what the outer one made inert. A native
		<code>&lt;dialog&gt;</code> opened with <code>showModal()</code> does this by itself.
	</p>

	<h2 id="scroll-lock">Scroll lock</h2>
	<p>
		<code>scrollLock()</code> stops the page from scrolling while it is attached, and keeps the scrollbar's
		width as padding so nothing shifts. Locks are counted, so the page scrolls again only when the last
		modal closes. Modal dialogs need it too: they do not lock the page themselves.
	</p>
</DocPage>
