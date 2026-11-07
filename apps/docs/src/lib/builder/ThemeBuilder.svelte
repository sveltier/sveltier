<script lang="ts">
	// Builds a theme over a pack: colours in OKLCH, corner radius and fonts, previewed on real
	// components in a scope that carries the theme, checked for contrast, exported as
	// defineTheme() code. The state lives in the URL hash, so a theme in progress is a link.
	import { goto } from '$app/navigation';
	import {
		Alert,
		Amount,
		Button,
		Card,
		Checkbox,
		Chip,
		Delta,
		NativeSelect,
		parseOklch,
		ProgressLinear,
		SegmentedControl,
		Slider,
		Switch,
		TextField
	} from '@sveltier/ui';
	import { onMount } from 'svelte';
	import Code from '../docs/Code.svelte';
	import { PACKS, type Mode, type PackId } from '../site.js';
	import {
		baseTheme,
		buildTheme,
		contrastRows,
		EDITABLE_COLORS,
		exportCode,
		FONT_ROLES,
		fontOptions,
		formatOklch,
		fromQuery,
		initialState,
		TEXT_CONTRAST,
		themeStyle,
		toQuery,
		type EditableColor,
		type FontRole
	} from './builder.js';

	let builder = $state(initialState());
	let editing = $state<EditableColor>('primary');
	let ready = $state(false);

	const base = $derived(baseTheme(builder));
	const theme = $derived(buildTheme(builder));
	const style = $derived(themeStyle(theme));
	const rows = $derived(contrastRows(theme));
	const code = $derived(exportCode(builder));
	const failures = $derived(
		rows.reduce(
			(count, row) =>
				count +
				[row.onBackground, row.onSurface, row.onRaised, row.label ?? Infinity].filter(
					(value) => value < TEXT_CONTRAST
				).length,
			0
		)
	);

	const packOptions = PACKS.map((pack) => ({ value: pack.id, label: pack.name }));
	const modeOptions = [
		{ value: 'light' as Mode, label: 'Light' },
		{ value: 'dark' as Mode, label: 'Dark' }
	];
	const fonts = fontOptions();
	const FONT_LABELS: Record<FontRole, string> = {
		'font-display': 'Display font',
		'font-ui': 'Interface font',
		'font-data': 'Figures font'
	};

	/** The colour being edited, as the theme has it now. */
	const value = $derived(theme.colors[editing] ?? '');
	const parts = $derived(parseOklch(value) ?? { l: 0.5, c: 0, h: 0, alpha: 1 });
	let typed = $state<string | null>(null);

	function setColor(name: EditableColor, next: string | undefined) {
		const colors = Object.fromEntries(
			Object.entries(builder.colors).filter(([key]) => key !== name)
		);
		builder.colors =
			next === undefined || next === base.colors[name] ? colors : { ...colors, [name]: next };
	}

	function setPart(part: 'l' | 'c' | 'h', next: number) {
		const { l, c, h } = parts;
		setColor(
			editing,
			formatOklch(part === 'l' ? next : l, part === 'c' ? next : c, part === 'h' ? next : h)
		);
		typed = null;
	}

	function setPack(pack: PackId) {
		builder = { ...builder, pack, colors: {}, fonts: {} };
	}

	function setMode(mode: Mode) {
		builder = { ...builder, mode, colors: {} };
	}

	function setFont(role: FontRole, stack: string | null) {
		const others = Object.fromEntries(
			Object.entries(builder.fonts).filter(([key]) => key !== role)
		);
		builder.fonts =
			!stack || stack === base.variables[role] ? others : { ...others, [role]: stack };
	}

	const hash = $derived.by(() => {
		const query = toQuery(builder);
		return query ? `#${query}` : '#';
	});

	function readHash() {
		if (location.hash === hash || location.hash === '') return;
		builder = fromQuery(location.hash.slice(1));
	}

	onMount(() => {
		readHash();
		ready = true;
	});

	// Writes the address only (a shallow navigation to the same page); no state of this component.
	$effect(() => {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- only the hash changes
		if (ready) void goto(hash === '#' ? location.pathname : hash, { shallow: true, replace: true });
	});

	const format = (ratio: number) => ratio.toFixed(2);
</script>

