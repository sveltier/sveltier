# @sveltier/ui

## 0.1.0-alpha.6

### Minor Changes

- edfe179: The package now carries its docs for coding agents, generated from its types for this very version:

  - `llms.txt`: setup, conventions and an index, linking the pages below.
  - `llms-full.txt`.
  - `docs/<group>/<page>.md`: one page per component and primitive, with an example and every prop.
  - `components.json`: the same props as JSON.

  New command: `npx sveltier init`. It writes a Sveltier section into the app's `AGENTS.md` that points at those files; later runs replace it in place. If the app has a `CLAUDE.md`, it imports `AGENTS.md` there too. If the app has a `.claude` folder, it installs the Sveltier skill.

- 2222246: Chip: a filter chip (`selected` set) is outlined while off and takes its `variant` (tonal unless you set one) while on, with its check. It no longer switches to a solid `flat` fill when selected, which made a row of active filters loud on dark themes. Tags without `selected` are unchanged.

### Patch Changes

- 502c1af: Every public props type and function now has an `@example` in its TSDoc, so editors and coding agents see how to use it straight from the declarations: Alert, Avatar, Badge, Button, ButtonGroup, Card, Chip, Divider, Icon, List, ListItem, ProgressLinear, ProgressCircular, SegmentedControl, Skeleton, Tabs, the shared props, `useTheme`, `useDisplay`, `useLocale`, `themeCss`, `themeScript`, the colour helpers and the focus, keyboard and motion primitives.

## 0.1.0-alpha.5

### Minor Changes

- e2cdfdb: Add Guilloche: the fine interlaced lines of a banknote or a cheque, as decoration that fills its box. `pattern` is a `rosette` or `waves`, `lines` sets how many, and the hairlines are drawn faint in the `color`. One curve is drawn once and reused for every line, so the page stays small.
- 1e9b2b6: Add Ledger, LedgerRow and Receipt: labels and their figures joined by a dotted leader, as a description list, with the total under a double rule (`total`). A LedgerRow's figure is an Amount and follows its `masked`; children take its place. A Receipt is a section named by its `title`, with a `subtitle`, the rows and a `footer`. A LedgerRow outside a list warns in development (SV4006).
- 406ab57: Add Odometer: a headline figure whose digits roll to the new value when it changes. It is formatted as an Amount, with `format` and `decimals`, follows Amount's `masked`, is read as text by screen readers, and changes at once under reduced motion.
- 01ef658: Add PinPad: a PIN or passcode entered on a keypad of its own, with dots that fill as digits go in and keys 1–9, 0 and Delete in the phone layout. The digits are never shown or read aloud; screen readers hear how many are in. `oncomplete` runs with the PIN, `error` shows a message and shakes the dots, `shuffle` randomises the digits, `extra` fills the key beside 0, `name` submits it with a form, and the keyboard's digits and Backspace work while focus is in the pad.
- ccd984c: Add SecureMask: a secret such as an account or card number shown in part, "•••• 4821". The hidden characters are never written to the page. `toggle` adds a reveal button, `hideAfter` hides it again, and `revealed` is bindable.
- f57ab41: Add Timeline: what happened to something, in time, as an ordered list of events with a marker, a title, a time written in the locale and a description. `color` colours an event's marker, `pending` marks one still to come, `relative` writes "3 hours ago", and the `item` snippet renders an event's content.

## 0.1.0-alpha.4

### Minor Changes

- 6cbf8bb: Add `wrap` to Button: a long label wraps onto more lines, the button grows from its height (one line stays as tall as other controls) and the label starts at the inline start.
- e722e36: Add a `dense` density, half a step of φ below `default` (×0.786), for data-heavy screens: a Table with `size="xs" density="dense"` has rows about 20px tall. Table rows now keep the height of their size and density; the cell padding gives way first.
- 494d5de: Add OtpInput: a one-time code shown one character per box, as one input with
  `autocomplete="one-time-code"`, so the code from a text message, a paste and typing all work.
  Characters outside its `type` are dropped, `oncomplete` runs when the last box is filled, and a
  code started but not finished is invalid.

## 0.1.0-alpha.3

### Minor Changes

