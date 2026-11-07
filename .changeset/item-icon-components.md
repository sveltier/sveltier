---
'@sveltier/ui': minor
---

Menu, ContextMenu, Tree and CommandPalette: an item's `icon` takes an icon component of any set as well as an SVG path, such as `{ label: 'Markets', icon: ChartLine }` with phosphor-svelte. The component is drawn in the box of a path icon, at the size and colour of the text, whatever size it draws itself at, and hidden from screen readers.
