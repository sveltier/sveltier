# @sveltier/ui

## 0.1.0-alpha.9

### Minor Changes

- 60c5968: A `List` with `nav` in `AppBar`'s `nav` lays out in a row: the rounded rows and the active wash it has in the drawer, each row as wide as its text, and `ListItem active` marked as the current page (`aria-current="page"`). The same links serve the bar and the drawer, so a `modal` drawer and the bar can share one snippet.
- b073542: `AppBar` takes a `prepend` snippet for the app's mark: after the menu button and before the title, at every width, usually a link home with the logo and the name. A brand no longer has to be written twice, once in `nav` for wide screens and once more for narrow ones.
- 80ebd0c: New `AppFooter`: a status bar along the bottom of an `AppLayout`, one line a control tall, such as a market clock or the state of a connection. The layout places it under the content, as wide as the bar (beside a drawer written first), and it is the page's contentinfo landmark, which a footer inside `Main` is not. `sticky` keeps it at the bottom of the window while the page scrolls, and a drawer under the bar leaves room for it. Its `density` and `sticky` can be set for a subtree with `DefaultsProvider`.
- 80e178d: `AppLayout` takes `fill` for an app whose panes scroll on their own, such as a trading terminal: the layout is the window's height and the page never scrolls. Main takes the height the bar leaves and scrolls on its own when its content is taller; content with `block-size: 100%` fills it, and the drawer fills its area. A breakpoint fills only from its width up (`fill="md"`, from 960px): below it the page scrolls, so a phone's browser bars collapse as the page moves. The switch is in CSS, so the server renders it right. The bar's height, `--sv-app-bar-height`, is now documented for content that places itself under a sticky bar.
- 6d4cf91: Toasts keep clear of an `AppFooter` on their own, at their usual distance above it, whatever its density. A Toast `inset` is no longer needed for it; when one is given, the toasts take the larger of the two.

### Patch Changes

