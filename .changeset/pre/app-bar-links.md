---
'@sveltier/ui': minor
---

AppLayout: links in the bar on a wide screen, a modal drawer on a phone. `AppBar` takes a `nav` snippet: links across the bar, in a navigation landmark, that show only while the menu button does not, from the drawer's breakpoint up. `NavigationDrawer` takes `modal`: below its breakpoint it opens from the menu button as before, and from the breakpoint up there is no drawer. Together they keep one frame at every width, so a phone turned to landscape does not rebuild the page.
