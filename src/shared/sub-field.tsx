import * as React from "react";
import type { SubFieldDef } from "./types";

interface SubFieldProps {
	def: SubFieldDef;
	value: unknown;
	onChange: (value: unknown) => void;
}

/** Normalize select options to { label, value } pairs. */
function normalizeSelectOptions(
	options: SubFieldDef["options"],
): Array<{ label: string; value: string }> {
	if (!options || !Array.isArray(options)) return [];
	return options.map((opt) =>
		typeof opt === "string" ? { label: opt, value: opt } : opt,
	);
}

const INPUT_CLASS =
	"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const CHECKBOX_CLASS =
	"h-4 w-4 cursor-pointer rounded border border-input";

/**
 * Renders a single sub-field input based on its type definition.
 * Used by object-form and list widgets.
 */
export function SubField({ def, value, onChange }: SubFieldProps) {
	const fieldId = `field-kit-${def.key}`;

	let input: React.ReactNode;

	switch (def.type) {
		case "text":
			input = (
				<input
					id={fieldId}
					type="text"
					className={INPUT_CLASS}
					value={typeof value === "string" ? value : ""}
					placeholder={def.placeholder}
					required={def.required}
					onChange={(e) => onChange(e.target.value)}
				/>
			);
			break;

		case "url":
			input = (
				<input
					id={fieldId}
					type="url"
					className={INPUT_CLASS}
					value={typeof value === "string" ? value : ""}
					placeholder={def.placeholder ?? "https://"}
					required={def.required}
					onChange={(e) => onChange(e.target.value)}
				/>
			);
			break;

		case "number":
			input = (
				<div className="flex items-center gap-1.5">
					{def.prefix && (
						<span className="text-sm text-muted-foreground whitespace-nowrap">
							{def.prefix}
						</span>
					)}
					<input
						id={fieldId}
						type="number"
						className={INPUT_CLASS}
						value={typeof value === "number" ? value : ""}
						placeholder={def.placeholder}
						required={def.required}
						min={def.min}
						max={def.max}
						step={def.step}
						onChange={(e) => {
							const v = e.target.value;
							onChange(v === "" ? undefined : Number(v));
						}}
					/>
					{def.suffix && (
						<span className="text-sm text-muted-foreground whitespace-nowrap">
							{def.suffix}
						</span>
					)}
				</div>
			);
			break;

		case "boolean":
			input = (
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						id={fieldId}
						type="checkbox"
						className={CHECKBOX_CLASS}
						checked={!!value}
						onChange={(e) => onChange(e.target.checked)}
					/>
					<span className="text-sm">{def.label}</span>
				</label>
			);
			break;

		case "select": {
			const opts = normalizeSelectOptions(def.options);
			input = (
				<select
					id={fieldId}
					className={INPUT_CLASS}
					value={typeof value === "string" ? value : ""}
					required={def.required}
					onChange={(e) => onChange(e.target.value || undefined)}
				>
					<option value="">{def.placeholder ?? "Select..."}</option>
					{opts.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			);
			break;
		}

		case "textarea":
			input = (
				<textarea
					id={fieldId}
					className={`${INPUT_CLASS} h-auto`}
					value={typeof value === "string" ? value : ""}
					placeholder={def.placeholder}
					required={def.required}
					rows={def.rows ?? 3}
					onChange={(e) => onChange(e.target.value)}
				/>
			);
			break;

		case "date":
			input = (
				<input
					id={fieldId}
					type="date"
					className={INPUT_CLASS}
					value={typeof value === "string" ? value : ""}
					required={def.required}
					onChange={(e) => onChange(e.target.value || undefined)}
				/>
			);
			break;

		case "color":
			input = (
				<div className="flex items-center gap-2">
					<input
						id={fieldId}
						type="color"
						className="h-9 w-12 cursor-pointer rounded-md border border-input p-1"
						value={typeof value === "string" ? value : "#000000"}
						onChange={(e) => onChange(e.target.value)}
					/>
					<input
						type="text"
						className={INPUT_CLASS}
						value={typeof value === "string" ? value : ""}
						placeholder="#000000"
						onChange={(e) => onChange(e.target.value)}
					/>
				</div>
			);
			break;

		default:
			input = (
				<input
					id={fieldId}
					type="text"
					className={INPUT_CLASS}
					value={typeof value === "string" ? String(value) : ""}
					onChange={(e) => onChange(e.target.value)}
				/>
			);
	}

	// Boolean renders its own label inline
	if (def.type === "boolean") {
		return (
			<div className="space-y-1">
				{input}
				{def.helpText && (
					<p className="text-xs text-muted-foreground">{def.helpText}</p>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-1">
			<label htmlFor={fieldId} className="text-sm font-medium leading-none">
				{def.label}
				{def.required && (
					<span className="text-destructive ml-0.5">*</span>
				)}
			</label>
			{input}
			{def.helpText && (
				<p className="text-xs text-muted-foreground">{def.helpText}</p>
			)}
		</div>
	);
}
