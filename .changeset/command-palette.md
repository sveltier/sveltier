---
'@sveltier/ui': minor
---

Add CommandPalette: a search box over the app's commands in a modal dialog, opened from anywhere with Ctrl+K (⌘K on Apple platforms) or from a trigger. Typing filters the commands by every word, ignoring case and diacritics, over their labels, descriptions and keywords; the arrows move, Enter runs the active command and Escape closes. Commands can carry their own fields, which `onselect` receives typed.
