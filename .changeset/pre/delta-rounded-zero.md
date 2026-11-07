---
'@sveltier/ui': patch
---

Delta: a change that rounds to zero at the digits shown is no change. 0.00001 as a percentage with two decimals reads "0.00%" and is now muted, with no arrow; it took the up colour before, from the raw value, while its sign followed the rounded figure.
