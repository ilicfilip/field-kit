# field-kit

> **This repo is archived.** field-kit was merged into EmDash core as a first-party plugin. Use [`@emdash-cms/plugin-field-kit`](https://www.npmjs.com/package/@emdash-cms/plugin-field-kit) instead.
>
> For future updates — for example if [PR #2](https://github.com/ilicfilip/field-kit/pull/2)'s `visibleWhen` lands in core — see [the blog post](https://filip.ilic.sh/blog/emdash-field-kit-plugin/). That's where I'll keep the running status.

field-kit started here as a standalone plugin that replaced the default plain text input on EmDash `json` fields with composable, seed-driven widgets — `object-form`, `list`, `grid`, and `tags`. The maintainer agreed to bring it into core, and it shipped as a first-party package via [PR #702](https://github.com/emdash-cms/emdash/pull/702).

## Migration

Same widgets, same seed config, same data shapes — only the package name changed.

```diff
- import { fieldKitPlugin } from "emdash-plugin-field-kit";
+ import { fieldKitPlugin } from "@emdash-cms/plugin-field-kit";
```

```diff
- "emdash-plugin-field-kit": "^x.y.z"
+ "@emdash-cms/plugin-field-kit": "^x.y.z"
```

Seed configs (`"widget": "field-kit:list"`, `options`, sub-field definitions) and stored JSON are unchanged.

## Possible follow-up: `visibleWhen`

[PR #2](https://github.com/ilicfilip/field-kit/pull/2) on this repo prototyped conditional sub-field visibility — sub-fields in `object-form` and `list` can declare a `visibleWhen` rule and hide when a sibling value doesn't match. It's flagged as a follow-up in the [EmDash core PR](https://github.com/emdash-cms/emdash/pull/702) and may land in the first-party package next.

## Links

- [`@emdash-cms/plugin-field-kit` on npm](https://www.npmjs.com/package/@emdash-cms/plugin-field-kit)
- [Source in the EmDash monorepo](https://github.com/emdash-cms/emdash/tree/main/packages/plugins/field-kit)
- [PR #702 — adding the plugin to core](https://github.com/emdash-cms/emdash/pull/702)
- [Discussion #571 — original proposal](https://github.com/emdash-cms/emdash/discussions/571)
- [Background blog post](https://filip.ilic.sh/blog/emdash-field-kit-plugin/)

## License

MIT
