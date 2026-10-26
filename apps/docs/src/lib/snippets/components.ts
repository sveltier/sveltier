// Code samples for the Components pages.

export const buttonUsage = `<script>
  import { Button } from '@sveltier/ui';
</script>

<Button onclick={() => (open = true)}>New transfer</Button>
<Button variant="outlined" color="error">Cancel payment</Button>`;

export const buttonIcons = `<Button>
  {#snippet prepend()}<PlusIcon />{/snippet}
  New transfer
</Button>

<!-- An icon alone needs a label for screen readers. -->
<Button icon variant="text" aria-label="Close"><CloseIcon /></Button>`;

export const buttonLoading = `<script>
  import { Button } from '@sveltier/ui';
  let paying = $state(false);

  async function pay() {
    paying = true;
    try {
      await payInvoice();
    } finally {
      paying = false;
    }
  }
</script>

<!-- Ignores presses while loading, so the invoice is paid once. -->
<Button loading={paying} onclick={pay}>Pay invoice</Button>`;

export const buttonLink = `<!-- href makes it a link: middle-click, open in a new tab and
     client-side navigation work as they do for any link. -->
<Button href="/statements" variant="tonal">Statements</Button>`;

export const buttonDefaults = `<UIProvider
  themes={monolith}
  defaults={{ Button: { variant: 'tonal', rounded: 'full' } }}
>
  <!-- Every Button below is tonal and round unless it says otherwise. -->
</UIProvider>`;

export const iconUsage = `<script>
  import { Icon } from '@sveltier/ui';
  // Path-based sets export path strings, for example Material Design Icons.
  import { mdiBank } from '@mdi/js';
</script>

<Icon path={mdiBank} />
<Icon path={mdiBank} size="lg" color="primary" />`;

export const iconCustom = `<script>
  import { Icon } from '@sveltier/ui';
  import BankIcon from './BankIcon.svelte';
</script>

<!-- Any SVG or icon component, sized and coloured like a path icon. -->
<Icon><BankIcon /></Icon>`;

export const iconLabel = `<!-- Decorative: next to text that says the same thing. -->
<Icon path={mdiCheck} /> Verified

<!-- Meaningful on its own: give it a name. -->
<Icon path={mdiCheck} label="Verified" color="success" />`;

export const dividerUsage = `<script>
  import { Divider } from '@sveltier/ui';
</script>

<p>Available</p>
<Divider />
<p>Pending</p>

<!-- In a row, a vertical divider is as tall as the row. -->
<div style="display: flex">
  <Button variant="text">Week</Button>
  <Divider vertical />
  <Button variant="text">Export</Button>
</div>`;

export const breadcrumbsUsage = `<script>
  import { Breadcrumbs } from '@sveltier/ui';
</script>

<!-- The pages above this one as links, this page last. -->
<Breadcrumbs
  items={[
    { label: 'Accounts', href: '/accounts' },
    { label: 'Savings', href: '/accounts/savings' },
    { label: 'Statement for October' }
  ]}
/>`;

export const badgeUsage = `<script>
  import { Badge, Button, Icon } from '@sveltier/ui';
</script>

<!-- The button is described by the badge's text, so the count is heard on focus. -->
<Badge id="inbox" content={3} label="unread messages">
  <Button icon aria-label="Messages" aria-describedby="inbox-label">
    <Icon path={mdiEmail} />
  </Button>
</Badge>

<!-- Alone in a line. -->
Savings <Badge content="New" />`;

export const avatarUsage = `<script>
  import { Avatar } from '@sveltier/ui';
</script>

<!-- A name is shown next to it, so the avatar is decorative. -->
<Avatar src={user.photo}>AM</Avatar> Alex Morgan

<!-- On its own, it needs alt text. -->
<Avatar src={user.photo} alt="Alex Morgan" size="lg">AM</Avatar>`;

export const chipFilter = `<script>
  import { Chip } from '@sveltier/ui';
  let card = $state(true);
  let transfer = $state(false);
</script>

<Chip bind:selected={card}>Card</Chip>
<Chip bind:selected={transfer}>Transfer</Chip>`;

export const chipClosable = `<script>
  import { Chip } from '@sveltier/ui';
  let currencies = $state(['EUR', 'GBP', 'USD']);
</script>

{#each currencies as currency (currency)}
  <Chip
    closable
    closeLabel="Remove {currency}"
    onclose={() => (currencies = currencies.filter((c) => c !== currency))}
  >
    {currency}
  </Chip>
{/each}`;

export const paginationUsage = `<script>
  import { Pagination } from '@sveltier/ui';

  let page = $state(1);
</script>

<!-- Buttons: bind:page follows the page the user picks. -->
<Pagination count={9} bind:page />`;

