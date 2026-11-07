---
'@sveltier/ui': patch
---

Menu, ContextMenu, Tree and CommandPalette: an item's `icon` accepts the components of any icon set in TypeScript. It was typed `Component<object>`, which turned away components whose props take every SVG attribute, such as phosphor-svelte's, so they needed a cast. It is now `Component<any>`.
