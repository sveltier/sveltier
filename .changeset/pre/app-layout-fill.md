---
'@sveltier/ui': minor
---

`AppLayout` takes `fill` for an app whose panes scroll on their own, such as a trading terminal: the layout is the window's height and the page never scrolls. Main takes the height the bar leaves and scrolls on its own when its content is taller; content with `block-size: 100%` fills it, and the drawer fills its area. A breakpoint fills only from its width up (`fill="md"`, from 960px): below it the page scrolls, so a phone's browser bars collapse as the page moves. The switch is in CSS, so the server renders it right. The bar's height, `--sv-app-bar-height`, is now documented for content that places itself under a sticky bar.
