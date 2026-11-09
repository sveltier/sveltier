<script lang="ts">
	import { Table, type TableColumn } from '@sveltier/ui';

	type Quote = {
		venue: string;
		bid: number;
		ask: number;
		fee: number;
		depth: number;
		latency: number;
	};

	const QUOTES: Quote[] = [
		{ venue: 'Northgate', bid: 1.08412, ask: 1.08418, fee: 0.2, depth: 4.2, latency: 12 },
		{ venue: 'Harbour', bid: 1.0841, ask: 1.08419, fee: 0.15, depth: 2.8, latency: 18 },
		{ venue: 'Meridian', bid: 1.08414, ask: 1.08421, fee: 0.25, depth: 6.1, latency: 9 }
	];

	// The venue names each row, and stays in view while the figures scroll across a narrow screen.
	const columns: TableColumn<Quote>[] = [
		{ key: 'venue', label: 'Venue', rowHeader: true, pinned: true },
		{ key: 'bid', label: 'Bid', format: (bid) => bid.toFixed(5) },
		{ key: 'ask', label: 'Ask', format: (ask) => ask.toFixed(5) },
		{
			id: 'spread',
			label: 'Spread',
			value: (quote) => (quote.ask - quote.bid) * 1e4,
			format: (pips: number) => `${pips.toFixed(1)} pips`
		},
		{ key: 'fee', label: 'Fee', format: (fee) => `${fee.toFixed(2)} bp` },
		{ key: 'depth', label: 'Depth', format: (depth) => `${depth.toFixed(1)}M` },
		{ key: 'latency', label: 'Latency', format: (ms) => `${ms} ms` }
	];
</script>

<Table caption="Venues" {columns} items={QUOTES} itemKey="venue" />
