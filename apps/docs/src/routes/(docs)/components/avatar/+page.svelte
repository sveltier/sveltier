<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import AvatarDemo from '#lib/docs/avatar/AvatarDemo.svelte';
	import { avatarUsage } from '#lib/snippets/components.js';
	import AVATAR_PROPS from 'virtual:sveltier-api/AvatarProps';
</script>

<DocPage
	title="Avatar"
	lede="A picture of a person or an account, with initials or an icon when there is no picture or it fails to load."
>
	<h2 id="usage">Usage</h2>
	<p>
		An Avatar is as tall as a control of its <code>size</code> and round by default. Its content,
		initials or an <code>Icon</code>, is the fallback: shown when there is no <code>src</code> and
		when the image fails to load, and painted in the tonal <code>variant</code> of its
		<code>color</code>.
	</p>
	<AvatarDemo />
	<Code title="Member.svelte" code={avatarUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<p>
		An Avatar is decorative and hidden from screen readers unless it has <code>alt</code> text. Next to
		a name, leave it out; on its own, give it the name it stands for, and it becomes an image with that
		name.
	</p>

	<h2 id="api">API</h2>
	<ApiTable label="Avatar props" rows={AVATAR_PROPS} />
</DocPage>