export const paginationLinks = `<script>
  import { page } from '$app/state';
  import { Pagination } from '@sveltier/ui';

  let { data } = $props();
  const current = $derived(Number(page.url.searchParams.get('page') ?? 1));
</script>

<!-- Links: the address holds the page, so it can be shared, reloaded and crawled. -->
<Pagination count={data.pages} page={current} href={(n) => \`?page=\${n}\`} />`;

export const progressUsage = `<script>
  import { ProgressCircular, ProgressLinear } from '@sveltier/ui';
</script>

<ProgressLinear value={uploaded} label="Uploading statement" />
<ProgressCircular value={62} size="lg">62%</ProgressCircular>
<ProgressCircular indeterminate label="Loading accounts" />`;

export const skeletonUsage = `<script>
  import { Skeleton } from '@sveltier/ui';
</script>

<!-- aria-busy tells assistive technology to wait for the real content. -->
<section aria-busy={loading}>
  {#if loading}
    <Skeleton type="circle" />
    <Skeleton lines={2} />
    <Skeleton type="rect" />
  {:else}
    …
  {/if}
</section>`;

export const alertUsage = `<script>
  import { Alert, Button } from '@sveltier/ui';
</script>

<Alert type="error" title="Payment declined">
  The card ending 4471 was declined by the issuer.
  {#snippet actions()}
    <Button size="sm" variant="tonal" color="error">Try another card</Button>
  {/snippet}
</Alert>

<Alert type="success" closable>Transfer sent.</Alert>`;

export const cardUsage = `<script>
  import { Avatar, Button, Card } from '@sveltier/ui';
</script>

<Card title="Savings" subtitle="Instant access" level={3}>
  {#snippet prepend()}<Avatar color="success">SV</Avatar>{/snippet}
  <p>$12,480.00</p>
  {#snippet actions()}
    <Button variant="tonal">Add money</Button>
    <Button variant="text">Statement</Button>
  {/snippet}
</Card>`;

export const listUsage = `<script>
  import { List, ListItem } from '@sveltier/ui';
</script>

<nav aria-label="Banking">
  <List nav>
    <ListItem title="Overview" href="/" active />
    <ListItem title="Cards" href="/cards" />
  </List>
</nav>

<List>
  <ListItem title="Savings" subtitle="Instant access">
    {#snippet append()}$12,480.00{/snippet}
  </ListItem>
</List>`;

export const buttonGroupUsage = `<script>
  import { Button, ButtonGroup } from '@sveltier/ui';
</script>

<ButtonGroup aria-label="Export">
  <Button onclick={exportCsv}>CSV</Button>
  <Button onclick={exportPdf}>PDF</Button>
</ButtonGroup>`;

export const segmentedUsage = `<script>
  import { SegmentedControl } from '@sveltier/ui';
  let range = $state('1M');
</script>

<SegmentedControl
  aria-label="Chart range"
  options={[
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '1Y', label: '1Y' }
  ]}
  bind:value={range}
/>`;

export const accordionUsage = `<script>
  import { Accordion } from '@sveltier/ui';

  const answers = {
    fees: 'Transfers in euros are free. Other currencies cost 0.4% of the amount.',
    timing: 'Most transfers arrive the same day; some banks take up to two working days.',
    limits: 'You can send up to €20,000 a day.'
  };
  let open = $state('fees');
</script>

<Accordion
  items={[
    { value: 'fees', title: 'What does a transfer cost?' },
    { value: 'timing', title: 'How long does a transfer take?' },
    { value: 'limits', title: 'How much can I send?' }
  ]}
  bind:value={open}
>
  {#snippet panel(item)}
    <p>{answers[item.value]}</p>
  {/snippet}
</Accordion>`;

export const accordionMultiple = `<script>
  import { Accordion, Checkbox } from '@sveltier/ui';

  // With multiple, the value is the list of open sections.
  let open = $state(['payments']);
</script>

<Accordion
  multiple
  items={[
    { value: 'payments', title: 'Payments' },
    { value: 'security', title: 'Security' }
  ]}
  bind:value={open}
>
  {#snippet panel(item)}
    <Checkbox label="Email me about {item.title.toLowerCase()}" />
  {/snippet}
</Accordion>`;

export const tabsUsage = `<script>
  import { Tabs } from '@sveltier/ui';
  let section = $state('overview');
</script>

<Tabs
  aria-label="Account"
  items={[
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity' }
  ]}
  bind:value={section}
>
  {#snippet panel(item)}
    <AccountSection name={item.value} />
  {/snippet}
</Tabs>`;

