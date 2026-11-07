<script lang="ts">
	import DocPage from '#lib/docs/DocPage.svelte';
	import Playground from '#lib/playground/Playground.svelte';
</script>

<DocPage
	title="Playground"
	lede="Pick a component, change its props and copy the code. The controls are read from the component's types, so they offer exactly the values it accepts."
>
	<Playground />

	<h2 id="how">How it works</h2>
	<ul>
		<li>
			A prop typed as a list of values gets a select, a boolean a switch, text a text field and a
			number a number field. Props that take snippets or callbacks are left to the component's page.
		</li>
		<li>
			The code shows only what differs from the defaults, so it is what you would write by hand.
		</li>
		<li>
			The address keeps what you set: copy it to share a configuration, or to come back to it.
		</li>
		<li>The theme, mode and pack in the bar above apply here too.</li>
	</ul>
</DocPage>
