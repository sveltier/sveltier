---
'@sveltier/ui': minor
---

New `BottomNavigation`: a phone's three to five main destinations along the bottom of the screen, each an icon over a short label, the page shown marked `current` (`aria-current="page"`). It shows below its `breakpoint` (`md` by default) and is left out from it up, in a navigation landmark named "Main". In an `AppLayout` it takes a row under the content and the footer: `Main` takes the height it leaves with `fill`, and otherwise it stays at the bottom of the window while the page scrolls. Below its breakpoint the app bar's `nav` gives way to it, a sticky `AppFooter` sits on top of it, toasts and scrolled-to content keep clear of it, and the bottom safe-area inset is added under it.
