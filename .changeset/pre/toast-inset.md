---
'@sveltier/ui': minor
---

Toast: the `inset` default keeps the toasts above a bar the app keeps along the bottom of the screen, such as a status bar: `defaults={{ Toast: { inset: 22 } }}` lifts them by its height in px, at their usual distance above it. On a phone, the safe area counts instead when it is taller.