export const tableUsage = `<script lang="ts">
  import { Table, type TableColumn } from '@sveltier/ui';

  type Position = { symbol: string; name: string; quantity: number; price: number };
  let { positions }: { positions: Position[] } = $props();

  // A key is a property of the items: a typo is a type error that lists the real ones.
  const columns: TableColumn<Position>[] = [
    { key: 'symbol', label: 'Symbol', rowHeader: true, sort: true },
    { key: 'name', label: 'Name', sort: true },
    { key: 'quantity', label: 'Quantity', sort: true },
    { key: 'price', label: 'Price', sort: true, format: (price) => price.toFixed(2) }
  ];
</script>

<Table caption="Positions" {columns} items={positions} />`;

export const tableColumns = `<script lang="ts">
  import { Button, Table, type TableColumn } from '@sveltier/ui';

  type Position = { symbol: string; quantity: number; cost: number; price: number };
  let { positions, onclose }: { positions: Position[]; onclose: (p: Position) => void } =
    $props();

  const pnlOf = (p: Position) => (p.price - p.cost) * p.quantity;

  const columns: TableColumn<Position>[] = [
    { key: 'symbol', label: 'Symbol', rowHeader: true },
    // An id with a value: computed from the item, and sorted by that value.
    { id: 'pnl', label: 'P&L', value: pnlOf, sort: true, cell: pnl },
    // An id with only a cell: content of its own, with a label for screen readers only.
    { id: 'close', label: 'Close', hideLabel: true, cell: close }
  ];
</script>

{#snippet pnl(p: Position)}
  <span class={pnlOf(p) < 0 ? 'down' : 'up'}>{pnlOf(p).toFixed(2)}</span>
{/snippet}

{#snippet close(p: Position)}
  <Button size="sm" variant="text" onclick={() => onclose(p)}>Close {p.symbol}</Button>
{/snippet}

<Table aria-label="Open positions" {columns} items={positions} />`;

export const tableSort = `<script lang="ts">
  import { Table, type TableColumn, type TableSort } from '@sveltier/ui';

  type Order = { id: string; placed: Date; status: 'open' | 'filled' | 'cancelled' };
  let { orders }: { orders: Order[] } = $props();

  const RANK = { open: 0, filled: 1, cancelled: 2 };
  const columns: TableColumn<Order>[] = [
    { key: 'id', label: 'Order', rowHeader: true },
    { key: 'placed', label: 'Placed', sort: true, format: (date) => date.toLocaleString() },
    // A comparator decides the order itself: open orders first.
    { key: 'status', label: 'Status', sort: (a, b) => RANK[a.status] - RANK[b.status] }
  ];

  // Bindable: newest first to begin with, then whatever the user clicks.
  let sortBy = $state<TableSort | undefined>({ column: 'placed', direction: 'descending' });
</script>

<Table caption="Orders" {columns} items={orders} bind:sortBy />`;

export const tableLive = `<script lang="ts">
  import { Table, type TableColumn } from '@sveltier/ui';

  type Quote = { symbol: string; last: number; volume: number };
  let { quotes, selected = $bindable() }: { quotes: Quote[]; selected?: string } = $props();

  const columns: TableColumn<Quote>[] = [
    { key: 'symbol', label: 'Symbol', rowHeader: true, cell: pick },
    { key: 'last', label: 'Last', sort: true },
    { key: 'volume', label: 'Volume', sort: true }
  ];
</script>

{#snippet pick(quote: Quote)}
  <button type="button" onclick={() => (selected = quote.symbol)}>{quote.symbol}</button>
{/snippet}

<!-- Fresh quote objects arrive every second: itemKey keeps each row's element, the sort
     stays, and the header stays in view while the box scrolls. -->
<Table
  aria-label="Watchlist"
  {columns}
  items={quotes}
  itemKey="symbol"
  rowAttributes={(quote) => ({ 'aria-current': quote.symbol === selected })}
  density="compact"
  style="max-block-size: 24rem"
/>`;

export const tableEmpty = `<script lang="ts">
  import { Button, Table, type TableColumn } from '@sveltier/ui';

  type Payment = { id: string; payee: string; amount: number };
  let {
    payments,
    loading,
    onretry
  }: { payments: Payment[]; loading: boolean; onretry: () => void } = $props();

  const columns: TableColumn<Payment>[] = [
    { key: 'payee', label: 'Payee' },
    { key: 'amount', label: 'Amount', format: (amount) => amount.toFixed(2) }
  ];
</script>

<!-- While loading, a bar runs along the top and the empty row says "Loading". -->
<Table caption="Payments" {columns} items={payments} itemKey="id" {loading}>
  {#snippet empty()}
    Nothing yet. <Button size="sm" variant="text" onclick={onretry}>Check again</Button>
  {/snippet}
</Table>`;
