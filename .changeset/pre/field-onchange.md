---
'@sveltier/ui': minor
---

Every field's `onchange` receives its value, as Select, Combobox, Switch and the date fields' already do. TextField and Textarea call it with the text when the user leaves the field after changing it. NumberField, PriceInput and AmountInput call it with the number when it is committed: on leaving after typing, on each step, and on a share; `null` once emptied. Slider calls it on release. NativeSelect calls it with the value in its type, OtpInput with the code (`oncomplete` is unchanged), and a filter Chip with `selected`. None is called when the value is set from code. **Breaking:** a DOM `onchange` passed to these fields now receives the value instead of an event; `oninput` is still the DOM event.
