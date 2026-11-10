---
'@sveltier/ui': patch
---

`npx sveltier init` says when the app's root layout (`src/routes/+layout.svelte`, or `src/App.svelte` with Vite alone) has no `UIProvider` yet, since a page without it renders with no theme and raises no error.
