<script lang="ts">
	// Buttons joined into one control. See ButtonGroupProps for the props.
	import {
		getDefaultsContext,
		mergeDefaults,
		setDefaultsContext,
		useDefaults
	} from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './button-group.css';
	import type { ButtonGroupDefaults, ButtonGroupProps } from './types.js';

	let {
		variant,
		size,
		density,
		color,
		rounded,
		children,
		class: className,
		ref = $bindable(null),
		...rest
	}: ButtonGroupProps = $props();

	const resolve = useDefaults<ButtonGroupDefaults>('ButtonGroup', {
		variant: 'outlined',
		size: 'md',
		density: 'default',
		color: 'primary',
		rounded: true
	});
	const p = $derived(resolve({ variant, size, density, color, rounded }));

	// The Buttons inside take the group's props as their defaults, so their own props still win.
	const parent = getDefaultsContext();
	const merged = $derived(
		mergeDefaults(parent?.config, {
			Button: {
				variant: p.variant,
				size: p.size,
				density: p.density,
				color: p.color,
				rounded: p.rounded
			}
		})
	);
	setDefaultsContext({
		get config() {
			return merged;
		}
	});
</script>

<div
	bind:this={ref}
	{...rest}
	role="group"
	class={['sv-button-group', sharedClasses({ rounded: p.rounded }), className]}
>
	{@render children?.()}
</div>
