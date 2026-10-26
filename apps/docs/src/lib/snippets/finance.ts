// Code samples for the finance pages, shown as written and listed in llms.txt.

export const amountUsage = `<script lang="ts">
  import { Amount } from '@sveltier/ui';

  let { last, balance }: { last: number; balance: number } = $props();
</script>

<!-- A live price: two decimals, a flash of the up or down colour as it moves. -->
<Amount value={last} decimals={2} flash />

<!-- Money in the locale's currency, its fraction in the subtle colour. -->
<Amount value={balance} format={{ style: 'currency' }} dimFraction />`;

export const amountFormats = `<script lang="ts">
  import { Amount } from '@sveltier/ui';
</script>

<Amount value={0.00012345} />                                  <!-- 0.00012345 -->
<Amount value={61.2} decimals={2} />                           <!-- 61.20 -->
<Amount value={-639} />                                        <!-- −639, a true minus -->
<Amount value={18084} format={{ style: 'currency' }} />        <!-- $18,084.00 -->
<Amount value={1500} format={{ style: 'currency', currency: 'JPY' }} /> <!-- ¥1,500 -->
<Amount value={0.0125} format={{ style: 'percent' }} />        <!-- 1.25% -->
<Amount value={1.25} format={{ style: 'unit', unit: 'percent' }} /> <!-- 1.25%, already a percentage -->
<Amount value={1234567} format={{ notation: 'compact' }} />    <!-- 1.2M -->
<Amount value={null} />                                        <!-- — -->`;

export const amountPrivacy = `<script lang="ts">
  import { Amount, DefaultsProvider, Switch } from '@sveltier/ui';

  let { balance }: { balance: number } = $props();
  let hidden = $state(false);
</script>

<Switch label="Hide amounts" bind:checked={hidden} />

<!-- One switch for the whole section: every Amount and Delta inside shows ••••. -->
<DefaultsProvider defaults={{ Amount: { masked: hidden } }}>
  <Amount value={balance} format={{ style: 'currency' }} />
</DefaultsProvider>`;

export const deltaUsage = `<script lang="ts">
  import { Delta } from '@sveltier/ui';

  let { pnl, change }: { pnl: number; change: number } = $props();
</script>

<!-- +4,183.20 in the up colour, −639.00 in the down colour: the sign is always there. -->
<Delta value={pnl} decimals={2} />

<!-- A change in percent, with an arrow, flashing as it moves. -->
<Delta value={change} format={{ style: 'percent' }} arrow flash />`;

export const deltaInTable = `<script lang="ts">
  import { Amount, Delta, Table, type TableColumn } from '@sveltier/ui';

  type Quote = { symbol: string; last: number; change: number };
  let { quotes }: { quotes: Quote[] } = $props();

  const columns: TableColumn<Quote>[] = [
    { key: 'symbol', label: 'Symbol', rowHeader: true },
    { key: 'last', label: 'Last', sort: true, cell: last },
    { key: 'change', label: 'Change', sort: true, cell: change }
  ];
</script>

{#snippet last(quote: Quote)}
  <Amount value={quote.last} decimals={2} flash />
{/snippet}

{#snippet change(quote: Quote)}
  <Delta value={quote.change} format={{ style: 'percent' }} />
{/snippet}

<Table aria-label="Watchlist" {columns} items={quotes} itemKey="symbol" />`;
