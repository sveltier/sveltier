<script lang="ts">
	// What makes the code an agent writes come out right: one vocabulary, docs from the types,
	// errors that say how to fix, keyboard behaviour built in.
	import { Alert, Avatar, Button, Chip, SegmentedControl, Tabs, type Variant } from 'sveltier';
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
		<p class="landing-kicker">Built for AI agents</p>
		<h2 id="agents-title">Why agents get it right</h2>
		<p>
			An agent writes better code when the API is small, consistent and documented where it reads.
			These are design rules in Sveltier, not afterthoughts.
		</p>
	</header>

	<div class="landing-agents">
		<article class="landing-card">
			<h3>One vocabulary</h3>
			<p>
				<code>variant</code>, <code>size</code>, <code>density</code>, <code>color</code> and
				<code>rounded</code> mean the same thing on every component. Learned once, used everywhere.
			</p>
			<SegmentedControl options={VARIANTS} bind:value={variant} size="sm" aria-label="Variant" />
			<div class="landing-vocab">
				<Button {variant}>Button</Button>
				<Chip {variant}>Chip</Chip>
				<Avatar {variant}>AV</Avatar>
				<Alert {variant} type="info" density="compact">Alert</Alert>
			</div>
			<p class="landing-mono">variant="{variant}" on Button, Chip, Avatar and Alert</p>
		</article>

		<article class="landing-card">
			<h3>Docs written from the types</h3>
			<p>
				Every props table, and the <code>llms-full.txt</code> your agent reads, is generated from the
				TypeScript types at build time. The docs cannot drift from the API.
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
			<h3>Errors that say how to fix</h3>
			<p>
				When code breaks a rule, the message names the component, the rule and the fix, so an agent
				corrects itself on the next try.
			</p>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre
				class="landing-code landing-code--error"
				role="region"
				aria-label="Error message"
				tabindex="0"><code
					>[sveltier] Chip: a closable chip cannot also be a button or a link. Put the action in a Button next to it.</code
				></pre>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre class="landing-code" role="region" aria-label="The fix" tabindex="0"><code
					>&lt;Chip closable&gt;Filters&lt;/Chip&gt;
&lt;Button onclick=&#123;open&#125;&gt;Edit filters&lt;/Button&gt;</code
				></pre>
		</article>

		<article class="landing-card">
			<h3>Keyboard behaviour built in</h3>
			<p>
				Roles, focus and keys follow the WAI-ARIA Authoring Practices, tested in Chromium, Firefox
				and WebKit. Your agent does not have to remember them. Try the tabs:
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
