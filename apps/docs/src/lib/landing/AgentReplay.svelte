<script lang="ts">
	// A scripted replay of an agent building UI with Sveltier: the prompt types out, the steps tick
	// by, the source streams in and the real component appears behind fading skeleton bands.
	// Server-rendered finished; with motion allowed, CSS shows the start state until hydration.
	import { onMount } from 'svelte';
	import { Button, Icon, ProgressCircular, SegmentedControl, ThemeProvider } from 'sveltier';
	import { PACKS, type Mode, type PackId } from '../site.js';
	import { EXAMPLES, type ExampleId } from './examples/index.js';
	import { highlight } from './highlight.js';

	const DURATION = 9000;
	const PROMPT_END = 0.22;
	/** Start and end of each step, as fractions of the replay. */
	const STEPS: ReadonlyArray<readonly [number, number]> = [
		[0.22, 0.32],
		[0.32, 0.41],
		[0.41, 0.9],
		[0.9, 1]
	];
	const CODE = STEPS[2]!;
	const BANDS = 6;
	const CHECK = 'M3.5 12.6 5.3 10.8l4.1 4.1 9.3-9.3 1.8 1.8L9.4 18.5z';
	const REPLAY = 'M12 4V1L7 5.5 12 10V6.5a5.5 5.5 0 1 1-5.5 5.5H4.5A7.5 7.5 0 1 0 12 4.5z';

	const exampleOptions = EXAMPLES.map((item) => ({ value: item.id, label: item.label }));
	const packOptions = PACKS.map((item) => ({ value: item.id, label: item.name }));
	const modeOptions: Array<{ value: Mode; label: string }> = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];

	let exampleId = $state<ExampleId>('portfolio');
	let pack = $state<PackId>('monolith');
	let mode = $state<Mode>('light');
	/** Position in the replay, 0 to 1. Finished on the server and under reduced motion. */
	let t = $state(1);
	let live = $state(false);
	let root: HTMLDivElement | undefined = $state();
	let codeView: HTMLPreElement | undefined = $state();

	const example = $derived(EXAMPLES.find((item) => item.id === exampleId) ?? EXAMPLES[0]!);
	const lines = $derived(highlight(example.source));
	const progress = (from: number, to: number) => Math.min(1, Math.max(0, (t - from) / (to - from)));
	const typed = $derived(
		example.prompt.slice(0, Math.round(progress(0, PROMPT_END) * example.prompt.length))
	);
	const shown = $derived(
		t >= 1 ? lines.length : Math.ceil(progress(CODE[0], CODE[1]) * lines.length)
	);
	const bandsOut = $derived(t >= CODE[1] ? BANDS : Math.floor(progress(CODE[0], CODE[1]) * BANDS));
	const steps = $derived([
		{ active: 'Reading llms-full.txt', done: 'Read llms-full.txt: props of every component' },
		{ active: 'Choosing components', done: `Chose ${example.picks}` },
		{ active: `Writing ${example.file}`, done: `Wrote ${example.file}, ${lines.length} lines` },
		{ active: 'Type-checking', done: 'svelte-check: 0 errors' }
	]);

	function stateOf(index: number): 'waiting' | 'active' | 'done' {
		const [from, to] = STEPS[index]!;
		return t >= to ? 'done' : t >= from ? 'active' : 'waiting';
	}

	let frame = 0;
	let started = 0;
	let elapsed = 0;
	let visible = true;
	let reduce = false;

	function tick(now: number) {
		t = Math.min(1, (elapsed + now - started) / DURATION);
		if (t < 1) frame = requestAnimationFrame(tick);
	}

	function play() {
		cancelAnimationFrame(frame);
		if (reduce) {
			t = 1;
			return;
		}
		elapsed = 0;
		t = 0;
		if (codeView) codeView.scrollTop = 0;
		if (visible) resume();
	}

	function pause() {
		if (t >= 1) return;
		cancelAnimationFrame(frame);
		elapsed += performance.now() - started;
	}

	function resume() {
		if (t >= 1 || reduce) return;
		started = performance.now();
		frame = requestAnimationFrame(tick);
	}

	// Keep the newest line in view while the source streams in.
	$effect(() => {
		const count = shown;
		if (!codeView || t >= 1 || count === 0) return;
		const line = codeView.querySelectorAll<HTMLElement>('.replay__line')[count - 1];
		if (!line) return;
		const bottom = line.offsetTop + line.offsetHeight - codeView.clientHeight + 13;
		if (bottom > codeView.scrollTop) codeView.scrollTop = bottom;
	});

	onMount(() => {
		reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		live = true;
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry?.isIntersecting ?? true;
				if (visible) resume();
				else pause();
			},
			{ threshold: 0.15 }
		);
		if (root) observer.observe(root);
		play();
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
</script>

<div class="replay" data-live={live || undefined} bind:this={root}>
	<div class="replay__bar">
		<span class="replay__dots" aria-hidden="true"><i></i><i></i><i></i></span>
		<span class="replay__title">Agent session</span>
		<span class="replay__tag">Scripted replay</span>
		<Button variant="text" size="sm" onclick={play}>
			{#snippet prepend()}<Icon path={REPLAY} />{/snippet}
			Replay
		</Button>
	</div>

	<div class="replay__examples">
		<SegmentedControl
			options={exampleOptions}
			bind:value={exampleId}
			onchange={play}
			size="sm"
			aria-label="Example"
		/>
	</div>

	<div class="replay__prompt">
		<span class="replay__who">You</span>
		<p>
			<span class="docs-visually-hidden">{example.prompt}</span>
			<span class="replay__ghost" aria-hidden="true">{example.prompt}</span>
			<span class="replay__typed" aria-hidden="true"
				>{typed}<span class="replay__caret" class:is-done={t >= PROMPT_END}></span></span
			>
		</p>
	</div>

	<ol class="replay__steps" aria-label="Agent steps">
		{#each steps as step, index (index)}
			{@const state = stateOf(index)}
			<li class="replay__step" data-state={state}>
				<span class="replay__step-icon">
					{#if state === 'active'}
						<ProgressCircular indeterminate size="xs" label={step.active} />
					{:else if state === 'done'}
						<Icon path={CHECK} />
					{/if}
				</span>
				<span>{state === 'done' ? step.done : step.active}</span>
			</li>
		{/each}
	</ol>

	<div class="replay__work">
		<div class="replay__code">
			<div class="replay__file" id="replay-file">{example.file}</div>
			<!-- Scrollable regions must be keyboard-reachable (WCAG 2.1.1). -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<pre bind:this={codeView} role="region" aria-labelledby="replay-file" tabindex="0"><code
					>{#each lines as line, index (index)}<span
							class="replay__line"
							class:is-in={index < shown}
							>{#each line as token, k (k)}<span class="tok-{token.kind}">{token.text}</span>{/each}
</span>{/each}</code
				></pre>
		</div>
		<div class="replay__preview">
			<ThemeProvider theme="{pack}-{mode}" withBackground class="replay__frame">
				<div class="replay__render">
					{#key example.id}<example.component />{/key}
				</div>
				<div class="replay__bands" aria-hidden="true">
					{#each { length: BANDS }, index (index)}
						<span class="replay__band" class:is-out={index < bandsOut}></span>
					{/each}
				</div>
			</ThemeProvider>
		</div>
	</div>

	<div class="replay__controls">
		<div class="replay__scroll">
			<SegmentedControl
				options={packOptions}
				bind:value={pack}
				size="sm"
				aria-label="Design language"
			/>
		</div>
		<SegmentedControl options={modeOptions} bind:value={mode} size="sm" aria-label="Preview mode" />
	</div>
</div>
