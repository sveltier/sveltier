---
'@sveltier/ui': patch
---

`FileField`'s message for a file of another kind names the extensions in `accept`, joined in the locale's words: "Choose a file of type .png or .jpg" where it showed the raw `image/png,.png,.jpg`. With no extensions it names the media types. The locale's `fileType` message still changes the words.
