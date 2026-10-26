---
'@sveltier/ui': minor
---

PriceInput and AmountInput, and steps that change with the value. NumberField's `step` takes bands, such as `[{ from: 0, step: 10 }, { from: 10000, step: 50 }]`: each value must be a multiple of its band's step, and the keys and buttons move onto the start of the next band and down into the one below. PriceInput is a NumberField stepped by its `tick`, fixed or in bands, showing the finest tick's decimals, with `min` at the smallest tick. AmountInput is a NumberField with buttons for shares of `max` (25%, 50%, 75%, 100% by default), rounded down to whole steps so they never ask for more than there is.
