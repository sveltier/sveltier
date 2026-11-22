---
'@sveltier/ui': minor
---

Two motion tokens join the theme contract. `--sv-duration-slower` (610ms in Monolith, Aurora and Milano, 987ms in Heritage and Maison) times an entrance that crosses the screen or reveals a page, and collapses to near zero under reduced motion like the other durations. `--sv-duration-loop` (1618ms) is the period of an indicator that loops: under reduced motion it turns φ² slower (4236ms) instead of collapsing, so a spinner never spins flat out. The spinners of Button and ProgressCircular, the indeterminate ProgressLinear, the loading bar of Table and the sweep of Skeleton take their period from it. `motion(element)` also returns `slower` and `loop`. A theme written out in full, without `defineTheme`, needs the two new variables.
