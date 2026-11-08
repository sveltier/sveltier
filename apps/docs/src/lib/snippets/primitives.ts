// Code samples for the Primitives pages.
// Svelte and TypeScript samples are files in ../examples that svelte-check compiles, shown with
// ?raw. What stays a string cannot be checked as a file of its own: shell, CSS, HTML, a
// signature, a route file, or two files in one block.

export { default as attachIntro } from '../examples/primitives/AttachIntro.svelte?raw';

export { default as trapExample } from '../examples/primitives/TrapExample.svelte?raw';

export { default as rovingExample } from '../examples/primitives/RovingExample.svelte?raw';

export { default as tabbableExample } from '../examples/primitives/tabbableExample.ts?raw';

export { default as dismissExample } from '../examples/primitives/DismissExample.svelte?raw';

export { default as portalExample } from '../examples/primitives/PortalExample.svelte?raw';

export { default as modalExample } from '../examples/primitives/ModalExample.svelte?raw';

export { default as anchoredExample } from '../examples/primitives/AnchoredExample.svelte?raw';

export { default as keymapExample } from '../examples/primitives/KeymapExample.svelte?raw';

export { default as typeaheadExample } from '../examples/primitives/TypeaheadExample.svelte?raw';

export const motionCss = `.panel {
  transition:
    opacity var(--sv-duration-normal) var(--sv-ease),
    transform var(--sv-duration-normal) var(--sv-ease);
}

.panel[data-closed] {
  opacity: 0;
  transform: translateY(8px);
}`;

export { default as transitionExample } from '../examples/primitives/TransitionExample.svelte?raw';

export { default as springExample } from '../examples/primitives/SpringExample.svelte?raw';

export { default as motionExample } from '../examples/primitives/motionExample.ts?raw';

export { default as virtualExample } from '../examples/primitives/VirtualExample.svelte?raw';

export { default as measuredExample } from '../examples/primitives/MeasuredExample.svelte?raw';

export { default as activeDescendantExample } from '../examples/primitives/ActiveDescendantExample.svelte?raw';
