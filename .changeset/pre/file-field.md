---
'@sveltier/ui': minor
---

New `FileField`: a file to choose, in the same field as a TextField. The control is the platform's own `<input type="file">` over the whole box, so the keyboard, screen readers, `required`, `accept` and form data work as they do natively, while the box shows "Choose a file" and the chosen names (or how many). `files` is a bindable array and `onchange(files)` is called when the user chooses, drops or clears; files set from code go into the input, so a form submits what the field shows. `drop` makes the box a taller place to drop files, marked while one is dragged over, and a dropped file of a kind `accept` does not name is an error. A clear button empties it. Label, hint, error, rules and the Field's look work as on every field.
