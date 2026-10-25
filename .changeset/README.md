# Changesets

A pull request that changes what users of `@sveltier/ui` get adds a changeset: a short Markdown
file that names the kind of bump and says what changed, for the people who upgrade.

```sh
pnpm changeset
```

The package is in prerelease mode with the `alpha` tag. To release, `pnpm changeset version`
turns the pending changesets into the next `0.1.0-alpha.N`: it writes the entry in
`packages/sveltier/CHANGELOG.md` and the version in `package.json`. Merging that change into
`main` stages the version on npm once CI passes.
