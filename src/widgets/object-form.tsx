import * as React from "react";
import type { FieldWidgetProps, SubFieldDef } from "../shared/types";
import { normalizeObject } from "../shared/utils";
import { SubField } from "../shared/sub-field";

/**
 * Object form widget — renders a group of typed sub-fields that store as a
 * single JSON object.
 *
 * Seed usage:
 *   {
 *     "slug": "nutrition",
 *     "type": "json",
 *     "widget": "field-kit:object-form",
 *     "options": {
 *       "fields": [
 *         { "key": "calories", "label": "Calories", "type": "number", "suffix": "kcal" },
 *         { "key": "protein", "label": "Protein", "type": "number", "suffix": "g" }
 *       ]
 *     }
 *   }
 *
 * Stored value: { "calories": 250, "protein": 12.5 }
 */
export function ObjectForm({
	value,
	onChange,
	label,
	required,
	options,
	minimal,
}: FieldWidgetProps) {
	const fields = (options?.fields as SubFieldDef[] | undefined) ?? [];
	const collapsed = options?.collapsed as boolean | undefined;
	const helpText = options?.helpText as string | undefined;

	const [isOpen, setIsOpen] = React.useState(!collapsed);

	const data = normalizeObject(value, fields);
	const dataRef = React.useRef(data);
	dataRef.current = data;

	const handleFieldChange = React.useCallback(
		(key: string, fieldValue: unknown) => {
			onChange({ ...dataRef.current, [key]: fieldValue });
		},
		[onChange],
	);

	if (fields.length === 0) {
		return (
			<div>
				{!minimal && (
					<label className="text-sm font-medium leading-none mb-1.5 block">
						{label}
						{required && <span className="text-destructive ml-0.5">*</span>}
					</label>
				)}
				<div className="rounded border border-destructive/50 bg-destructive/10 p-3 text-sm">
					<p className="font-medium">Widget misconfigured</p>
					<p className="mt-1 text-muted-foreground">
						The field's <code>options.fields</code> array is empty or missing.
						Define sub-fields in your seed file to use this widget.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			{!minimal && (
				<button
					type="button"
					className="flex items-center gap-1.5 text-sm font-medium leading-none mb-2 cursor-pointer bg-transparent border-none p-0"
					onClick={() => setIsOpen((o) => !o)}
				>
					<span
						className="inline-block transition-transform text-xs"
						style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
					>
						&#9654;
					</span>
					{label}
					{required && <span className="text-destructive ml-0.5">*</span>}
				</button>
			)}

			{isOpen && (
				<div className="space-y-3 rounded border border-input p-3">
					{fields.map((field) => (
						<SubField
							key={field.key}
							def={field}
							value={data[field.key]}
							onChange={(v) => handleFieldChange(field.key, v)}
						/>
					))}
				</div>
			)}

			{helpText && (
				<p className="mt-1.5 text-xs text-muted-foreground">{helpText}</p>
			)}
		</div>
	);
}
