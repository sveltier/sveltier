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
