---
'@sveltier/ui': minor
---

Menu and ContextMenu items can show whether they are on. `checked` makes an item a `menuitemcheckbox` with a tick when on; `radio` makes it a `menuitemradio`, one choice of its group (the items between two headings or separators), with a tick on the checked one. The app keeps the state and updates it in `onselect`. Labels line up once one item can be checked. In development, a group that mixes radios with other items, or checks more than one, warns (SV4009).
