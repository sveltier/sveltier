---
'@sveltier/ui': minor
---

Overlays grow out of what opened them and shrink back into it as they close, so the eye can follow where they came from. Dialog grows out of the control that opened it (its trigger, `returnFocus`, or what had focus), Popover, Menu and the Select and Combobox list out of their trigger, and ContextMenu out of the pointer. Sheet keeps sliding from its edge. The new `grow` transition does it for your own elements: `transition:grow={{ from: () => button }}`. It scales about the source's centre, from the source's size (never below 38.2%) up to 94.4%, and pops in place when there is no source.
