---
'@sveltier/ui': minor
---

Add LocaleProvider: a part of the page in another locale. Figures and dates inside it (Amount, Delta, Odometer, tables and fields) are formatted with the `locale`, `currency` and `timeZone` it sets, and everything it leaves out comes from the provider above, messages included. An app in Vietnamese can then show a market table with figures in English digits, `76,088.0` and `+0.60%`, while its labels stay Vietnamese. It renders no element.
