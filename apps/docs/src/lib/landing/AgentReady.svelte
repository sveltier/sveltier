<script lang="ts">
	// How Sveltier meets the way coding agents work: they find what they need in the package,
	// get it right the first time through types, fix themselves from coded errors, and get
	// keyboard and ARIA behaviour without being asked.
	import { Alert, Avatar, Button, Chip, SegmentedControl, Tabs, type Variant } from '@sveltier/ui';
	import BUTTON_PROPS from 'virtual:sveltier-api/ButtonProps';

	const VARIANTS = (['elevated', 'flat', 'tonal', 'outlined', 'text'] as const).map((value) => ({
		value,
		label: value
	}));
	const SHARED = ['variant', 'size', 'density', 'color', 'rounded'];
	const rows = BUTTON_PROPS.filter((row) => SHARED.includes(row.name));
	const KEYS = [
		{ value: 'arrows', label: 'Arrows' },
		{ value: 'home', label: 'Home' },
		{ value: 'end', label: 'End' }
	] as const;

	let variant = $state<Variant>('tonal');
	let key = $state<(typeof KEYS)[number]['value']>('arrows');

	const cell = (text: string) => text.replace(/\|/g, '\\|');
</script>

<section class="landing-section" aria-labelledby="agents-title">
	<header class="landing-head">
		<p class="landing-kicker">Built for coding agents</p>
		<h2 id="agents-title">Find it, get it right, fix it</h2>
		<p>
			Agents do not remember your library, cannot see the screen, and learn by running and fixing.
			Sveltier is designed around all three, and the same choices help every developer.
		</p>
	</header>

	<div class="landing-agents">
		<article class="landing-card">
			<h3>Finds the right information</h3>
			<p>
				Every props table, <code>llms.txt</code> and <code>llms-full.txt</code> is generated from the
				TypeScript types, and the typed sources ship in the package. An agent reads the API of the version
				it installed, not a guess from its training data.
			</p>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre class="landing-code" role="region" aria-label="llms-full.txt excerpt" tabindex="0"><code
					>### Button
| Prop | Type | Default |
| --- | --- | --- |
{#each rows as row (row.name)}| `{row.name}` | `{cell(row.type)}` | {row.default
							? `\`${row.default}\``
							: ''} |
					{/each}</code
				></pre>
		</article>

		<article class="landing-card">
			<h3>Gets it right the first time</h3>
			<p>
				<code>variant</code>, <code>size</code>, <code>density</code>, <code>color</code> and
				<code>rounded</code> mean the same thing on every component, as literal types: a value that does
				not exist is a type error that lists the ones that do.
			</p>
			<SegmentedControl options={VARIANTS} bind:value={variant} size="sm" aria-label="Variant" />
			<div class="landing-vocab">
				<Button {variant}>Button</Button>
				<Chip {variant}>Chip</Chip>
				<Avatar {variant}>AV</Avatar>
				<Alert {variant} type="info" density="compact">Alert</Alert>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre
				class="landing-code landing-code--error"
				role="region"
				aria-label="Type error"
				tabindex="0"><code
					>&lt;Button variant="primary"&gt;
Type '"primary"' is not assignable to type '"text" | "flat" | "elevated" | "tonal" | "outlined" | "plain" | undefined'.</code
				></pre>
		</article>

		<article class="landing-card">
			<h3>Fixes itself when wrong</h3>
			<p>
				Every error has a stable code, says what happened and what to do, and links to its entry in
				the docs. The agent reads it once and corrects the next attempt.
			</p>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre
				class="landing-code landing-code--error"
				role="region"
				aria-label="Error message"
				tabindex="0"><code
					>[sveltier SV4001] Chip: a closable chip cannot also be a button or a link, since its close button would sit inside it. Put the action in a Button next to the chip. https://sveltier.com/errors#SV4001</code
				></pre>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre class="landing-code" role="region" aria-label="The fix" tabindex="0"><code
					>&lt;Chip closable&gt;Filters&lt;/Chip&gt;
&lt;Button onclick=&#123;open&#125;&gt;Edit filters&lt;/Button&gt;</code
				></pre>
		</article>

		<article class="landing-card">
			<h3>Accessible without being asked</h3>
			<p>
				Roles, focus and keys follow the WAI-ARIA Authoring Practices, tested in Chromium, Firefox
				and WebKit. The agent never has to remember them. Try the tabs:
			</p>
			<Tabs items={KEYS} bind:value={key} aria-label="Keyboard">
				{#snippet panel(item)}
					<p class="landing-keys">
						{#if item.value === 'arrows'}
							<kbd>←</kbd> <kbd>→</kbd> move between tabs, and the selection follows focus.
						{:else if item.value === 'home'}
							<kbd>Home</kbd> jumps to the first tab.
						{:else}
							<kbd>End</kbd> jumps to the last tab.
						{/if}
					</p>
				{/snippet}
			</Tabs>
		</article>
	</div>
</section>
