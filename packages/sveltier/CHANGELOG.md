# @sveltier/ui

## 0.1.0-alpha.2

### Minor Changes

- AppLayout, with AppBar, NavigationDrawer and Main: the frame of an app on a CSS grid, which the
  server renders as it stays. Below its breakpoint the drawer becomes a modal drawer, opened from
  a menu button in the bar, and `rail` narrows it to its icons. (#23)
- Container, Row and Col: a twelve-column grid, with spans per breakpoint. (#23)
- Breadcrumbs and Pagination. (#21)

### Patch Changes

- The README lists every part of the package. (#24)

## 0.1.0-alpha.1

### Minor Changes

- Dialog, Sheet, Popover, Menu and Tooltip, shown in the browser's top layer. (#15)
- Toasts with an undo action, from `useToast()`. (#17)
- Accordion, on the platform's `<details>` element. (#19)

### Patch Changes

- A container with the `plain` variant no longer turns off the hover and press washes of the
  controls inside it. (#18)

## 0.1.0-alpha.0

### Minor Changes

- The theme engine and five theme packs (Monolith, Heritage, Aurora, Maison and Milano), each in
  light and dark, rendered by the server without a flash of the wrong theme.
- `UIProvider`, defaults, display breakpoints and locale, and the shared props `variant`,
  `size`, `density`, `color` and `rounded`.
- Primitives for focus, layers, positioning, keyboard, motion and virtual lists.
- Components: Alert, Avatar, Badge, Button, ButtonGroup, Card, Chip, Divider, Icon, List,
  ProgressCircular, ProgressLinear, SegmentedControl, Skeleton and Tabs.
- Forms: Form, Field, TextField, Textarea, NumberField, NativeSelect, Checkbox, Switch,
  RadioGroup and Slider, validated by the HTML constraints first, then your rules.
- Errors and development warnings with stable `SVxxxx` codes that say what to do.
