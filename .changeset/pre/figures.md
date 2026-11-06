---
'@sveltier/ui': minor
---

Amount and Delta, figures for people to read. Amount formats a number, a price, money or a percentage in the locale with tabular figures and a true minus sign: `decimals` fixes the digits, `format` takes Intl options (money without a currency uses the locale's), and the defaults keep the data where Intl would round it away (up to 8 decimals for a number, 2 for a percentage). A missing value shows a dash, `dimFraction` shows the fraction in the subtle colour, and `masked` shows "••••", for one subtree at once through `DefaultsProvider`. Delta shows a change: always signed, a rise in the theme's up colour and a fall in its down colour, with an optional `arrow`. Both take `flash`, which washes the figure in the up or down colour as the value moves.
