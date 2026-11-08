---
'@sveltier/ui': patch
---

Visually hidden text no longer adds a pixel to the page's height. The toast live regions, which stay in the page since the toast region loads apart, made an app whose content is exactly the window's height scroll by 1px. The hidden box now has `margin: -1px`, so it stays at its place without reaching past the content.
