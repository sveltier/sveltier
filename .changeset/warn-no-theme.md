---
'@sveltier/ui': patch
---

In development, the first component that renders with no theme warns once (`SV1008`), with the root-layout setup that fixes it. Before, such a page raised nothing and only looked unstyled. A page themed by a provider, or by `themeCss` without one, stays quiet.
