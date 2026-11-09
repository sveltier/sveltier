<script lang="ts">
	// The platform's file input, dressed as a field. See FileFieldProps for the props.
	import { DEV, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { createField } from '../../core/form/field.svelte.js';
	import { useLocale } from '../../core/locale/locale.js';
	import Field from '../Field/Field.svelte';
	import { accepts } from './accept.js';
	import './file-field.css';
	import type { FileFieldDefaults, FileFieldProps } from './types.js';

	let {
		variant,
		color,
		size,
		density,
		rounded,
		disabled,
		files = $bindable([]),
		onchange,
		accept,
		multiple = false,
		drop = false,
		label,
		hint,
		error,
		rules,
		validateOn,
		required = false,
		readonly = false,
		prepend,
		id,
		'aria-describedby': describedBy,
		class: className,
		style,
		ref = $bindable(null),
		...rest
	}: FileFieldProps = $props();

	const resolve = useDefaults<FileFieldDefaults>('FileField', {
		variant: 'outlined',
		color: 'primary',
		size: 'md',
		density: 'default',
		rounded: true,
		disabled: false
	});
	const p = $derived(resolve({ variant, color, size, density, rounded, disabled }));
	const locale = useLocale();
	const chosen = $derived(files ?? []);

	const field = createField<File[]>({
		value: () => chosen,
		empty: (list) => list.length === 0,
		check: (list) => {
			if (list.length === 0) return required ? locale.t('required') : undefined;
			// The chooser filters by accept; a dropped file is not filtered.
			if (accept && list.some((file) => !accepts(file, accept))) {
				return locale.t('fileType', { accept });
			}
			return undefined;
		},
		rules: () => rules,
		error: () => error,
		validateOn: () => validateOn,
		control: () => ref
	});

	if (DEV) $effect(() => warnUnnamed('FileField', ref));

	// Files set from code go into the input, so a form submits what the field shows.
	$effect(() => {
		const input = ref;
		if (!input) return;
		const current = input.files ? [...input.files] : [];
		if (current.length === chosen.length && current.every((file, at) => file === chosen[at])) {
			return;
		}
		const transfer = new DataTransfer();
		for (const file of chosen) transfer.items.add(file);
		input.files = transfer.files;
	});

	const names = $derived(
		chosen.length === 0
			? locale.t('noFile')
			: chosen.length === 1
				? chosen[0]!.name
				: locale.t('fileCount', { count: locale.formatNumber(chosen.length) })
	);

	// The user chose, dropped or cleared: the files follow the input.
	function changed(next: File[]) {
		files = next;
		field.changed();
		onchange?.(next);
	}

	function clear() {
		if (ref) ref.value = '';
		changed([]);
		ref?.focus();
	}

	// A file dragged over the box marks it. Read-only, the chooser and a drop do nothing.
	let over = $state(false);
	function dropped(event: DragEvent) {
		over = false;
		if (readonly) event.preventDefault();
	}

	// Leaving means focus went outside the field, not to its clear button.
	function leave(event: FocusEvent) {
		const root = event.currentTarget as HTMLElement;
		if (!root.contains(event.relatedTarget as Node | null)) field.left();
	}
</script>

<Field
	{...p}
	{id}
	{label}
	{hint}
	error={field.error}
	{required}
	{readonly}
	{prepend}
	class={['sv-file-field', drop && 'sv-file-field--drop', over && 'sv-file-field--over', className]}
	{style}
	onfocusout={leave}
>
	{#snippet children(attributes)}
		<!-- What the input stands for. The input says it to screen readers itself. -->
		<span class="sv-file-field__shown" aria-hidden="true">
			<span class="sv-file-field__choose">{locale.t(multiple ? 'chooseFiles' : 'chooseFile')}</span>
			{#if drop && chosen.length === 0}
				<span class="sv-file-field__drop">{locale.t(multiple ? 'dropFiles' : 'dropFile')}</span>
			{:else}
				<span class={['sv-file-field__names', chosen.length === 0 && 'sv-file-field__names--none']}
					>{names}</span
				>
			{/if}
		</span>
		<!-- The control: over the whole box, out of sight, so a press or a drop anywhere lands on it. -->
		<input
			bind:this={ref}
			{...rest}
			{...attributes}
			class={[attributes.class, 'sv-file-field__input']}
			aria-describedby={[describedBy, attributes['aria-describedby']].filter(Boolean).join(' ') ||
				undefined}
			type="file"
			{accept}
			{multiple}
			onclick={(event) => {
				if (readonly) event.preventDefault();
			}}
			onchange={(event) => changed([...(event.currentTarget.files ?? [])])}
			ondragenter={() => (over = !readonly && !p.disabled)}
			ondragleave={() => (over = false)}
			ondrop={dropped}
		/>
		{#if chosen.length > 0 && !readonly && !p.disabled}
			<button
				type="button"
				class="sv-file-field__clear"
				aria-label={locale.t(chosen.length > 1 ? 'clearFiles' : 'clearFile')}
				onclick={clear}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
			</button>
		{/if}
	{/snippet}
</Field>
