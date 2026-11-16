---
'@sveltier/ui': minor
---

Menu and ContextMenu items take `href` (with `target` and `rel`) and render as links, so a page can be opened in a new tab and preloaded. Enter, Space or a click follows the link, closes the menu and calls `onselect`; a click with a modifier key is left to the browser and the menu stays open. `current` marks the link to the page shown with `aria-current="page"` and a tick. In development, a link with `checked` or `radio`, or `current` on an item that is no link, warns (SV4011).
