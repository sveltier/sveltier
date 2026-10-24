<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SwitchDemo from '#lib/docs/switch/SwitchDemo.svelte';
	import { switchUsage } from '#lib/snippets/forms.js';
	import SWITCH_PROPS from 'virtual:sveltier-api/SwitchProps';
</script>

<DocPage
	title="Switch"
	lede="A setting that is on or off, with its label beside it: a native checkbox with the switch role, drawn as a track and a thumb."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind <code>checked</code>. The label is the press target, the thumb slides to the end of the
		line when the switch is on (to the left in a right-to-left page), and the track takes the
		<code>color</code>. In a theme with square corners, the switch is square too.
	</p>
	<SwitchDemo />
	<Code title="Settings.svelte" code={switchUsage} />

	<h2 id="when">Switch or checkbox</h2>
	<p>
		A switch is for a setting that takes effect at once, like a light switch. For a choice that is
		sent with a form, such as accepting terms or picking what to include, use a
		<a href={resolve('forms/checkbox')}>Checkbox</a>. Both submit <code>value</code> under
		<code>name</code> while on, and take <code>required</code>, <code>rules</code> and
		<code>error</code> the same way.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is an <code>&lt;input type="checkbox" role="switch"&gt;</code> inside its
			<code>&lt;label&gt;</code>: screen readers announce it as a switch that is on or off, and
			<kbd>Space</kbd> toggles it.
		</li>
		<li>The label row is at least 24px tall at every size.</li>
		<li>
			The state shows in the thumb's position as well as in colour, and in forced colours the track
			and thumb keep their outlines.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Switch props" rows={SWITCH_PROPS} />
</DocPage>
