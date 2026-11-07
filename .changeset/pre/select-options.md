---
'@sveltier/ui': minor
---

**Breaking:** Select and Combobox take their choices as `options`, as NativeSelect, RadioGroup and SegmentedControl do and as their `option` snippet already said. The type is `SelectOption`. `items` does nothing now and warns in development (SV4008) with the new name; `SelectItem` stays a deprecated name for `SelectOption` until beta.
