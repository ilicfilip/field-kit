# emdash-plugin-field-kit

Composable field widgets for [EmDash CMS](https://emdash.dev). Replaces the default plain text input on `json` fields with rich, configurable editing UIs — no React code required.

## Install

```ts
// astro.config.mjs
import { fieldKitPlugin } from "emdash-plugin-field-kit";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [fieldKitPlugin()],
    }),
  ],
});
```

## Usage

Add `widget` and `options` to any field in your seed file:

```json
{
  "slug": "ingredients",
  "type": "json",
  "widget": "field-kit:list",
  "options": {
    "itemLabel": "Ingredient",
    "sortable": true,
    "fields": [
      { "key": "name", "label": "Name", "type": "text" },
      { "key": "amount", "label": "Amount", "type": "text" },
      { "key": "optional", "label": "Optional", "type": "boolean" }
    ],
    "summary": "{{name}} — {{amount}}"
  }
}
```

## Widgets

### `field-kit:object-form`

Inline form for a flat JSON object. Stores `{ key: value, ... }`.

| Option | Type | Description |
|---|---|---|
| `fields` | `SubFieldDef[]` | **Required.** Sub-field definitions |
| `collapsed` | `boolean` | Start collapsed (default: `false`) |
| `helpText` | `string` | Help text below the widget |

### `field-kit:list`

Ordered array editor with add/remove/reorder. Stores `[{ ... }, ...]`.

| Option | Type | Description |
|---|---|---|
| `fields` | `SubFieldDef[]` | **Required.** Sub-field definitions per item |
| `itemLabel` | `string` | Label for items (default: `"Item"`) |
| `min` / `max` | `number` | Min/max item count |
| `sortable` | `boolean` | Enable reorder (default: `true`) |
| `summary` | `string` | Mustache template for collapsed row label, e.g. `"{{name}} — {{amount}}"` |

### `field-kit:grid`

Rows × columns matrix with configurable cell type. Stores `{ rowKey: { colKey: cellValue } }`.

| Option | Type | Description |
|---|---|---|
| `rows` | `GridAxisDef[]` | **Required.** Row definitions (`{ key, label, image? }`) |
| `columns` | `GridAxisDef[]` | **Required.** Column definitions |
| `cell` | `"toggle" \| "text" \| "number" \| "select"` | Cell input type (default: `"toggle"`) |
| `cellOptions` | `SelectOption[]` | Options for `cell: "select"` |

Handles legacy array-format data (e.g. `{ jan: ["leaf"] }`) and normalizes to object format on save.

### `field-kit:tags`

Free-form tag/chip input. Stores `["tag1", "tag2"]`.

| Option | Type | Description |
|---|---|---|
| `placeholder` | `string` | Input placeholder |
| `max` | `number` | Maximum number of tags |
| `suggestions` | `string[]` | Autocomplete suggestions |
| `allowCustom` | `boolean` | Allow values not in suggestions (default: `true`) |
| `transform` | `"lowercase" \| "uppercase" \| "trim" \| "none"` | Normalize input (default: `"none"`) |

## Sub-field types

Used by `object-form` and `list` in their `fields` array:

`text`, `number`, `boolean`, `select`, `textarea`, `date`, `color`, `url`

Each sub-field supports: `key`, `label`, `type`, `required`, `placeholder`, `helpText`, `defaultValue`. Number fields add `min`, `max`, `step`, `suffix`, `prefix`. Select fields add `options`. Textarea adds `rows`.

## Data shapes

Widgets store clean JSON. Removing the plugin leaves valid data in the database — you just lose the editing UI.

| Widget | Stored value |
|---|---|
| `object-form` | `{ "calories": 250, "protein": 12.5 }` |
| `list` | `[{ "name": "Flour", "amount": "500g" }, ...]` |
| `grid` | `{ "jan": { "leaf": true, "fruit": true } }` |
| `tags` | `["organic", "seasonal"]` |

## License

MIT
