---
'@sveltier/ui': patch
---

Number fields (NumberField, PriceInput, AmountInput) no longer read a separator that breaks the grouping as a group. In vi-VN, where a point groups thousands and a comma is the decimal, "0.5" was read as 5 and "1352.6" as 13526, and a price became ten or a thousand times larger with no error. Each group after a separator must now have three digits (two, then three, for Indian grouping), and nothing may group after the decimal separator. Text that breaks this is not a number: the field says so, with an example in the locale's format ("Enter a number, such as 1.234,5"). The same holds in en-US, where "1,5" was read as 15. The `badInput` message takes an `{example}`.
