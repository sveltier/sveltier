---
'@sveltier/ui': patch
---

Switch, Checkbox, RadioGroup and NativeSelect show their owner's state again when it refuses a change. Bound through a setter that keeps the state (`bind:checked={() => on, (next) => save(next) && (on = next)}`), the control used to keep showing the user's change; it now goes back, dash and all for a Checkbox, and `onchange` is not called for a change that did not happen.
