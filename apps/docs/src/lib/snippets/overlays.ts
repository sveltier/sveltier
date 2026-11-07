// Code samples for the overlay pages, shown on the pages and in llms-full.txt.

export const dialogUsage = `<script>
  import { Button, Dialog } from '@sveltier/ui';

  function remove() {
    // …
  }
</script>

<Dialog title="Delete this card?" size="sm">
  {#snippet trigger(attributes)}
    <Button {...attributes} color="error" variant="tonal">Delete card</Button>
  {/snippet}

  The card stops working at once. Payments already made stay on your statement.

  {#snippet actions({ close })}
    <Button variant="text" onclick={close}>Keep it</Button>
    <Button color="error" onclick={() => { remove(); close(); }}>Delete</Button>
  {/snippet}
</Dialog>`;

export const sheetUsage = `<script>
  import { Button, Checkbox, Sheet } from '@sveltier/ui';
  let pending = $state(false);
</script>

<!-- A drawer from the end edge: the right in left-to-right pages, the left in right-to-left ones. -->
<Sheet title="Filters" closable>
  {#snippet trigger(attributes)}
    <Button {...attributes} variant="outlined">Filters</Button>
  {/snippet}

  <Checkbox label="Pending payments only" bind:checked={pending} />

  {#snippet actions({ close })}
    <Button onclick={close}>Show results</Button>
  {/snippet}
</Sheet>

<!-- A sheet from the bottom, as on a phone. -->
<Sheet title="Share the statement" side="bottom">…</Sheet>`;

export const popoverUsage = `<script>
  import { Button, NumberField, Popover } from '@sveltier/ui';
  let from = $state(null);
  let to = $state(null);
</script>

<Popover title="Amount range" size="sm">
  {#snippet trigger(attributes)}
    <Button {...attributes} variant="outlined">Amount</Button>
  {/snippet}

  <div class="range">
    <NumberField label="From" min={0} bind:value={from} />
    <NumberField label="To" min={0} bind:value={to} />
  </div>

  {#snippet actions({ close })}
    <Button onclick={close}>Apply</Button>
  {/snippet}
</Popover>

<style>
  /* Fields stacked with the theme's spacing. */
  .range {
    display: grid;
    gap: var(--sv-space-13);
  }
</style>`;

export const popoverInfo = `<script>
  import { Button, Popover } from '@sveltier/ui';
</script>

<!-- With text only, the panel itself takes focus: screen readers read it, Escape closes it. -->
<Popover title="Pending payments" side="top" align="center">
  {#snippet trigger(attributes)}
    <Button {...attributes} variant="text">What is pending?</Button>
  {/snippet}
  A payment is pending until the receiving bank confirms it.
</Popover>`;

export const menuUsage = `<script>
  import { Button, Menu } from '@sveltier/ui';
  import { mdiDelete, mdiDownload, mdiPencil } from '@mdi/js';

  function run(value) {
    // …
  }
</script>

<Menu
  items={[
    { label: 'Rename', value: 'rename', icon: mdiPencil, shortcut: 'F2' },
    { label: 'Move to savings', value: 'move', disabled: true },
    { heading: 'Export' },
    { label: 'Statement as PDF', value: 'pdf', icon: mdiDownload },
    { separator: true },
    { label: 'Close account', value: 'close', icon: mdiDelete, danger: true }
  ]}
  onselect={(item) => run(item.value)}
>
  {#snippet trigger(attributes)}
    <Button {...attributes} variant="outlined">Account actions</Button>
  {/snippet}
</Menu>`;

export const menuIconButton = `<script>
  import { Button, Icon, Menu, Tooltip } from '@sveltier/ui';
  import { mdiDotsHorizontal } from '@mdi/js';

  let { items, onselect } = $props();
</script>

<!-- One icon button: a tooltip that names its purpose, and the menu it opens. -->
<Tooltip text="More actions">
  {#snippet trigger(tooltip)}
    <Menu {items} {onselect} align="end">
      {#snippet trigger(menu)}
        <Button {...tooltip} {...menu} icon variant="text" aria-label="More">
          <Icon path={mdiDotsHorizontal} />
        </Button>
      {/snippet}
    </Menu>
  {/snippet}
</Tooltip>`;

export const contextMenuUsage = `<script lang="ts">
  import { ContextMenu, Table, type TableColumn } from '@sveltier/ui';

  type Order = { id: string; symbol: string; size: number };
  let { orders, cancel, copy }: {
    orders: Order[];
    cancel: (id: string) => void;
    copy: (id: string) => void;
  } = $props();

  const columns: TableColumn<Order>[] = [
    { key: 'symbol', label: 'Symbol', rowHeader: true },
    { key: 'size', label: 'Size' }
  ];
  // The order the menu opened on, from the row's data-id.
  let order = $state('');
</script>

<ContextMenu
  label="Order actions"
  items={[
    { label: 'Copy id', value: 'copy' },
    { separator: true },
    { label: 'Cancel order', value: 'cancel', danger: true }
  ]}
  onopen={(row) => (order = row.dataset.id ?? '')}
  onselect={(item) => (item.value === 'cancel' ? cancel(order) : copy(order))}
>
  {#snippet target(attributes)}
    <Table
      caption="Open orders"
      {columns}
      items={orders}
      itemKey="id"
      rowAttributes={(o) => ({ ...attributes, 'data-id': o.id })}
    />
  {/snippet}
</ContextMenu>`;

