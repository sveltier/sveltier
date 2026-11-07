<script lang="ts">
	// One component, its props as controls, the live preview and the matching code. The state
	// lives in the URL hash (#Button?variant=tonal), so a configuration is a link.
	import { goto } from '$app/navigation';
	import { NativeSelect, NumberField, Select, Switch, TextField } from '@sveltier/ui';
	import { createRawSnippet, onMount } from 'svelte';
	import Code from '../docs/Code.svelte';
	import { pageHref } from '../docs/href.js';
	import {
		codeFor,
		fromQuery,
		optionText,
		optionValue,
		toQuery,
		type Control,
		type Value
	} from './controls.js';
	import { ENTRIES, findEntry } from './entries.js';

	const first = findEntry(undefined);
	let entry = $state(first);
	let values = $state<Record<string, Value>>({ ...first.initial });
	let content = $state(first.content ?? '');
	let ready = $state(false);

	const items = ENTRIES.map((item) => ({ value: item.name, label: item.name, group: item.group }));

	function pick(name: string, query = '') {
		const next = findEntry(name);
		entry = next;
		values = { ...next.initial, ...fromQuery(next.controls, query) };
		content = new URLSearchParams(query).get('content') ?? next.content ?? '';
	}

	function set(name: string, value: Value | undefined) {
		const rest = Object.entries(values).filter(([key]) => key !== name);
		values = Object.fromEntries(value === undefined ? rest : [...rest, [name, value]]);
	}

	/** The value a control shows: the one set here, or the component's default. */
	const current = (control: Control): Value | undefined => values[control.name] ?? control.fallback;

	const escapeHtml = (text: string) =>
		text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

	const children = $derived.by(() => {
		if (entry.content === undefined || content === '') return undefined;
		const html = `<span>${escapeHtml(content)}</span>`;
		return createRawSnippet(() => ({ render: () => html }));
	});

	const code = $derived(
		codeFor(entry.name, entry.controls, values, entry.content === undefined ? undefined : content)
	);

	const hash = $derived.by(() => {
		const edited = entry.content !== undefined && content !== entry.content;
		const query = [
			toQuery(entry.controls, values),
			edited ? `content=${encodeURIComponent(content)}` : ''
		]
			.filter(Boolean)
			.join('&');
		return `#${entry.name}${query ? `?${query}` : ''}`;
	});

	/** Applies the configuration in the address, if it holds one. */
	function readHash() {
		if (location.hash === hash) return;
		const [name, query = ''] = location.hash.slice(1).split('?');
		if (name) pick(decodeURIComponent(name), query);
	}

	onMount(() => {
		readHash();
		ready = true;
	});

	// Writes the address only (a shallow navigation to the same page); no state of this component.
	$effect(() => {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- only the hash changes
		if (ready) void goto(hash, { shallow: true, replace: true });
	});
</script>

<svelte:window onhashchange={readHash} />

<div class="pg">
	<div class="pg-head">
		<Select
			label="Component"
			size="sm"
			{items}
			bind:value={() => entry.name, (name) => name && pick(name)}
		/>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- pageHref() calls resolve() -->
		<a class="pg-docs" href={pageHref(entry.path)}>{entry.name} docs</a>
	</div>

	<div class="pg-stage" data-testid="playground-preview">
		{#key entry.name}
			<entry.component {...values} {children} class={entry.frame} />
		{/key}
	</div>

	<fieldset class="pg-controls">
		<legend class="docs-visually-hidden">{entry.name} props</legend>
		{#if entry.content !== undefined}
			<TextField label="children" size="sm" density="compact" bind:value={content} />
		{/if}
		{#each entry.controls as control (control.name)}
			{#if control.kind === 'select'}
				<NativeSelect
					label={control.name}
					size="sm"
					density="compact"
					placeholder={control.fallback === undefined ? 'Not set' : undefined}
					options={control.options.map((option) => ({
						value: optionText(option),
						label: optionText(option)
					}))}
					bind:value={
						() => {
							const value = current(control);
							return value === undefined ? null : optionText(value);
						},
						(text) => set(control.name, text === null ? undefined : optionValue(control, text))
					}
				/>
			{:else if control.kind === 'switch'}
				<Switch
					label={control.name}
					size="sm"
					density="compact"
					bind:checked={() => current(control) === true, (checked) => set(control.name, checked)}
				/>
			{:else if control.kind === 'text'}
				<TextField
					label={control.name}
					size="sm"
					density="compact"
					bind:value={
						() => String(current(control) ?? ''),
						(text) => set(control.name, text === '' ? undefined : text)
					}
				/>
			{:else}
				<NumberField
					label={control.name}
					size="sm"
					density="compact"
					bind:value={
						() => {
							const value = current(control);
							return typeof value === 'number' ? value : null;
						},
						(number) => set(control.name, number ?? undefined)
					}
				/>
			{/if}
		{/each}
	</fieldset>

	<Code title="{entry.name}.svelte" {code} />
</div>

<style>
	.pg {
		display: grid;
		gap: var(--sv-space-21);
	}

	.pg-head {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sv-space-13) var(--sv-space-21);
		align-items: end;
		justify-content: space-between;
	}

	.pg-head > :global(:first-child) {
		inline-size: min(100%, 16rem);
	}

	.pg-docs {
		padding-block-end: var(--sv-space-5);
		font-size: var(--sv-text-sm);
	}

	.pg-stage {
		position: relative;
		isolation: isolate;
		display: grid;
		place-items: center;
		min-block-size: 13rem;
		padding: var(--sv-space-34) var(--sv-space-21);
		overflow: hidden;
		border: var(--sv-hairline) solid var(--sv-color-border);
		border-radius: min(var(--sv-radius-lg), var(--sv-radius-xl));
		background-color: var(--sv-color-surface);
	}

	.pg-stage :global(.pg-frame-wide) {
		inline-size: min(100%, 24rem);
	}

	.pg-stage :global(.pg-frame-figure) {
		font-size: var(--sv-text-xl);
	}

	.pg-stage :global(.pg-frame-fill) {
		position: absolute;
		inset: 0;
		z-index: -1;
	}

	.pg-controls {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 11rem), 1fr));
		gap: var(--sv-space-13) var(--sv-space-21);
		align-items: end;
		margin: 0;
		padding: 0;
		border: 0;
	}
</style>
