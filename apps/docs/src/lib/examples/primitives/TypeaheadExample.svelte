<script>
	import { rovingFocus, typeahead } from '@sveltier/ui';
</script>

<ul
	role="listbox"
	aria-label="Currency"
	{@attach rovingFocus({ orientation: 'vertical' })}
	{@attach typeahead()}
>
	<li role="option" data-sv-item aria-selected="true">Euro</li>
	<li role="option" data-sv-item aria-selected="false">Pound sterling</li>
	…
</ul>
