<script lang="ts">
	// The brand band: the headline beside the agent replay, over the S stripes.
	import { resolve } from '$app/paths';
	import { ThemeProvider } from '@sveltier/ui';
	import Stripes from '#lib/brand/Stripes.svelte';
	import symbolFull from '#lib/brand/symbol-full.svg';
	import { pageHref } from '#lib/docs/href.js';
	import AgentReplay from './AgentReplay.svelte';
</script>

<section class="hero" aria-labelledby="hero-title">
	<ThemeProvider theme="monolith-dark" class="hero__scope">
		<div class="hero__art" aria-hidden="true"><Stripes /></div>
		<div class="hero__inner">
			<div class="hero__copy">
				<img class="hero__mark" src={symbolFull} alt="" width="104" height="104" />
				<p class="hero__eyebrow">Alpha · Svelte 5 · Built for AI coding agents</p>
				<h1 id="hero-title">
					Your agent writes it.
					<span>Sveltier gets it right.</span>
				</h1>
				<p class="hero__lede">
					The UI framework for coding agents. One typed vocabulary they cannot misuse, docs
					generated from the types they read, and errors that tell them the fix. What they build
					comes out accessible, consistent and polished, whichever model wrote it.
				</p>
				<div class="hero__actions">
					<a class="hero__cta" href={resolve('getting-started/installation')}>Get started</a>
					<!-- eslint-disable svelte/no-navigation-without-resolve -- pageHref() calls resolve() -->
					<a class="hero__link" href={pageHref('llms.txt')} data-sveltekit-reload>Read llms.txt</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
					<a class="hero__link" href="https://github.com/sveltier/sveltier" rel="external">GitHub</a
					>
				</div>
			</div>
			<div class="hero__stage">
				<AgentReplay />
				<p class="hero__note">
					A scripted replay: no model runs in your browser. The preview is the real component
					rendering the code beside it.
				</p>
			</div>
		</div>
	</ThemeProvider>
</section>
