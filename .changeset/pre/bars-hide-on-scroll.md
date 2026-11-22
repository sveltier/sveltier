---
'@sveltier/ui': minor
---

`hideOnScroll` on `AppBar`, `AppFooter` and `BottomNavigation`: the bars slide out of the way while the page is read on and come back as it moves up, as reading apps do. `true` hides them at every width, a breakpoint only below its width. A bar comes back near the top of the page and stays while it holds the keyboard focus or an open menu; the page travels a few pixels one way before the bars follow; under reduced motion they do not slide. While the bottom navigation is away, a sticky footer takes its place and toasts take its room. All three can be set through `defaults`. A new dev warning, SV4012, names a bar given `hideOnScroll` without `sticky`.
