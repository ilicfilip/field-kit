import type { SubFieldDef, GridAxisDef, VisibleWhenCondition } from "./types";

/**
 * Normalize a value into a plain object keyed by sub-field definitions.
 * Missing keys get their defaultValue (or undefined). Unknown keys are stripped.
 */
export function normalizeObject(
	value: unknown,
	fields: SubFieldDef[],
): Record<string, unknown> {
	const obj: Record<string, unknown> = {};
	const source =
		value && typeof value === "object" && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: {};
	for (const field of fields) {
		obj[field.key] =
			source[field.key] !== undefined ? source[field.key] : (field.defaultValue ?? undefined);
	}
	return obj;
}

/** Normalize a value into an array. Non-arrays become empty arrays. */
export function normalizeArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

/**
 * Normalize a grid value into `{ rowKey: { colKey: cellValue } }`.
 *
 * Handles two input formats:
 * - Object format: `{ jan: { leaf: true, fruit: true } }` (canonical)
 * - Array format: `{ jan: ["leaf", "fruit"] }` (legacy, e.g. harvest calendar)
 *
 * Missing rows are initialized as empty objects.
 */
export function normalizeGrid(
	value: unknown,
	rows: GridAxisDef[],
	columns: GridAxisDef[],
): Record<string, Record<string, unknown>> {
	const out: Record<string, Record<string, unknown>> = {};
	for (const row of rows) {
		out[row.key] = {};
	}

	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return out;
	}

	const source = value as Record<string, unknown>;
	for (const row of rows) {
		const rowVal = source[row.key];
		if (Array.isArray(rowVal)) {
			// Legacy array format: convert ["leaf", "fruit"] → { leaf: true, fruit: true }
			for (const code of rowVal) {
				if (typeof code === "string") {
					out[row.key][code] = true;
				}
			}
		} else if (rowVal && typeof rowVal === "object") {
			// Object format: copy known column values
			const rowObj = rowVal as Record<string, unknown>;
			for (const col of columns) {
				if (rowObj[col.key] !== undefined) {
					out[row.key][col.key] = rowObj[col.key];
				}
			}
		}
	}

	return out;
}

/** Normalize a value into a string array. Filters out non-strings. */
export function normalizeTags(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
}

/**
 * Evaluate a sub-field's `visibleWhen` condition against its sibling values.
 * Returns true when no condition is set. Uses strict equality.
 */
export function isSubFieldVisible(
	condition: VisibleWhenCondition | undefined,
	siblings: Record<string, unknown>,
): boolean {
	if (!condition) return true;
	const actual = siblings[condition.field];
	if ("equals" in condition) return actual === condition.equals;
	if ("notEquals" in condition) return actual !== condition.notEquals;
	return true;
}

/**
 * Render a simple mustache-style summary template.
 * Replaces `{{key}}` with the corresponding value from `item`.
 */
export function renderSummary(
	template: string,
	item: Record<string, unknown>,
): string {
	return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
		const val = item[key];
		if (val === undefined || val === null) return "";
		return String(val);
	});
}
