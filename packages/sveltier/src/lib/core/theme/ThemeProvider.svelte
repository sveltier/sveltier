<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ThemeChoice, ThemeDefinition } from './types.js';

	export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
		/** "system" or a theme name. Nested providers inherit their parent's choice by default. */
		theme?: ThemeChoice;
		/** Root only. Registered themes, for example `monolith` or `{ ...monolith, ...maison }`. Defaults to Monolith. */
		themes?: Record<string, ThemeDefinition>;
		/** Root only. Theme used by "system" when the OS prefers light. Defaults to the first light theme. */
		light?: string;
		/** Root only. Theme used by "system" when the OS prefers dark. Defaults to the first dark theme. */
		dark?: string;
		/** Root only. Where the user's choice is remembered; `false` turns persistence off. */
		storageKey?: string | false;
		/** Root only. CSP nonce for the generated `<style>` and `<script>`. */
		nonce?: string;
		/** Nested only. Paint the scope's background. */
		withBackground?: boolean;
		/** Nested only. The wrapper element. */
		ref?: HTMLDivElement | null;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import '../../styles/tokens.css';
	import '../../styles/base.css';
	import './theme-provider.css';
	import { monolith } from '../../themes/monolith.js';
	import { hasThemeContext, setThemeContext, useTheme, type ThemeInstance } from './context.js';
	import { THEME_ATTRIBUTE, themeCss, themeHead, themeScript } from './css.js';

	const parent = hasThemeContext() ? useTheme() : undefined;

	let {
		theme = $bindable(),
		themes,
		light,
		dark,
		storageKey = 'sv-theme',
		nonce,
		withBackground = false,
		ref = $bindable(null),
		class: className,
		children,
		...rest
	}: ThemeProviderProps = $props();

	const registry = $derived<Record<string, ThemeDefinition>>(parent?.themes ?? themes ?? monolith);
	const lightName = $derived(parent?.light ?? light ?? first(registry, false));
	const darkName = $derived(parent?.dark ?? dark ?? first(registry, true));
	const choice = $derived<ThemeChoice>(theme ?? parent?.choice ?? 'system');

	const prefersDark = new MediaQuery('(prefers-color-scheme: dark)', false);
	const name = $derived(
		choice === 'system' ? (prefersDark.current ? darkName : lightName) : choice
	);
	const current = $derived(registry[name] ?? (registry[lightName] as ThemeDefinition));
	const persist = $derived(!parent && storageKey !== false ? storageKey : undefined);
	/** The first registered theme with the given darkness, or the first theme at all. */
	function first(themes: Record<string, ThemeDefinition>, isDark: boolean): string {
		const names = Object.keys(themes);
		return names.find((n) => themes[n]?.dark === isDark) ?? (names[0] as string);
	}

	const isChoice = (value: unknown): value is ThemeChoice =>
		value === 'system' || (typeof value === 'string' && Object.hasOwn(registry, value));

	// The server cannot read a stored choice and the first client render must match the server
	// HTML. The inline head script has already painted the stored theme, so <html> is only
	// touched after mount, once the stored choice is known.
	let mounted = $state(false);
	const fallback = untrack(() => theme ?? 'system');

	onMount(() => {
		if (persist) {
			try {
				const stored = localStorage.getItem(persist);
				if (isChoice(stored)) theme = stored;
			} catch {
				// Storage blocked (privacy mode, sandboxed iframe): keep the default.
			}
		}
		mounted = true;
		if (!parent) return () => document.documentElement.removeAttribute(THEME_ATTRIBUTE);
	});

	$effect(() => {
		if (mounted && !parent) document.documentElement.setAttribute(THEME_ATTRIBUTE, choice);
	});

	const head = $derived(
		parent
			? ''
			: themeHead(
					themeCss({ themes: registry, light: lightName, dark: darkName, fallback }),
					persist ? themeScript(persist, ['system', ...Object.keys(registry)]) : '',
					nonce
				)
	);

	const instance: ThemeInstance = {
		get choice() {
			return choice;
		},
		get name() {
			return name;
		},
		get current() {
			return current;
		},
		get isDark() {
			return current.dark;
		},
		get themes() {
			return registry;
		},
		get light() {
			return lightName;
		},
		get dark() {
			return darkName;
		},
		set(next) {
			if (!isChoice(next)) throw new Error(`[sveltier] unknown theme "${next}"`);
			theme = next;
			try {
				if (persist) localStorage.setItem(persist, next);
			} catch {
				// Not remembered, but the choice still applies to this page view.
			}
		},
		toggle() {
			instance.set(current.dark ? lightName : darkName);
		}
	};

	setThemeContext(instance);
</script>

<svelte:head>
	{#if head}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- generated from validated theme values -->
		{@html head}
	{/if}
</svelte:head>

{#if parent}
	<div
		bind:this={ref}
		{...rest}
		class={['sv-theme-provider', withBackground && 'sv-theme-provider--background', className]}
		data-sv-theme={choice}
	>
		{@render children?.()}
	</div>
{:else}
	{@render children?.()}
{/if}
