---
'@sveltier/ui': minor
---

Add OtpInput: a one-time code shown one character per box, as one input with
`autocomplete="one-time-code"`, so the code from a text message, a paste and typing all work.
Characters outside its `type` are dropped, `oncomplete` runs when the last box is filled, and a
code started but not finished is invalid.
