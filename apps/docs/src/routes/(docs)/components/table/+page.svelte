<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TableDemo from '#lib/docs/table/TableDemo.svelte';
	import {
		tableColumns,
		tableEmpty,
		tableLive,
		tableSort,
		tableUsage
	} from '#lib/snippets/components.js';
	import TABLE_COLUMN_ROWS from 'virtual:sveltier-api/TableColumnBase';
	import TABLE_PROPS from 'virtual:sveltier-api/TableProps';
</script>

<DocPage
	title="Table"
	lede="Items in rows and columns: a header that stays in view, numbers lined up at the end, and columns that sort from their header."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the rows as <code>items</code> and describe the <code>columns</code>. A column's
		<code>key</code> is a property of the items, so TypeScript checks it and the
		<code>format</code> function gets the value's own type. Name the table with a
		<code>caption</code> or <code>aria-label</code>.
	</p>
	<TableDemo />
	<Code title="Positions.svelte" code={tableUsage} />

	<h2 id="columns">Columns</h2>
	<p>
		A column shows a property of the items, named by <code>key</code>. A column named by
		<code>id</code> shows a <code>value</code> computed from each item, which it also sorts by, or
		content of its own in a <code>cell</code> snippet, such as a button. Any column can render its
		cells with <code>cell</code>, which receives the row's item.
	</p>
	<ul>
		<li>
			Numbers line up at the end, read from the column's first value; <code>align</code> says
			otherwise. A table that starts empty has nothing to read yet: give its number columns
			<code>align: 'end'</code>, so their headers stay put when the rows arrive. Figures are
			tabular, so digits stand in columns.
		</li>
		<li>
			A missing value (<code>null</code> or <code>undefined</code>) shows a dash, and
			<code>format</code> is only called for values that are there.
		</li>
		<li>
			Cells keep to one line; <code>wrap</code> lets a column of long text wrap.
			<code>width</code> sets a column's width.
		</li>
		<li>
			<code>rowHeader</code> makes a column's cells the headers of their rows, for the value that
			names a row. <code>hideLabel</code> keeps a header's text for screen readers only.
		</li>
	</ul>
	<Code title="OpenPositions.svelte" code={tableColumns} />

	<h2 id="sorting">Sorting</h2>
	<p>
		A column with <code>sort: true</code> sorts from its header: ascending, then descending, then
		back to the order of <code>items</code>. Numbers, dates and text compare as they should, text in
		the locale's order with numbers inside it read as numbers, and missing values go last either
		way. A function compares two items itself. Bind <code>sortBy</code> to start sorted or to keep
		the sort;
		<code>onsort</code> reports each change.
	</p>
	<Code title="Orders.svelte" code={tableSort} />

	<h2 id="live">Scrolling, live data and the current row</h2>
	<p>
		The table scrolls inside its own box. Give the box a <code>max-block-size</code> and the header
		stays at the top while the rows scroll under it. The box paints the surface colour so the header
		covers the rows; on another surface, set <code>--sv-table-background</code>.
	</p>
	<p>
		For items that arrive as fresh objects, as live data does, <code>itemKey</code> names the
		property that tells them apart, so each row keeps its element. <code>rowAttributes</code> adds
		attributes to an item's row; <code>aria-current</code> marks the row whose details show
		elsewhere, in the table's
		<code>color</code>.
	</p>
	<Code title="Watchlist.svelte" code={tableLive} />

	<h2 id="empty">Empty and loading</h2>
	<p>
		With no items the table says <q>No data</q>, from the locale's <code>noData</code> message, or
		what the <code>empty</code> snippet says. <code>loading</code> runs a bar along the top, marks
		the table busy and says <q>Loading</q> in place of the empty state.
	</p>
	<Code title="Payments.svelte" code={tableEmpty} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is a native <code>&lt;table&gt;</code>: headers have <code>scope="col"</code>, and
			<code>rowHeader</code> cells <code>scope="row"</code>, so screen readers announce a cell with
			its headers. Without a <code>caption</code>, <code>aria-label</code> or
			<code>aria-labelledby</code>, development builds warn.
		</li>
		<li>
			A sortable header is a button, reached with <kbd>Tab</kbd> and pressed with <kbd>Enter</kbd>
			or
			<kbd>Space</kbd>. The sorted column has <code>aria-sort</code>, so the direction is announced;
			the arrow is decoration.
		</li>
		<li>
			When the table overflows its box, the box becomes a region named like the table, with a place
			in the tab order, so the keyboard can scroll it. A table that fits adds no tab stop.
		</li>
		<li>The loading bar is hidden from assistive technology; the table's busy state is not.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Table props" rows={TABLE_PROPS} />
	<p>
		Every column takes a <code>label</code> and the options below. A key column adds
		<code>key</code> and <code>format</code>; an id column adds <code>id</code>, and
		<code>value</code> with <code>format</code>, or a <code>cell</code> on its own.
	</p>
	<ApiTable label="Column options" rows={TABLE_COLUMN_ROWS} />
</DocPage>
