<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import AgentReady from '#lib/landing/AgentReady.svelte';
	import DesignSystem from '#lib/landing/DesignSystem.svelte';
	import Hero from '#lib/landing/Hero.svelte';
	import SameCode from '#lib/landing/SameCode.svelte';
	import SizeBudget from '#lib/landing/SizeBudget.svelte';
	import TryAgent from '#lib/landing/TryAgent.svelte';
	import '#lib/landing/landing.css';

	const TITLE = 'Sveltier: the UI framework for AI coding agents, on Svelte 5';
	// Absolute, as link previews require; the origin comes from the prerender origin when deployed.
	const socialCard = $derived(new URL(asset('social-card.png'), page.url.href).href);
	const DESCRIPTION =
		'A Svelte 5 UI framework built for AI coding agents: one typed vocabulary, docs generated from the types, and errors that say how to fix them. Accessible, consistent and polished by default.';
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={socialCard} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={socialCard} />
</svelte:head>

<main class="landing" id="main">
	<Hero />
	<div class="docs-wrap landing-body">
		<AgentReady />
		<TryAgent />
		<DesignSystem />
		<SizeBudget />
		<SameCode />
		<section class="landing-join" aria-labelledby="join-title">
			<h2 id="join-title">Build it with us</h2>
			<p>
				Sveltier is pre-alpha and built in the open. Tell us which components your agents reach for
				first, where they still get it wrong, and what would help them get it right.
			</p>
			<div class="hero__actions">
				<a class="hero__cta" href="https://github.com/sveltier/sveltier" rel="external"
					>Star on GitHub</a
				>
				<a class="hero__link" href="https://github.com/sveltier/sveltier/issues" rel="external"
					>Open an issue</a
				>
			</div>
		</section>
		<footer class="docs-foot">
			Sveltier is pre-alpha. MIT licensed.
			<a href="https://github.com/sveltier/sveltier" rel="external">Source on GitHub</a>
		</footer>
	</div>
</main>
