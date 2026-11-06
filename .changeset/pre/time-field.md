---
'@sveltier/ui': minor
---

TimeField: a time of day as `HH:mm` on the 24-hour clock, the value `<input type="time">` gives, so an app moving off the native input keeps its values. It reads `9:30`, `0930`, `21.30`, `9:30 pm` and the locale's own day periods, waits for whole minutes while the time is typed, reads hours alone when the field is left, and writes the time in the locale's format (`09:30 PM` in en-US, `21:30` in en-GB). `min`, `max` and `step` (minutes) are checked with messages. The input is a spinbutton: the arrows move by `step`, the page keys by an hour, Home and End to `min` and `max`. SV5002 now also warns about a time that is not `HH:mm`.
