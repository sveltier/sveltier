---
'@sveltier/ui': patch
---

Steps and ticks below a millionth keep their decimals. Their count was read from how `String` writes the step, and `String(1e-7)` is `"1e-7"`, so AmountInput's shares rounded to 0, PriceInput showed a 1e-8 tick's prices with no decimals, NumberField's keys stepped to 0, and Slider's tick marks all sat at 0. The decimals now count the exponent, for the lots and ticks of coins traded in units of 1e-8.
