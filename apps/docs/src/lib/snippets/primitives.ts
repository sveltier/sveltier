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

export const portalExample = `<script>
  import { Portal } from 'sveltier';
</script>

<!-- Rendered at the end of <body>, or in the element target names. -->
<Portal target="#toasts">
  <Toast />
</Portal>`;

export const modalExample = `<script>
  import { Portal, dismissable, focusTrap, inertOthers, scrollLock } from 'sveltier';
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
  import { anchored, dismissable } from 'sveltier';
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
  import { keymap } from 'sveltier';
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
  import { rovingFocus, typeahead } from 'sveltier';
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
  import { rise } from 'sveltier';
  let shown = $state(false);
</script>

<button aria-expanded={shown} onclick={() => (shown = !shown)}>Receipt</button>

{#if shown}
  <!-- Or in:pop out:fade, or rise with { distance: 13 }. -->
  <div transition:rise>Transfer sent: €1,250.00</div>
{/if}`;

export const springExample = `<script>
  import { spring } from 'sveltier';
  const balance = spring(248190.35, 'gentle');
</script>

<button onclick={() => (balance.target += 1000)}>Deposit 1,000</button>

<!-- target is where it is going; current is what to show. -->
<p class="amount">{balance.current.toFixed(2)}</p>`;

export const motionExample = `import { Tween } from 'svelte/motion';
import { easing, motion } from 'sveltier';

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
