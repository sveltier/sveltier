---
'@sveltier/ui': patch
---

`BottomNavigation` takes `rounded`, for the corners of the marker behind the current destination's icon. `true`, the default, keeps the pill; a size takes the theme's radius, so a square-cornered theme can set `defaults={{ BottomNavigation: { rounded: 'md' } }}` once and the marker matches the rest of the app.
