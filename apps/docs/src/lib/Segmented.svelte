<script lang="ts" generics="T extends string">
	// Docs-only segmented radio group, until the library ships SegmentedControl.
	interface Option {
		value: T;
		label: string;
	}

	let {
		label,
		name,
		options,
		value,
		onchange
	}: {
		label: string;
		name: string;
		options: Option[];
		value: T | undefined;
		onchange: (value: T) => void;
	} = $props();

	const index = $derived(options.findIndex((option) => option.value === value));
</script>

<fieldset class="docs-seg" style:--n={options.length} style:--i={Math.max(0, index)}>
	<legend class="docs-visually-hidden">{label}</legend>
	<span class="docs-seg__thumb" class:docs-seg__thumb--hidden={index < 0} aria-hidden="true"></span>
	{#each options as option (option.value)}
		<label>
			<input
				type="radio"
				{name}
				value={option.value}
				checked={option.value === value}
				onchange={() => onchange(option.value)}
			/>
			<span>{option.label}</span>
		</label>
	{/each}
</fieldset>
