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
