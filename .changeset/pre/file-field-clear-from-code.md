---
'@sveltier/ui': patch
---

`FileField` clears its input without a `DataTransfer` when code sets `files` to an empty list, as its clear button does. An app's unit tests in a DOM without `DataTransfer`, such as jsdom, no longer throw when the page clears the field.
