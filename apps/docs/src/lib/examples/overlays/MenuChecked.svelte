<script lang="ts">
	import { Button, Menu, type MenuAction, type MenuItem } from '@sveltier/ui';

	const LAYOUTS = [
		{ label: 'One chart', value: 'one' },
		{ label: 'Two side by side', value: 'columns' },
		{ label: 'Two stacked', value: 'rows' },
		{ label: 'Four charts', value: 'four' }
	];

	let layout = $state('one');
	let volume = $state(true);
	let grid = $state(false);

	// The items show the state; choosing one changes it.
	const items: MenuItem[] = $derived([
		{ heading: 'Layout' },
		...LAYOUTS.map((option) => ({ ...option, radio: true, checked: layout === option.value })),
		{ separator: true },
		{ label: 'Show volume', value: 'volume', checked: volume },
		{ label: 'Show grid', value: 'grid', checked: grid }
	]);

	function choose({ value }: MenuAction) {
		if (value === 'volume') volume = !volume;
		else if (value === 'grid') grid = !grid;
		else if (value) layout = value;
	}
</script>

<Menu {items} onselect={choose}>
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="outlined">Chart view</Button>
	{/snippet}
</Menu>
