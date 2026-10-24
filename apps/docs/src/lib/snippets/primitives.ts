// Code samples for the Primitives pages.

export const attachIntro = `<script>
  import { focusTrap } from '@sveltier/ui';
  let open = $state(false);
</script>

<!-- Active while open; cleaned up when open turns false or the element goes away. -->
<div {@attach open && focusTrap()}>…</div>`;

export const trapExample = `<script>
  import { focusTrap } from '@sveltier/ui';
  let open = $state(false);
  let opener = $state();
</script>

<button type="button" bind:this={opener} onclick={() => (open = true)}>Transfer</button>

{#if open}
  <!-- Pass the trigger: Safari does not focus a button when it is clicked. -->
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="transfer-title"
    {@attach focusTrap({ returnFocus: opener })}
  >
    <h2 id="transfer-title">Transfer</h2>
    <input aria-label="Amount" />
    <button type="button" onclick={() => (open = false)}>Close</button>
  </div>
{/if}`;

export const rovingExample = `<script>
  import { rovingFocus } from '@sveltier/ui';
</script>

<div role="toolbar" aria-label="Chart" {@attach rovingFocus()}>
  <button type="button" data-sv-item>1D</button>
  <button type="button" data-sv-item>1W</button>
  <button type="button" data-sv-item aria-disabled="true">1M</button>
  <button type="button" data-sv-item>1Y</button>
</div>`;

export const tabbableExample = `import { isTabbable, tabbable } from '@sveltier/ui';

const stops = tabbable(dialog); // what Tab reaches, in Tab order
isTabbable(button); // false when disabled, hidden, inert, or tabindex="-1"`;

export const dismissExample = `<script>
  import { dismissable } from '@sveltier/ui';
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

export const portalExample = `<script>
  import { Portal } from '@sveltier/ui';
</script>

<!-- Rendered at the end of <body>, or in the element target names. -->
<Portal target="#toasts">
  <Toast />
</Portal>`;

export const modalExample = `<script>
  import { Portal, dismissable, focusTrap, inertOthers, scrollLock } from '@sveltier/ui';
  let open = $state(false);
  let opener = $state();
</script>

<button bind:this={opener} onclick={() => (open = true)}>Review transfer</button>

