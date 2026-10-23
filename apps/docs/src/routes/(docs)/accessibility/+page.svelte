<script lang="ts">
	import DocPage from '#lib/docs/DocPage.svelte';
</script>

<DocPage
	title="Accessibility"
	lede="Accessibility is built in from the first line, not patched on. These are the commitments every part of Sveltier is tested against."
>
	<h2 id="keyboard">Keyboard and ARIA</h2>
	<p>
		Interactive components follow the WAI-ARIA Authoring Practices: the documented roles, states and
		keyboard maps, with no custom shortcuts invented without a reason. Each component page lists its
		keyboard support. Behaviour is tested in real Chromium, Firefox and WebKit, because focus
		handling differs between engines.
	</p>

	<h2 id="contrast">Contrast</h2>
	<p>All ten built-in themes are checked in the test suite against WCAG 2.2:</p>
	<ul>
		<li>
			Body, muted and subtle text, and every intent used as text: at least 4.5:1 on every surface.
		</li>
		<li>Text on filled intents (<code>--sv-on-*</code>): at least 4.5:1.</li>
		<li>Text on tonal fills (chips, badges, alerts): at least 4.5:1.</li>
		<li>Control boundaries (<code>border-strong</code>) and focus rings: at least 3:1.</li>
	</ul>

	<h2 id="focus">Focus</h2>
	<p>
		Keyboard focus is always visible: a ring in the theme's primary colour on
		<code>:focus-visible</code>, which appears for keyboard users and stays out of the way of
		pointer clicks.
	</p>

	<h2 id="motion">Reduced motion</h2>
	<p>
		Only <code>transform</code> and <code>opacity</code> are animated. When the operating system asks
		for reduced motion, every theme's durations collapse to near zero and pressed controls stop moving.
	</p>

	<h2 id="colour">Not by colour alone</h2>
	<p>
		Meaning never depends on colour only. Price changes carry a sign or an arrow, statuses carry a
		label, and errors carry text.
	</p>

	<h2 id="automated">Automated checks</h2>
	<p>
		Every page of this site is scanned with axe (WCAG 2.2 A and AA rules) in light and dark, and
		checked for horizontal scrolling at widths from 320 to 1440 pixels.
	</p>
</DocPage>
