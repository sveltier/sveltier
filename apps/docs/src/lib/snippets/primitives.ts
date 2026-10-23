// Code samples for the Primitives pages.

export const attachIntro = `<script>
  import { focusTrap } from 'sveltier';
  let open = $state(false);
</script>

<!-- Active while open; cleaned up when open turns false or the element goes away. -->
<div {@attach open && focusTrap()}>…</div>`;

export const trapExample = `<script>
  import { focusTrap } from 'sveltier';
  let open = $state(false);
</script>

<button type="button" onclick={() => (open = true)}>Transfer</button>

{#if open}
  <div role="dialog" aria-modal="true" aria-labelledby="transfer-title" {@attach focusTrap()}>
    <h2 id="transfer-title">Transfer</h2>
    <input aria-label="Amount" />
    <button type="button" onclick={() => (open = false)}>Close</button>
  </div>
{/if}`;

export const rovingExample = `<script>
  import { rovingFocus } from 'sveltier';
</script>

<div role="toolbar" aria-label="Chart" {@attach rovingFocus()}>
  <button type="button" data-sv-item>1D</button>
  <button type="button" data-sv-item>1W</button>
  <button type="button" data-sv-item aria-disabled="true">1M</button>
  <button type="button" data-sv-item>1Y</button>
</div>`;

export const tabbableExample = `import { isTabbable, tabbable } from 'sveltier';

const stops = tabbable(dialog); // what Tab reaches, in Tab order
isTabbable(button); // false when disabled, hidden, inert, or tabindex="-1"`;

export const dismissExample = `<script>
  import { dismissable } from 'sveltier';
  let open = $state(false);
  let trigger = $state();
</script>

<button bind:this={trigger} aria-expanded={open} onclick={() => (open = !open)}>Filters</button>

{#if open}
  <!-- The trigger counts as inside, so pressing it toggles instead of dismissing. -->
  <div {@attach dismissable({ onDismiss: () => (open = false), inside: [trigger] })}>
    …
  </div>
{/if}`;
