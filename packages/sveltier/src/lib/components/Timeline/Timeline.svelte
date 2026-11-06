<script lang="ts" generics="T extends TimelineItem">
	// What happened to something, in time. See TimelineProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { useLocale } from '../../core/locale/locale.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import '../../styles/visually-hidden.css';
	import './timeline.css';
	import type { TimelineDefaults, TimelineItem, TimelineProps } from './types.js';

	let {
		color,
		density,
		items,
		timeFormat = { dateStyle: 'medium', timeStyle: 'short' },
		relative = false,
		item: content,
		class: className,
		ref = $bindable(null),
		...rest
	}: TimelineProps<T> = $props();

	const resolve = useDefaults<TimelineDefaults>('Timeline', {
		color: 'neutral',
		density: 'default'
	});
	const p = $derived(resolve({ color, density }));
	const locale = useLocale();

	/** The time as a Date, or undefined for none or a string that is not a date. */
	function toDate(time: TimelineItem['time']): Date | undefined {
		if (time == null) return undefined;
		const date = time instanceof Date ? time : new Date(time);
		return Number.isNaN(date.getTime()) ? undefined : date;
	}
</script>

<ol bind:this={ref} {...rest} class={['sv-timeline', sharedClasses(p, 'Timeline'), className]}>
	{#each items as event, index (event.id ?? index)}
		{@const date = toDate(event.time)}
		<li
			class={[
				'sv-timeline__event',
				event.color && `sv-color-${event.color}`,
				event.pending && 'sv-timeline__event--pending'
			]}
		>
			<span class="sv-timeline__marker" aria-hidden="true"></span>
			<div class="sv-timeline__body">
				{#if content}
					{@render content(event)}
				{:else}
					<div class="sv-timeline__title">
						{event.title}{#if event.pending}<span class="sv-visually-hidden"
								>, {locale.t('pending')}</span
							>{/if}
					</div>
					{#if date}
						<time
							class="sv-timeline__time"
							datetime={date.toISOString()}
							title={relative ? locale.formatDate(date, timeFormat) : undefined}
							>{relative ? locale.formatRelative(date) : locale.formatDate(date, timeFormat)}</time
						>
					{:else if event.time != null}
						<span class="sv-timeline__time">{event.time}</span>
					{/if}
					{#if event.description}<p class="sv-timeline__description">{event.description}</p>{/if}
				{/if}
			</div>
		</li>
	{/each}
</ol>
