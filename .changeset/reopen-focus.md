---
'@sveltier/ui': patch
---

Dialog, Sheet and CommandPalette: opened again while they are still closing, they take focus back inside. Before, focus stayed on the page, so a palette opened with its shortcut right after it closed showed its search box but typing went nowhere.
