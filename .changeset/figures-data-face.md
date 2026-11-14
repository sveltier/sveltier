---
'@sveltier/ui': minor
---

Figures are set in the theme's data face (`font-data`): Amount, Delta, Odometer, the value of a number field (and so of PriceInput and AmountInput), and the numbers a Table shows itself. Before, they took the font around them, and no component used the data face. For a figure inside a sentence, `font="inherit"` takes the font of the text around it; it is an Amount default, so `DefaultsProvider` sets it for a part of the page, and Delta and Odometer follow it.
