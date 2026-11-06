---
'@sveltier/ui': minor
---

Add Ledger, LedgerRow and Receipt: labels and their figures joined by a dotted leader, as a description list, with the total under a double rule (`total`). A LedgerRow's figure is an Amount and follows its `masked`; children take its place. A Receipt is a section named by its `title`, with a `subtitle`, the rows and a `footer`. A LedgerRow outside a list warns in development (SV4006).