export const commandPaletteUsage = `<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button, CommandPalette, type CommandItem } from '@sveltier/ui';

  // Commands carry their own fields: onselect receives them typed.
  type Command = CommandItem & { href: string };
  const commands: Command[] = [
    { label: 'BTC/USDT', description: 'Binance · Spot', group: 'Markets', href: '/m/btc-usdt' },
    { label: 'ETH/USDT', description: 'Binance · Spot', group: 'Markets', href: '/m/eth-usdt' },
    { label: 'Portfolio', keywords: ['balances'], group: 'Pages', href: '/portfolio' },
    { label: 'Settings', keywords: ['preferences'], group: 'Pages', href: '/settings' }
  ];
</script>

<!-- Ctrl+K (⌘K on a Mac) opens it from anywhere on the page, as does the button. -->
<CommandPalette label="Go to" items={commands} onselect={(command) => goto(command.href)}>
  {#snippet trigger(attributes)}
    <Button {...attributes} variant="outlined">Search <kbd>Ctrl K</kbd></Button>
  {/snippet}
</CommandPalette>`;

export const commandPaletteIcons = `<script lang="ts">
  import { CommandPalette, type CommandItem } from '@sveltier/ui';
  // A path from a path-based set, or a component from any other set.
  import { mdiCog } from '@mdi/js';
  import { ChartLine } from 'phosphor-svelte';

  const commands: CommandItem[] = [
    { label: 'Markets', icon: ChartLine },
    { label: 'Settings', icon: mdiCog }
  ];
</script>

<CommandPalette label="Go to" items={commands} />`;

export const tooltipUsage = `<script>
  import { Button, Icon, Tooltip } from '@sveltier/ui';
  import { mdiContentCopy } from '@mdi/js';
</script>

<!-- The tooltip describes the button; aria-label still names it. -->
<Tooltip text="Copy the IBAN">
  {#snippet trigger(attributes)}
    <Button {...attributes} icon variant="text" aria-label="Copy"><Icon path={mdiContentCopy} /></Button>
  {/snippet}
</Tooltip>

<Tooltip text="Blocks new card payments until you unfreeze it." side="bottom">
  {#snippet trigger(attributes)}
    <Button {...attributes} variant="outlined">Freeze card</Button>
  {/snippet}
</Tooltip>`;

export const tooltipWithDialog = `<script>
  import { Button, Dialog, Icon, TextField, Tooltip } from '@sveltier/ui';
  import { mdiPencil } from '@mdi/js';
</script>

<!-- One control, two overlays: spread both sets of attributes onto it. -->
<Dialog title="Rename the account">
  {#snippet trigger(dialog)}
    <Tooltip text="Rename the account">
      {#snippet trigger(tooltip)}
        <Button {...dialog} {...tooltip} icon variant="text" aria-label="Rename">
          <Icon path={mdiPencil} />
        </Button>
      {/snippet}
    </Tooltip>
  {/snippet}
  <TextField label="Account name" />
</Dialog>`;

export const toastUsage = `<script>
  import { Button, useToast } from '@sveltier/ui';

  // While the component initialises; show() whenever something happens.
  const toast = useToast();

  function send() {
    // … send the payment
    toast.show('Payment sent', {
      action: { label: 'Undo', onclick: cancel }
    });
  }

  function cancel() {
    // …
  }
</script>

<Button onclick={send}>Send payment</Button>
<Button variant="outlined" onclick={() => toast.show('Statement saved', { color: 'success' })}>
  Save statement
</Button>`;

export const toastDismiss = `<script>
  import { Button, useToast } from '@sveltier/ui';

  const toast = useToast();

  async function exportTransactions() {
    // Stays until it is closed, or until the export is ready.
    const id = toast.show('Preparing your export…', { duration: 0 });
    await new Promise((done) => setTimeout(done, 3000)); // … the export
    toast.dismiss(id);
    toast.show('Export ready', { color: 'success' });
  }
</script>

<Button variant="outlined" onclick={exportTransactions}>Export transactions</Button>`;

export const toastDefaults = `<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';

  let { children } = $props();
</script>

<!-- Every toast stays 8 seconds, unless show() says otherwise. -->
<UIProvider themes={monolith} defaults={{ Toast: { duration: 8000 } }}>
  {@render children()}
</UIProvider>`;

export const toastInset = `<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  import StatusBar from './StatusBar.svelte';

  let { children } = $props();
</script>

<!-- The status bar is 22px tall along the bottom: toasts stay above it. -->
<UIProvider themes={monolith} defaults={{ Toast: { inset: 22 } }}>
  {@render children()}
  <StatusBar />
</UIProvider>`;

export const toastProvider = `<script>
  import { ThemeProvider, ToastProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';

  let { children } = $props();
</script>

<!-- UIProvider includes it: add ToastProvider only to an app on ThemeProvider alone. -->
<ThemeProvider themes={monolith}>
  <ToastProvider>
    {@render children()}
  </ToastProvider>
</ThemeProvider>`;

export const dialogControlled = `<script>
  import { Dialog, TextField } from '@sveltier/ui';

  let open = $state(false);
  let name = $state('');
  let closedBy = $state('');
</script>

<!-- Opened from code: no trigger, only bind:open. -->
<Dialog title="Rename the account" closable bind:open onclose={(reason) => (closedBy = reason)}>
  <TextField label="Account name" autofocus bind:value={name} />
</Dialog>`;
