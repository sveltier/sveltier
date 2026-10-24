<script lang="ts">
	// A Slider in a themed form, with its bound value shown, the submitted form data written out
	// and a reset button.
	import Slider from '../../lib/components/Slider/Slider.svelte';
	import type { SliderProps } from '../../lib/components/Slider/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { value = $bindable(), dir, ...props }: SliderProps & { dir?: 'ltr' | 'rtl' } = $props();
	let submitted = $state('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form
		{dir}
		style="inline-size: 20rem"
		onsubmit={(event) => {
			event.preventDefault();
			submitted = new URLSearchParams(new FormData(event.currentTarget) as never).toString();
		}}
	>
		<Slider label="Risk" name="risk" {...props} bind:value />
		<button type="submit">Send</button>
		<button type="reset">Reset</button>
	</form>
	<span data-testid="value">{value === undefined ? 'undefined' : `${typeof value}:${value}`}</span>
	<span data-testid="submitted">{submitted}</span>
</ThemeProvider>
