---
'@sveltier/ui': minor
---

Table columns take `stack: 'primary' | 'secondary' | 'hidden'`, where the column goes when the table shows its rows as blocks: `'primary'` on the first line beside the row's name, `'secondary'` on a line under the name without its label, `'hidden'` out of sight but still read by screen readers. It replaces the column's `primary: true`, which now warns and does nothing.