{#if open}
  <Portal>
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
      {@attach focusTrap({ returnFocus: opener })}
      {@attach inertOthers()}
      {@attach scrollLock()}
      {@attach dismissable({ onDismiss: () => (open = false) })}
    >
      <h2 id="sheet-title">Confirm transfer</h2>
      …
    </div>
  </Portal>
{/if}`;

export const anchoredExample = `<script>
  import { anchored, dismissable } from '@sveltier/ui';
  let open = $state(false);
  let trigger = $state();
</script>

<button bind:this={trigger} aria-expanded={open} onclick={() => (open = !open)}>Account</button>

{#if open}
  <!-- A manual popover sits in the top layer; anchored() places it, dismissable() closes it. -->
  <div
    popover="manual"
    {@attach (element) => element.showPopover()}
    {@attach anchored({ anchor: trigger, side: 'bottom', align: 'end' })}
    {@attach dismissable({ onDismiss: () => (open = false), inside: [trigger] })}
  >
    …
  </div>
{/if}`;

export const keymapExample = `<script>
  import { keymap } from '@sveltier/ui';
  let value = $state(50);
  const step = (by) => () => (value = Math.min(100, Math.max(0, value + by)));
</script>

<!-- ArrowForward and ArrowBackward follow the writing direction. -->
<div
  role="slider"
  tabindex="0"
  aria-label="Allocation"
  aria-valuenow={value}
  {@attach keymap({
    ArrowForward: step(1),
    ArrowBackward: step(-1),
    PageUp: step(10),
    PageDown: step(-10),
    Home: () => (value = 0),
    End: () => (value = 100)
  })}
>
  {value}%
</div>`;

export const typeaheadExample = `<script>
  import { rovingFocus, typeahead } from '@sveltier/ui';
</script>

<ul role="listbox" aria-label="Currency" {@attach rovingFocus({ orientation: 'vertical' })} {@attach typeahead()}>
  <li role="option" data-sv-item aria-selected="true">Euro</li>
  <li role="option" data-sv-item aria-selected="false">Pound sterling</li>
  …
</ul>`;

export const motionCss = `.panel {
  transition:
    opacity var(--sv-duration-normal) var(--sv-ease),
    transform var(--sv-duration-normal) var(--sv-ease);
}

.panel[data-closed] {
  opacity: 0;
  transform: translateY(8px);
}`;

export const transitionExample = `<script>
  import { rise } from '@sveltier/ui';
  let shown = $state(false);
</script>

<button aria-expanded={shown} onclick={() => (shown = !shown)}>Receipt</button>

{#if shown}
  <!-- Or in:pop out:fade, or rise with { distance: 13 }. -->
  <div transition:rise>Transfer sent: €1,250.00</div>
{/if}`;

export const springExample = `<script>
  import { spring } from '@sveltier/ui';
  const balance = spring(248190.35, 'gentle');
</script>

<button onclick={() => (balance.target += 1000)}>Deposit 1,000</button>

<!-- target is where it is going; current is what to show. -->
<p class="amount">{balance.current.toFixed(2)}</p>`;

export const motionExample = `import { Tween } from 'svelte/motion';
import { easing, motion } from '@sveltier/ui';

// element.animate() takes the theme's easing as it is.
export function flash(cell: HTMLElement) {
  const { fast, ease } = motion(cell);
  cell.animate([{ opacity: 0.382 }, { opacity: 1 }], { duration: fast, easing: ease });
}

// Tween needs a function: easing() turns the curve into one.
export function progress(element: HTMLElement) {
  const { slow, ease } = motion(element);
  return new Tween(0, { duration: slow, easing: easing(ease) });
}`;

export const virtualExample = `<script>
  import { virtualList } from '@sveltier/ui';
  let { transactions } = $props();

  // Read through a function, so the list follows transactions.length.
  const list = virtualList(() => ({ count: transactions.length, itemSize: 34 }));
</script>

<div class="viewport" {@attach list.viewport}>
  <div style:height="{list.totalSize}px" style:position="relative">
    {#each list.items as item (item.key)}
      <div class="row" style:transform="translateY({item.start}px)">
        {transactions[item.index].label}
      </div>
    {/each}
  </div>
</div>

<style>
  .viewport { height: 377px; overflow-y: auto; }
  .row { position: absolute; inset-inline: 0; height: 34px; }
</style>`;

export const measuredExample = `<script>
  import { virtualList } from '@sveltier/ui';
  let { entries } = $props();

  const list = virtualList(() => ({
    count: entries.length,
    itemSize: 55, // an estimate: each entry is measured once laid out
    key: (index) => entries[index].id
  }));
</script>

<div class="viewport" {@attach list.viewport}>
  <ol style:height="{list.totalSize}px" style:position="relative">
    {#each list.items as item (item.key)}
      <li
        data-index={item.index}
        style:position="absolute"
        style:transform="translateY({item.start}px)"
        {@attach list.measure}
      >
        {entries[item.index].text}
      </li>
    {/each}
  </ol>
</div>`;

export const activeDescendantExample = `<script>
  import { keymap, virtualList } from '@sveltier/ui';
  let { options } = $props();

  const id = $props.id();
  let active = $state(0);
  const list = virtualList(() => ({ count: options.length, itemSize: 34 }));

  // Focus stays on the listbox; scrollToIndex renders the new active option at once.
  const move = (by) => () => {
    active = Math.max(0, Math.min(options.length - 1, active + by));
    list.scrollToIndex(active);
  };
</script>

<div
  role="listbox"
  tabindex="0"
  aria-label="Currency"
  aria-activedescendant="{id}-{active}"
  {@attach list.viewport}
  {@attach keymap({ ArrowDown: move(1), ArrowUp: move(-1) })}
>
  <div style:height="{list.totalSize}px" style:position="relative">
    {#each list.items as item (item.key)}
      <div
        id="{id}-{item.index}"
        role="option"
        aria-selected={item.index === active}
        aria-setsize={options.length}
        aria-posinset={item.index + 1}
        style:position="absolute"
        style:transform="translateY({item.start}px)"
      >
        {options[item.index]}
      </div>
    {/each}
  </div>
</div>`;