- 6d9a2eb: Combobox: one value found by typing, as the APG combobox with list autocomplete. The list under the field keeps the items whose label or description contains every word typed, ignoring case and diacritics ("da nang" finds Đà Nẵng), and points at the first match, so a few letters and Enter choose. It takes the items of a Select, groups and the `option` snippet included. `filter` takes a function, or `false` with `bind:query` and `loading` to search a server. An Enter that confirms an input method's word never chooses. Leaving the field puts back the chosen label over what was typed, and an emptied field clears the value.
- 8df20a5: Add CommandPalette: a search box over the app's commands in a modal dialog, opened from anywhere with Ctrl+K (⌘K on Apple platforms) or from a trigger. Typing filters the commands by every word, ignoring case and diacritics, over their labels, descriptions and keywords; the arrows move, Enter runs the active command and Escape closes. Commands can carry their own fields, which `onselect` receives typed.
- 002e503: ContextMenu: the actions on an element, opened where it is right-clicked, or below it with Shift+F10 or the ContextMenu key. Spread the attributes of its `target` snippet onto the element, or onto every row of a list or a Table (through `rowAttributes`); `onopen` receives the element it opened on. The menu is a Menu's, with the same items and keys, kept inside the window, and named by `label`.
- b8c40e3: DateTimeField: a date and a time of day in one field, its value `YYYY-MM-DDTHH:mm`, local, as `<input type="datetime-local">` gives it. The date is typed or chosen in a calendar as in a DatePicker, the time typed or stepped as in a TimeField; the value is set once both are there, and one without the other asks for both. `min` and `max` bound the whole value; `isDateDisabled` and `firstDayOfWeek` apply to the date.
- 2f84eaa: Calendar, DatePicker and DateRangePicker, on one month grid. Values are ISO dates (`YYYY-MM-DD`), which no time zone moves across midnight. DatePicker reads a date typed in the reader's order, with any separators or none, or starting with a four-digit year as ISO does; a two-digit year is read when the field is left, so the value never passes through 2020 on the way to 2026. Leaving the field writes the date back in the locale's format, in Gregorian years and Latin digits whatever the locale, and a button opens a Calendar in a popover. DateRangePicker holds a start and an end (`bind:start`, `bind:end`), chosen in one calendar, and submits both under one name. All three take `min`, `max`, `isDateDisabled` (a market's weekends and holidays, say) and `firstDayOfWeek`, which defaults to the locale's. The grid follows the APG date picker: arrows by day and week, Home and End to the week's ends, Page keys by month and with Shift by year, every day named with its full date, and in a range every day selected. A date prop that is not `YYYY-MM-DD`, such as a timestamp, warns in development (SV5002).
- 9a1cd00: Amount and Delta, figures for people to read. Amount formats a number, a price, money or a percentage in the locale with tabular figures and a true minus sign: `decimals` fixes the digits, `format` takes Intl options (money without a currency uses the locale's), and the defaults keep the data where Intl would round it away (up to 8 decimals for a number, 2 for a percentage). A missing value shows a dash, `dimFraction` shows the fraction in the subtle colour, and `masked` shows "••••", for one subtree at once through `DefaultsProvider`. Delta shows a change: always signed, a rise in the theme's up colour and a fall in its down colour, with an optional `arrow`. Both take `flash`, which washes the figure in the up or down colour as the value moves.
- 3037c73: PriceInput and AmountInput, and steps that change with the value. NumberField's `step` takes bands, such as `[{ from: 0, step: 10 }, { from: 10000, step: 50 }]`: each value must be a multiple of its band's step, and the keys and buttons move onto the start of the next band and down into the one below. PriceInput is a NumberField stepped by its `tick`, fixed or in bands, showing the finest tick's decimals, with `min` at the smallest tick. AmountInput is a NumberField with buttons for shares of `max` (25%, 50%, 75%, 100% by default), rounded down to whole steps so they never ask for more than there is.
- d8d3929: Select: one value chosen from a list that opens under the field, as the APG select-only combobox. The field keeps focus while the arrows, Home, End and the Page keys move through the options, typing the start of a label goes to it, and Enter, Space, a click or Tab chooses. Items can be grouped (`group`), carry a `description`, be disabled, and be drawn your own way with the `option` and `selection` snippets, which receive the item with any extra properties. It takes the props, defaults and validation of the other fields, and `name` submits the value.
- acef399: Add `Stepper`: the steps of a task done in order, in a row or a column, with the current step marked for screen readers, done steps that take the user back, and steps flagged with an error.
- d804301: Table: items in rows and typed columns. A column's `key` is a property of the items, so a typo is a type error that lists the real ones; an `id` with a `value` computes a column, and a `cell` snippet renders content of its own. Columns sort from their header (`sort: true` or a comparator, `bind:sortBy`), numbers line up at the end in tabular figures, the header stays in view while the table scrolls, and a table that overflows its box becomes a region the keyboard can scroll. `itemKey` keeps rows across live updates, `rowAttributes` marks the current row with `aria-current`, and `empty` and `loading` cover the states without rows.
- 043b33a: TimeField: a time of day as `HH:mm` on the 24-hour clock, the value `<input type="time">` gives, so an app moving off the native input keeps its values. It reads `9:30`, `0930`, `21.30`, `9:30 pm` and the locale's own day periods, waits for whole minutes while the time is typed, reads hours alone when the field is left, and writes the time in the locale's format (`09:30 PM` in en-US, `21:30` in en-GB). `min`, `max` and `step` (minutes) are checked with messages. The input is a spinbutton: the arrows move by `step`, the page keys by an hour, Home and End to `min` and `max`. SV5002 now also warns about a time that is not `HH:mm`.
- 084304a: Add Tree: nested nodes to browse and select one of, with the keys of the tree view pattern, `bind:value` and `bind:expanded`, typed nodes for `onselect` and the `item` snippet.

### Patch Changes

- 19b2c24: A disabled Select, Combobox, NumberField, DatePicker, DateRangePicker, TimeField or DateTimeField no longer submits its value with the form, as a disabled native control does not. A read-only one still does.
- 33a608c: A Popover or Menu opened again while it is still closing now takes focus again, as it does when it first opens: the panel that comes back is the same one, and focus used to stay on the trigger.

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
