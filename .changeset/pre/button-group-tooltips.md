---
'@sveltier/ui': patch
---

A ButtonGroup joins its Buttons when they are the triggers of Tooltips. Each Tooltip puts its bubble beside its Button, so the group's first, last and neighbour rules met the bubbles instead: doubled borders and rounded inner corners. They now count Buttons only.
