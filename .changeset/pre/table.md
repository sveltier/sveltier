---
'@sveltier/ui': minor
---

Table: items in rows and typed columns. A column's `key` is a property of the items, so a typo is a type error that lists the real ones; an `id` with a `value` computes a column, and a `cell` snippet renders content of its own. Columns sort from their header (`sort: true` or a comparator, `bind:sortBy`), numbers line up at the end in tabular figures, the header stays in view while the table scrolls, and a table that overflows its box becomes a region the keyboard can scroll. `itemKey` keeps rows across live updates, `rowAttributes` marks the current row with `aria-current`, and `empty` and `loading` cover the states without rows.
