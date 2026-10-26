---
'@sveltier/ui': minor
---

Combobox: one value found by typing, as the APG combobox with list autocomplete. The list under the field keeps the items whose label or description contains every word typed, ignoring case and diacritics ("da nang" finds Đà Nẵng), and points at the first match, so a few letters and Enter choose. It takes the items of a Select, groups and the `option` snippet included. `filter` takes a function, or `false` with `bind:query` and `loading` to search a server. An Enter that confirms an input method's word never chooses. Leaving the field puts back the chosen label over what was typed, and an emptied field clears the value.