- 7637d5c: The code samples in the packed docs (`llms-full.txt`, `docs/*.md`) are compiled before each release, so each one runs as written when copied alone: every sample imports what it uses and declares the values it reads. Samples that leaned on names they never defined (an icon path, a `user`, a `loading` flag, the page's own components) now define them, and a few JavaScript samples are TypeScript where they need types. The `keymap` sample uses block bodies, since a handler that returns a value other than `false` does not fit `KeyHandler`. The samples are indented with tabs, as Prettier and `sv create` write them.
- 7bc09a0: Visually hidden text no longer adds a pixel to the page's height. The toast live regions, which stay in the page since the toast region loads apart, made an app whose content is exactly the window's height scroll by 1px. The hidden box now has `margin: -1px`, so it stays at its place without reaching past the content.

## 0.1.0-alpha.8

### Minor Changes

- 9b1211b: **Breaking:** an Accordion item names its header with `label`, as a tab does, instead of `title`. `title` does nothing now and warns in development (SV4008) with the new name. Timeline items keep `title`: theirs is a heading.
- a9c8e75: Checkbox, Switch and RadioGroup: `onchange` receives the new value when the user changes it, as on Select, Combobox and the date fields: `checked` for Checkbox and Switch, the picked value (in its type) for RadioGroup. It is not called when the value is set from code. Before, a caller's `onchange` reached the input as a DOM event on Checkbox and Switch, and was dropped on RadioGroup; a handler that read `event.currentTarget.checked` now takes the boolean instead.
- 8d0f122: Every field's `onchange` receives its value, as Select, Combobox, Switch and the date fields' already do. TextField and Textarea call it with the text when the user leaves the field after changing it. NumberField, PriceInput and AmountInput call it with the number when it is committed: on leaving after typing, on each step, and on a share; `null` once emptied. Slider calls it on release. NativeSelect calls it with the value in its type, OtpInput with the code (`oncomplete` is unchanged), and a filter Chip with `selected`. None is called when the value is set from code. **Breaking:** a DOM `onchange` passed to these fields now receives the value instead of an event; `oninput` is still the DOM event.
- bfe4acd: Menu, ContextMenu and Tree take `size`, as Select and the fields do: it sets the text and the rows, a row being a step lower than a control of the same size. The default, `md`, keeps them as they were.
- c42d9d9: **Breaking:** Select and Combobox take their choices as `options`, as NativeSelect, RadioGroup and SegmentedControl do and as their `option` snippet already said. The type is `SelectOption`. `items` does nothing now and warns in development (SV4008) with the new name; `SelectItem` stays a deprecated name for `SelectOption` until beta.

### Patch Changes

- e7a99d9: Delta: a change that rounds to zero at the digits shown is no change. 0.00001 as a percentage with two decimals reads "0.00%" and is now muted, with no arrow; it took the up colour before, from the raw value, while its sign followed the rounded figure.
- 562547b: NavigationDrawer: `onclose` tells why the modal drawer closed itself, as Dialog, Sheet and Popover do: `'escape'`, `'outside'`, or `'action'` when a link in it is followed.
- 2631755: Menu, ContextMenu, Tree and CommandPalette: an item's `icon` accepts the components of any icon set in TypeScript. It was typed `Component<object>`, which turned away components whose props take every SVG attribute, such as phosphor-svelte's, so they needed a cast. It is now `Component<any>`.
- 3eb3872: The conventions in `llms.txt` and `components.json` state the naming rules agents can carry from one component to the next: choices are `options` and other lists `items`, a control's text is `label` and a heading `title`, and every field calls `onchange` with its value.
- 6027d96: The docs in the package mark the props a component requires, such as PriceInput's `tick`: `(required)` after the name in the Markdown prop tables, `required: true` in `components.json`, and those props listed first. Before, only the types said so.
- 9358d2c: The toast region, with its styles and motion, is no longer part of what every page loads first: it loads once the page is idle, or as soon as a toast shows if that is sooner. The live regions that read toasts out stay in the page from the start, so the first toast is read out all the same. The core every app loads (UIProvider) drops from 7.25 KB to 5.6 KB gzipped.
- 3914cfe: Tooltip: development builds warn (SV4007) when the control's `aria-describedby` replaced the tooltip's id, as one written after the trigger's attributes does, for a Badge's count say, and the tooltip was no longer read. The warning shows how to join the ids, and the Badge and Tooltip docs show a button described by both.

## 0.1.0-alpha.7

### Minor Changes

- fd87d57: AppLayout: links in the bar on a wide screen, a modal drawer on a phone. `AppBar` takes a `nav` snippet: links across the bar, in a navigation landmark, that show only while the menu button does not, from the drawer's breakpoint up. `NavigationDrawer` takes `modal`: below its breakpoint it opens from the menu button as before, and from the breakpoint up there is no drawer. Together they keep one frame at every width, so a phone turned to landscape does not rebuild the page.
- 8989bdb: Menu, ContextMenu, Tree and CommandPalette: an item's `icon` takes an icon component of any set as well as an SVG path, such as `{ label: 'Markets', icon: ChartLine }` with phosphor-svelte. The component is drawn in the box of a path icon, at the size and colour of the text, whatever size it draws itself at, and hidden from screen readers.
- 00abf75: Add LocaleProvider: a part of the page in another locale. Figures and dates inside it (Amount, Delta, Odometer, tables and fields) are formatted with the `locale`, `currency` and `timeZone` it sets, and everything it leaves out comes from the provider above, messages included. An app in Vietnamese can then show a market table with figures in English digits, `76,088.0` and `+0.60%`, while its labels stay Vietnamese. It renders no element.
- 8871a63: Table: a column's `cell` snippet receives the column after the row's item, so one snippet serves columns built from data: a column per venue, say, reading `column.id`. Snippets that take only the item keep working.
- a4e18cd: Tabs: `fill` makes the Tabs take the height they are given. The tab list stays and the selected panel takes the rest. The panel's last child stretches into it, so a Table there scrolls in its own box under a sticky header, while filters above it stay put.
- 797a354: Toast: the `inset` default keeps the toasts above a bar the app keeps along the bottom of the screen, such as a status bar: `defaults={{ Toast: { inset: 22 } }}` lifts them by its height in px, at their usual distance above it. On a phone, the safe area counts instead when it is taller.

### Patch Changes

- d598e06: `npx sveltier init` works for an app in a folder of a workspace, such as `web/` in a pnpm workspace. Run in the app's folder, it finds the repository root above it (the first folder with `.git` or `pnpm-workspace.yaml`, below the home folder):

  - the app's `AGENTS.md` says which folder its paths are relative to;
  - the root's `CLAUDE.md` imports it (`@web/AGENTS.md`);
  - the skill goes in the root's `.claude`, with its paths written from there (`web/node_modules/@sveltier/ui/…`).

  A package hoisted to the workspace root is found too. A skill that is already up to date is left as it is. The block's rules now say they give way to the app's own instructions, so agents keep a page's deliberate exceptions.

- 5552f26: Dialog, Sheet and CommandPalette: opened again while they are still closing, they take focus back inside. Before, focus stayed on the page, so a palette opened with its shortcut right after it closed showed its search box but typing went nowhere.

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
