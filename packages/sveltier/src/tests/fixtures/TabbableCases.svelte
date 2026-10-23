<script lang="ts">
	// Every case tabbable() must handle, including patterns a real page should avoid.
</script>

<div data-testid="cases">
	<button type="button">visible</button>
	<button type="button" disabled>disabled</button>
	<button type="button" tabindex="-1">negative</button>
	<button type="button" style:display="none">not rendered</button>
	<button type="button" style:visibility="hidden">invisible</button>
	<div inert><button type="button">inert</button></div>
	<fieldset disabled><button type="button">in disabled fieldset</button></fieldset>
	<details>
		<summary>closed summary</summary>
		<button type="button">in closed details</button>
	</details>
	<details open>
		<summary>open summary</summary>
		<button type="button">in open details</button>
	</details>
	<a href="#cases">link</a>
	<!-- svelte-ignore a11y_missing_attribute (an anchor without href is not focusable, which is the case under test) -->
	<a>anchor without href</a>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (a div made focusable is the case under test) -->
	<div tabindex="0">focusable div</div>
	<input type="hidden" />
	<input aria-label="text field" />
	<input type="radio" name="first-group" aria-label="radio a1" />
	<input type="radio" name="first-group" aria-label="radio a2" checked />
	<input type="radio" name="second-group" aria-label="radio b1" />
	<input type="radio" name="second-group" aria-label="radio b2" />
	<!-- svelte-ignore a11y_positive_tabindex (positive tabindex ordering is the case under test) -->
	<button type="button" tabindex="2">second by tabindex</button>
	<!-- svelte-ignore a11y_positive_tabindex (positive tabindex ordering is the case under test) -->
	<button type="button" tabindex="1">first by tabindex</button>
	<div contenteditable="true">editable</div>
</div>
