---
'@sveltier/ui': minor
---

New `AppFooter`: a status bar along the bottom of an `AppLayout`, one line a control tall, such as a market clock or the state of a connection. The layout places it under the content, as wide as the bar (beside a drawer written first), and it is the page's contentinfo landmark, which a footer inside `Main` is not. `sticky` keeps it at the bottom of the window while the page scrolls, and a drawer under the bar leaves room for it. Its `density` and `sticky` can be set for a subtree with `DefaultsProvider`.
