---
'@sveltier/ui': minor
---

Table rows slide to their new places when the order changes, whether a header sorts them or the data comes in a new order; a table of more than 89 rows jumps, so it sorts fast. Rows now paint the table's surface, so rows sliding past each other do not show through. The new `move` function does the same for an app's own keyed lists: `{#each rows as row (row.id)}<li animate:move>…</li>{/each}`.
