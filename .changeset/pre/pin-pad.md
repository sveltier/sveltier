---
'@sveltier/ui': minor
---

Add PinPad: a PIN or passcode entered on a keypad of its own, with dots that fill as digits go in and keys 1–9, 0 and Delete in the phone layout. The digits are never shown or read aloud; screen readers hear how many are in. `oncomplete` runs with the PIN, `error` shows a message and shakes the dots, `shuffle` randomises the digits, `extra` fills the key beside 0, `name` submits it with a form, and the keyboard's digits and Backspace work while focus is in the pad.
