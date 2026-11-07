---
'@sveltier/ui': patch
---

Tooltip: development builds warn (SV4007) when the control's `aria-describedby` replaced the tooltip's id, as one written after the trigger's attributes does, for a Badge's count say, and the tooltip was no longer read. The warning shows how to join the ids, and the Badge and Tooltip docs show a button described by both.
