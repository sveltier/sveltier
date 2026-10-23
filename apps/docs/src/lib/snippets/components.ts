// Code samples for the Components pages.

export const buttonUsage = `<script>
  import { Button } from 'sveltier';
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
  import { Button } from 'sveltier';
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
  import { Icon } from 'sveltier';
  // Path-based sets export path strings, for example Material Design Icons.
  import { mdiBank } from '@mdi/js';
</script>

<Icon path={mdiBank} />
<Icon path={mdiBank} size="lg" color="primary" />`;

export const iconCustom = `<script>
  import { Icon } from 'sveltier';
  import BankIcon from './BankIcon.svelte';
</script>

<!-- Any SVG or icon component, sized and coloured like a path icon. -->
<Icon><BankIcon /></Icon>`;

export const iconLabel = `<!-- Decorative: next to text that says the same thing. -->
<Icon path={mdiCheck} /> Verified

<!-- Meaningful on its own: give it a name. -->
<Icon path={mdiCheck} label="Verified" color="success" />`;

export const dividerUsage = `<script>
  import { Divider } from 'sveltier';
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

export const badgeUsage = `<script>
  import { Badge, Button, Icon } from 'sveltier';
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
  import { Avatar } from 'sveltier';
</script>

<!-- A name is shown next to it, so the avatar is decorative. -->
<Avatar src={user.photo}>AM</Avatar> Alex Morgan

<!-- On its own, it needs alt text. -->
<Avatar src={user.photo} alt="Alex Morgan" size="lg">AM</Avatar>`;

export const chipFilter = `<script>
  import { Chip } from 'sveltier';
  let card = $state(true);
  let transfer = $state(false);
</script>

<Chip bind:selected={card}>Card</Chip>
<Chip bind:selected={transfer}>Transfer</Chip>`;

export const chipClosable = `<script>
  import { Chip } from 'sveltier';
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

export const progressUsage = `<script>
  import { ProgressCircular, ProgressLinear } from 'sveltier';
</script>

<ProgressLinear value={uploaded} label="Uploading statement" />
<ProgressCircular value={62} size="lg">62%</ProgressCircular>
<ProgressCircular indeterminate label="Loading accounts" />`;

export const skeletonUsage = `<script>
  import { Skeleton } from 'sveltier';
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
  import { Alert, Button } from 'sveltier';
</script>

<Alert type="error" title="Payment declined">
  The card ending 4471 was declined by the issuer.
  {#snippet actions()}
    <Button size="sm" variant="tonal" color="error">Try another card</Button>
  {/snippet}
</Alert>

<Alert type="success" closable>Transfer sent.</Alert>`;

export const cardUsage = `<script>
  import { Avatar, Button, Card } from 'sveltier';
</script>

<Card title="Savings" subtitle="Instant access" level={3}>
  {#snippet prepend()}<Avatar color="success">SV</Avatar>{/snippet}
  <p>$12,480.00</p>
  {#snippet actions()}
    <Button variant="tonal">Add money</Button>
    <Button variant="text">Statement</Button>
  {/snippet}
</Card>`;
