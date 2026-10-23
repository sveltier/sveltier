<script lang="ts" module>
	import { createContext } from 'svelte';
	import type { ThemeChoice } from './theme.js';

	export interface ThemeSpikeContext {
		readonly choice: ThemeChoice | undefined;
		set(choice: ThemeChoice): void;
	}

	export const [getThemeSpike, setThemeSpike] = createContext<ThemeSpikeContext>();
</script>

<script lang="ts">
	// Prototype, replaced by the package ThemeProvider.
	import { onMount, type Snippet } from 'svelte';
	import { ATTRIBUTE, STORAGE_KEY, themeHead, themes } from './theme.js';

	let { children }: { children: Snippet } = $props();

	// `undefined` means "not known yet": the server cannot read localStorage, and the
	// first client render must match the server HTML. The inline head script has already
	// applied a stored choice to <html>, so nothing is touched until the choice is known.
	let choice = $state<ThemeChoice | undefined>(undefined);

	onMount(() => {
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(STORAGE_KEY);
		} catch {
			// Storage can be unavailable (privacy mode, sandboxed iframe). Fall back to system.
		}
		choice = stored !== null && stored in themes ? (stored as ThemeChoice) : 'system';
	});

	$effect(() => {
		if (choice === undefined) return;
		const root = document.documentElement;
		if (choice === 'system') root.removeAttribute(ATTRIBUTE);
		else root.setAttribute(ATTRIBUTE, choice);
	});

	setThemeSpike({
		get choice() {
			return choice;
		},
		set(next) {
			choice = next;
			try {
				if (next === 'system') localStorage.removeItem(STORAGE_KEY);
				else localStorage.setItem(STORAGE_KEY, next);
			} catch {
				// Not persisted; the choice still applies for this page view.
			}
		}
	});

	const head = themeHead();
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, generated from trusted theme config -->
	{@html head}
</svelte:head>

{@render children()}