<svelte:window onhashchange={readHash} />

<div class="tb">
	<div class="tb-base">
		<NativeSelect
			label="Base theme"
			size="sm"
			options={packOptions}
			bind:value={() => builder.pack, (pack) => pack && setPack(pack)}
		/>
		<SegmentedControl
			aria-label="Mode"
			size="sm"
			options={modeOptions}
			bind:value={() => builder.mode, setMode}
		/>
		<Button variant="text" size="sm" onclick={() => (builder = initialState())}>Start over</Button>
	</div>

	<section
		class="tb-preview"
		{style}
		aria-label="Preview of the theme"
		data-testid="builder-preview"
	>
		<Card title="Portfolio" subtitle="All accounts">
			<div class="tb-figure">
				<Amount value={1284503.5} format={{ style: 'currency' }} />
			</div>
			<div class="tb-row">
				<Delta value={4183.2} decimals={2} />
				<Delta value={-639} decimals={2} />
			</div>
			<ProgressLinear value={62} label="Allocated" />
			{#snippet actions()}
				<Button>Deposit</Button>
				<Button variant="tonal">Withdraw</Button>
			{/snippet}
		</Card>
		<Card title="New order" variant="outlined">
			<TextField label="Quantity" value="100" />
			<Slider label="Risk level" value={40} />
			<Switch label="Price alerts" checked />
			<Checkbox label="I have read the key information" checked />
			{#snippet actions()}
				<Button color="up">Buy</Button>
				<Button color="down" variant="outlined">Sell</Button>
			{/snippet}
		</Card>
		<div class="tb-row tb-wide">
			<Chip color="success">Filled</Chip>
			<Chip color="warning">Partial</Chip>
			<Chip color="error">Rejected</Chip>
			<Chip color="info">Queued</Chip>
			<Chip color="primary" variant="flat">Selected</Chip>
		</div>
		<Alert class="tb-wide" type="info" title="Market closes at 16:00">
			Orders placed after the close are queued for the next session.
		</Alert>
	</section>

	<h2 id="colours">Colours</h2>
	<div class="tb-swatches" role="group" aria-label="Colour to edit">
		{#each EDITABLE_COLORS as name (name)}
			<button
				type="button"
				class="tb-swatch"
				aria-pressed={editing === name}
				onclick={() => {
					editing = name;
					typed = null;
				}}
			>
				<span class="tb-swatch__chip" style:background-color={theme.colors[name]}></span>
				{name}{#if builder.colors[name]}<span class="tb-swatch__edited" aria-label="changed">•</span
					>{/if}
			</button>
		{/each}
	</div>
	<div class="tb-editor">
		<Slider
			label="Lightness"
			min={0}
			max={1}
			step={0.01}
			bind:value={() => parts.l, (next) => setPart('l', next)}
		/>
		<Slider
			label="Chroma"
			min={0}
			max={0.37}
			step={0.005}
			bind:value={() => parts.c, (next) => setPart('c', next)}
		/>
		<Slider
			label="Hue"
			min={0}
			max={360}
			step={1}
			bind:value={() => parts.h, (next) => setPart('h', next)}
		/>
		<TextField
			label="{editing} in OKLCH"
			size="sm"
			error={typed !== null && !parseOklch(typed)
				? 'Write oklch(L C H), such as oklch(0.55 0.16 255).'
				: undefined}
			bind:value={
				() => typed ?? value,
				(text) => {
					typed = text;
					if (parseOklch(text)) setColor(editing, text.trim());
				}
			}
		/>
		<Button
			variant="text"
			size="sm"
			disabled={!builder.colors[editing]}
			onclick={() => {
				setColor(editing, undefined);
				typed = null;
			}}>Reset {editing}</Button
		>
	</div>
	<p class="tb-note">
		Each colour you change gets its <code>on-</code> colour computed for text on a fill of it.
	</p>

	<h2 id="shape-type">Shape and type</h2>
	<div class="tb-editor">
		<Slider
			label="Corner radius ×"
			min={0}
			max={2}
			step={0.25}
			bind:value={() => builder.radius, (radius) => (builder.radius = radius)}
		/>
		{#each FONT_ROLES as role (role)}
			<NativeSelect
				label={FONT_LABELS[role]}
				size="sm"
				options={fonts}
				bind:value={
					() => builder.fonts[role] ?? String(base.variables[role]), (stack) => setFont(role, stack)
				}
			/>
		{/each}
	</div>
	<p class="tb-note">
		The docs load every pack's fonts. In your app, install the ones you pick, as shown in Fonts.
	</p>

	<h2 id="contrast">Contrast</h2>
	<p aria-live="polite">
		{failures === 0
			? 'Every pair reaches 4.5:1, as the built-in themes do.'
			: `${failures} ${failures === 1 ? 'pair is' : 'pairs are'} under 4.5:1.`}
	</p>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="docs-table-scroll" role="region" aria-label="Contrast ratios" tabindex="0">
		<table class="docs-api tb-contrast">
			<thead>
				<tr>
					<th scope="col">Colour</th>
					<th scope="col">On background</th>
					<th scope="col">On surface</th>
					<th scope="col">On raised</th>
					<th scope="col">Label on fill</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.color)}
					<tr>
						<th scope="row"><code>{row.color}</code></th>
						{#each [row.onBackground, row.onSurface, row.onRaised, row.label] as ratio, index (index)}
							<td class={[ratio !== undefined && ratio < TEXT_CONTRAST && 'tb-fail']}>
								{#if ratio === undefined}
									—
								{:else if ratio < TEXT_CONTRAST}
									{format(ratio)} <span class="tb-fail__word">low</span>
								{:else}
									{format(ratio)}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id="export">Export</h2>
	<p>Paste it into your app and register it on the provider.</p>
	<Code title="theme.ts" lang="ts" {code} />
</div>

<style>
	.tb {
		display: grid;
		gap: var(--sv-space-21);
	}

	.tb > :global(h2) {
		margin-block-end: 0;
	}

	.tb-base {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sv-space-13) var(--sv-space-21);
		align-items: end;
	}

	.tb-base > :global(:first-child) {
		inline-size: min(100%, 13rem);
	}

	.tb-preview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
		gap: var(--sv-space-21);
		padding: var(--sv-space-21);
		border: var(--sv-hairline) solid var(--sv-color-border);
		border-radius: min(var(--sv-radius-lg), var(--sv-radius-xl));
		color: var(--sv-color-text);
		font-family: var(--sv-font-ui);
		background-color: var(--sv-color-background);
	}

	.tb-preview :global(.tb-wide),
	.tb-wide {
		grid-column: 1 / -1;
	}

	.tb-figure {
		font-family: var(--sv-font-display);
		font-size: var(--sv-text-xl);
		font-weight: var(--sv-weight-display);
		letter-spacing: var(--sv-tracking-display);
	}

	.tb-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sv-space-8) var(--sv-space-13);
		align-items: center;
	}

	.tb-swatches {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sv-space-8);
	}

	.tb-swatch {
		display: inline-flex;
		gap: var(--sv-space-5);
		align-items: center;
		padding: var(--sv-space-3) var(--sv-space-8);
		border: var(--sv-hairline) solid var(--sv-color-border);
		border-radius: var(--sv-radius-full);
		color: var(--sv-color-text);
		font: inherit;
		font-size: var(--sv-text-sm);
		background-color: var(--sv-color-surface);
		cursor: pointer;
	}

	.tb-swatch[aria-pressed='true'] {
		border-color: var(--sv-color-text);
		box-shadow: inset 0 0 0 var(--sv-hairline) var(--sv-color-text);
	}

	.tb-swatch__chip {
		inline-size: 1em;
		block-size: 1em;
		border: var(--sv-hairline) solid var(--sv-color-border-strong);
		border-radius: 50%;
	}

	.tb-swatch__edited {
		color: var(--sv-color-primary);
	}

	.tb-editor {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr));
		gap: var(--sv-space-13) var(--sv-space-21);
		align-items: end;
	}

	.tb-note {
		margin: 0;
		color: var(--sv-color-text-muted);
		font-size: var(--sv-text-sm);
	}

	.tb-contrast td {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.tb-fail {
		color: var(--sv-color-error);
		font-weight: var(--sv-weight-semibold);
	}

	.tb-fail__word {
		font-size: var(--sv-text-xs);
		text-transform: uppercase;
	}
</style>
