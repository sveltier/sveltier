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

export const priceInputUsage = `<script lang="ts">
  import { PriceInput } from '@sveltier/ui';

  let limit = $state<number | null>(null);
  let price = $state<number | null>(null);
</script>

<!-- A fixed tick: two decimals, the arrow keys move by 0.01, 61.234 is an error. -->
<PriceInput label="Limit price" tick={0.01} required bind:value={limit} />

<!-- Ticks that change with the price: 10 below 10,000, 50 up to 50,000, then 100. -->
<PriceInput
  label="Price"
  tick={[
    { from: 0, step: 10 },
    { from: 10000, step: 50 },
    { from: 50000, step: 100 }
  ]}
  bind:value={price}
/>`;

export const amountInputUsage = `<script lang="ts">
  import { AmountInput } from '@sveltier/ui';

  let { available }: { available: number } = $props();
  let quantity = $state<number | null>(null);
</script>

<!-- Lots of 100 out of what is available: 50% of 2,350 sets 1,100. -->
<AmountInput
  label="Quantity"
  step={100}
  min={100}
  max={available}
  required
  bind:value={quantity}
/>`;

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

export const secureMaskUsage = `<script lang="ts">
  import { SecureMask } from '@sveltier/ui';
</script>

<!-- "•••• 3000", with a button that shows the whole IBAN for 30 seconds. -->
<SecureMask label="IBAN" value="DE89370400440532013000" toggle hideAfter={30000} />`;

export const secureMaskFetch = `<script lang="ts">
  import { SecureMask } from '@sveltier/ui';

  // The page loads only the last digits; the whole number is fetched when the user asks.
  let { last4, loadNumber }: { last4: string; loadNumber: () => Promise<string> } = $props();
  let revealed = $state(false);
  let number = $state<string>();

  $effect(() => {
    if (revealed && number === undefined) loadNumber().then((full) => (number = full));
  });
</script>

<SecureMask label="Card number" value={revealed && number ? number : last4} toggle bind:revealed />`;

export const ledgerUsage = `<script lang="ts">
  import { Ledger, LedgerRow } from '@sveltier/ui';

  const money = { style: 'currency' } as const;
</script>

<Ledger>
  <LedgerRow label="Market value" value={18084} format={money} />
  <LedgerRow label="Cash" value={2510.4} format={money} />
  <LedgerRow label="Settles">Nov 9</LedgerRow>
  <LedgerRow label="Total" value={20594.4} format={money} total />
</Ledger>`;

export const receiptUsage = `<script lang="ts">
  import { Button, LedgerRow, Receipt } from '@sveltier/ui';

  const money = { style: 'currency' } as const;
</script>

<Receipt title="Transfer sent" subtitle="Ref. TX-20261107-0042" level={2}>
  <LedgerRow label="Amount" value={1000} format={money} />
  <LedgerRow label="Fee" value={2.5} format={money} />
  <LedgerRow label="Total" value={1002.5} format={money} total />
  {#snippet footer()}
    <Button size="sm" variant="text">Download PDF</Button>
  {/snippet}
</Receipt>`;

export const pinPadUsage = `<script lang="ts">
  import { PinPad } from '@sveltier/ui';

  let { confirmOrder }: { confirmOrder: (pin: string) => Promise<boolean> } = $props();
  let pin = $state('');
  let error = $state<string>();

  async function check(entered: string) {
    if (await confirmOrder(entered)) return;
    error = 'Wrong PIN, 2 tries left';
    pin = '';
  }
</script>

<PinPad label="Enter your trading PIN" bind:value={pin} {error} oncomplete={check} />`;

export const odometerUsage = `<script lang="ts">
  import { Odometer } from '@sveltier/ui';

  let { balance }: { balance: number } = $props();
</script>

<Odometer value={balance} format={{ style: 'currency' }} />`;
