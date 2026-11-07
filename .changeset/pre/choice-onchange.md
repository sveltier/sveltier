---
'@sveltier/ui': minor
---

Checkbox, Switch and RadioGroup: `onchange` receives the new value when the user changes it, as on Select, Combobox and the date fields: `checked` for Checkbox and Switch, the picked value (in its type) for RadioGroup. It is not called when the value is set from code. Before, a caller's `onchange` reached the input as a DOM event on Checkbox and Switch, and was dropped on RadioGroup; a handler that read `event.currentTarget.checked` now takes the boolean instead.
