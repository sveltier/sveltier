<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SliderDemo from '#lib/docs/slider/SliderDemo.svelte';
	import { sliderUsage } from '#lib/snippets/forms.js';
	import SLIDER_PROPS from 'virtual:sveltier-api/SliderProps';
</script>

<DocPage
	title="Slider"
	lede="A number picked by dragging a thumb along a track: the platform's own range input, so the keyboard, touch, forms and right-to-left pages work as they always do."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>, a number between <code>min</code> and <code>max</code> (0 and 100
		unless you set them) that stops on each <code>step</code>. The value shows at the end of the
		label row. <code>format</code> sets how it reads, there and to screen readers.
	</p>
	<SliderDemo />
	<Code title="Portfolio.svelte" code={sliderUsage} />

	<h2 id="ticks">Ticks</h2>
	<p>
		<code>ticks</code> draws marks under the track, each under the thumb's centre at its value:
		<code>true</code> for every step, a list of values, or values with labels. While the thumb sits on
		a labelled tick, screen readers hear the label, such as "Balanced", instead of the number.
	</p>

	<h2 id="validation">Validation</h2>
	<p>
		A slider always holds a value, kept between <code>min</code> and <code>max</code> by the
		browser, so there is no <code>required</code>. <code>rules</code> receive the value, and their
		message shows once the user lets go of the thumb or presses a key.
		<code>error</code> and <code>validateOn</code> work as on a
		<a href={resolve('forms/text-field')}>TextField</a>, and a form reset goes back to the value the
		slider started at.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is an <code>&lt;input type="range"&gt;</code> with its label linked: the arrow keys step,
			<kbd>Page Up</kbd> and <kbd>Page Down</kbd> take larger steps, <kbd>Home</kbd> and
			<kbd>End</kbd> go to the ends, as the platform defines.
		</li>
		<li>
			The value beside the label is for sight only; screen readers read the slider's own value, or
			its <code>format</code>ted text.
		</li>
		<li>The input is at least 24px tall, so the whole row takes a press.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Slider props" rows={SLIDER_PROPS} />
</DocPage>
