## Sveltier (`@sveltier/ui`)

This app's interface is built with Sveltier, a UI framework for Svelte 5. The docs of the installed version ship inside the package. Read them before writing UI code:

- `node_modules/@sveltier/ui/llms.txt`: setup, conventions and an index of every component.
- `node_modules/@sveltier/ui/docs/<group>/<page>.md`: one page per component, with an example and every prop.
- `node_modules/@sveltier/ui/components.json`: the same props as JSON.
- The types: every component exports `<Name>Props`, with an `@example`.

Rules, for code that does not say otherwise (where this app's own instructions or a comment in the code make an exception, keep it):

- Svelte 5 only: runes, snippets and callback props (`onclick`). Never write `export let`, `on:click`, `<slot>`, `createEventDispatcher` or `$:`.
- Use the shared props (`variant`, `size`, `density`, `color`, `rounded`) rather than restyling components. In your own CSS, use the theme's `--sv-*` variables, never fixed colours.
- Figures go through `Amount` and `Delta`, dates are ISO strings (`'YYYY-MM-DD'`), and toasts come from `useToast()`.
- A message that starts with `[sveltier SVxxxx]` says what went wrong and how to fix it. Do what it says.
- With Tailwind 4, or CSS layers of your own, declare the order in `src/app.html` (or `index.html`) before any stylesheet: `<style>@layer theme, base, sv, components, utilities;</style>`.
