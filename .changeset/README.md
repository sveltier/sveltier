# Changesets

A pull request that changes what users of `@sveltier/ui` get adds a changeset: a short Markdown
file that names the kind of bump and says what changed, for the people who upgrade.

```sh
pnpm changeset
```

While the package is at 0.x, `npm install` pins users to one minor version (`^0.1.0` takes 0.1.x
only), so the bump says whether an upgrade is safe:

- `patch`: a fix or a new feature that breaks nothing.
- `minor`: a breaking change. Its changeset says how to upgrade.

To release, `pnpm changeset version` turns the pending changesets into the next version: it writes
the entry in `packages/sveltier/CHANGELOG.md` and the version in `package.json`. Merging that change
into `main` publishes the version on npm once CI passes.
