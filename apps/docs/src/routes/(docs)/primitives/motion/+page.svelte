<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import SpringDemo from '#lib/docs/SpringDemo.svelte';
	import TransitionDemo from '#lib/docs/TransitionDemo.svelte';
	import { MOTION_API, SPRING_API, TRANSITION_OPTIONS } from '#lib/docs/api.js';
	import {
		motionCss,
		motionExample,
		springExample,
		transitionExample
	} from '#lib/snippets/primitives.js';
</script>

<DocPage
	title="Motion"
	lede="Animate with the theme's timing, in CSS or in script, and hold still when the user asks for less motion."
>
	<h2 id="tokens">Timing tokens</h2>
	<p>
		Every theme sets three durations and one easing curve: <code>--sv-duration-fast</code>,
		<code>--sv-duration-normal</code>, <code>--sv-duration-slow</code> and <code>--sv-ease</code>.
		The durations are Fibonacci milliseconds, 144, 233 and 377 in Monolith. When the user asks for
		reduced motion, the base styles set every duration to 0.01ms whatever the theme, so anything
		timed with the tokens becomes instant without checking the setting itself.
	</p>
	<Code title="panel.css" lang="css" code={motionCss} />
	<p>
		Animate only <code>transform</code> and <code>opacity</code>. The browser moves them without
		recalculating layout or repainting, so motion stays smooth on slow devices.
	</p>

	<h2 id="transitions">Transitions</h2>
	<p>
		For content that mounts and unmounts, <code>fade</code>, <code>rise</code> and <code>pop</code>
		are Svelte transitions that read the timing of the theme where the element is. They move only opacity
		and transform, and the tokens make them instant under reduced motion.
	</p>
	<TransitionDemo />
	<Code title="Receipt.svelte" code={transitionExample} />
	<ApiTable label="transition options" rows={TRANSITION_OPTIONS} />

	<h2 id="springs">Springs</h2>
	<p>
		<code>spring()</code> returns a Svelte <code>Spring</code> with one of three presets. Stiffness steps
		down the φ series, 1/φ³, 1/φ⁴ and 1/φ⁵, and damping is what is left of 1. Use snappy for small controls,
		standard for most movement and gentle for large surfaces and numbers that count. While the user prefers
		reduced motion, every update lands at once.
	</p>
	<SpringDemo />
	<Code title="Balance.svelte" code={springExample} />
	<ApiTable label="spring and presets" rows={SPRING_API} />

	<h2 id="script">Timing in script</h2>
	<p>
		<code>motion()</code> reads the timing where an element is, for <code>element.animate()</code>
		and for Svelte's <code>Tween</code>. Like the CSS, it follows the theme in scope and drops to
		0.01ms under reduced motion.
	</p>
	<Code title="price-cell.ts" lang="ts" code={motionExample} />
	<ApiTable label="timing helpers" rows={MOTION_API} />
</DocPage>
