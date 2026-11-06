---
'@sveltier/ui': minor
---

DateTimeField: a date and a time of day in one field, its value `YYYY-MM-DDTHH:mm`, local, as `<input type="datetime-local">` gives it. The date is typed or chosen in a calendar as in a DatePicker, the time typed or stepped as in a TimeField; the value is set once both are there, and one without the other asks for both. `min` and `max` bound the whole value; `isDateDisabled` and `firstDayOfWeek` apply to the date.
