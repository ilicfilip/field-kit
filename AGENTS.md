# Agent guide — emdash-plugin-field-kit

## What this is

A plugin for EmDash CMS that provides composable field widgets for `json` fields. It replaces the default plain text input with rich editing UIs configured entirely through seed `options` — no React code needed from site builders.

## Architecture

```
seed field definition ("widget": "field-kit:grid", "options": { ... })
  → EmDash splits on ":" → plugin "field-kit", widget "grid"
  → loads adminEntry (src/admin.tsx)
  → looks up fields["grid"] → Grid component
  → renders <Grid value={...} onChange={...} options={...} />
```

Three layers connect seed config to rendered UI:

1. **Plugin descriptor** (`src/index.ts`) — `fieldKitPlugin()` returns a `PluginDescriptor` with `adminEntry` pointing to the component file. `createPlugin()` / `definePlugin()` registers widget names and their compatible field types.

2. **Component map** (`src/admin.tsx`) — exports `fields` object mapping widget names to React components. EmDash looks up the widget name here at render time.

3. **Widget components** (`src/widgets/*.tsx`) — each receives `FieldWidgetProps` (`value`, `onChange`, `label`, `id`, `required`, `options`, `minimal`) and renders the editing UI. All widget-specific config comes from `options`.

## Key files

| File | Purpose |
|---|---|
| `src/index.ts` | Plugin descriptor + widget registration via `definePlugin()` |
| `src/admin.tsx` | Component map — maps widget names to React components |
| `src/widgets/object-form.tsx` | Inline form for flat JSON objects |
| `src/widgets/list.tsx` | Ordered array editor with add/remove/reorder |
| `src/widgets/grid.tsx` | Rows × columns matrix (toggle, text, number, select cells) |
| `src/widgets/tags.tsx` | Free-form tag/chip input for string arrays |
| `src/shared/sub-field.tsx` | Shared sub-field renderer (8 input types), used by object-form and list |
| `src/shared/types.ts` | TypeScript interfaces: `FieldWidgetProps`, `SubFieldDef`, `GridAxisDef` |
| `src/shared/utils.ts` | Data normalization (object, array, grid with legacy format migration, tags) and mustache summary renderer |

## How to add a new widget

1. Create `src/widgets/<name>.tsx` — export a component accepting `FieldWidgetProps`
2. Add `{ name: "<name>", label: "...", fieldTypes: [...] }` to `fieldWidgets` in `src/index.ts`
3. Add `"<name>": Component` to the `fields` map in `src/admin.tsx`

## Conventions

- **Styling**: Tailwind utility classes matching EmDash's admin design system (`border-input`, `bg-muted`, `text-muted-foreground`, etc.). No custom CSS.
- **Data normalization**: Every widget normalizes incoming `value` defensively (handles `undefined`, wrong types, legacy formats). Normalization functions live in `src/shared/utils.ts`.
- **No nesting**: Sub-fields are flat primitives (text, number, boolean, select, textarea, date, color, url). For deeper structures, use multiple `json` fields or Portable Text.
- **Refs for callbacks**: Widgets use `useRef` to hold current data so `useCallback` closures don't go stale.

## Peer dependencies

- `emdash` — provides `definePlugin`, `PluginDescriptor`, and the admin rendering host
- `react` 18 or 19

## Status

v0.1 — Tier 1 widgets (object-form, list, grid, tags) are implemented. Tier 2 (color, slider, rating, date-range) is planned but not yet built. No tests yet.
