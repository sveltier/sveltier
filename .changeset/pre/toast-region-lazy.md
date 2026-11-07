---
'@sveltier/ui': patch
---

The toast region, with its styles and motion, is no longer part of what every page loads first: it loads once the page is idle, or as soon as a toast shows if that is sooner. The live regions that read toasts out stay in the page from the start, so the first toast is read out all the same. The core every app loads (UIProvider) drops from 7.25 KB to 5.6 KB gzipped.
