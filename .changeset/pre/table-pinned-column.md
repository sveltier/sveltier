---
'@sveltier/ui': minor
---

Table columns take `pinned`: the column stays at the start of the box while a wide table scrolls across under it, so on a narrow screen every row keeps its name in view. Pin the `rowHeader`; a table pins one column, and a development warning (SV4010) names the columns when more than one is pinned. Once the table scrolls across, a hairline marks the pinned column's edge, and the caption's words stay in view as well. Row washes (hover and `aria-current`) now paint as an image over the cell, so a pinned cell keeps its surface under them.
