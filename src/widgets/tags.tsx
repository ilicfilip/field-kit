import * as React from "react";
import type { FieldWidgetProps } from "../shared/types";
import { normalizeTags } from "../shared/utils";

/**
 * Tags widget — free-form chip/tag input for json fields that store string arrays.
 *
 * Seed usage:
 *   {
 *     "slug": "keywords",
 *     "type": "json",
 *     "widget": "field-kit:tags",
 *     "options": {
 *       "placeholder": "Add keyword...",
 *       "max": 10,
 *       "suggestions": ["organic", "seasonal", "dried"],
 *       "allowCustom": true,
 *       "transform": "lowercase"
 *     }
 *   }
 *
 * Stored value: ["organic", "seasonal"]
 */
export function Tags({
	value,
	onChange,
	label,
	id,
	required,
	options,
	minimal,
}: FieldWidgetProps) {
	const placeholder = (options?.placeholder as string | undefined) ?? "Add...";
	const max = options?.max as number | undefined;
	const suggestions = (options?.suggestions as string[] | undefined) ?? [];
	const allowCustom = (options?.allowCustom as boolean | undefined) ?? true;
	const transform = (options?.transform as string | undefined) ?? "none";
	const helpText = options?.helpText as string | undefined;

	const tags = normalizeTags(value);
	const tagsRef = React.useRef(tags);
	tagsRef.current = tags;

	const [input, setInput] = React.useState("");
	const datalistId = `${id}-suggestions`;
	const atLimit = max !== undefined && tags.length >= max;

	const applyTransform = React.useCallback(
		(val: string): string => {
			const trimmed = val.trim();
			switch (transform) {
				case "lowercase":
					return trimmed.toLowerCase();
				case "uppercase":
					return trimmed.toUpperCase();
				case "trim":
					return trimmed;
				default:
					return trimmed;
			}
		},
		[transform],
	);

	const addTag = React.useCallback(
		(raw: string) => {
			const tag = applyTransform(raw);
			if (!tag) return;
			if (tagsRef.current.includes(tag)) return;
			if (!allowCustom && !suggestions.includes(tag)) return;
			if (max !== undefined && tagsRef.current.length >= max) return;
			onChange([...tagsRef.current, tag]);
			setInput("");
		},
		[onChange, applyTransform, allowCustom, suggestions, max],
	);

	const removeTag = React.useCallback(
		(index: number) => {
			const next = [...tagsRef.current];
			next.splice(index, 1);
			onChange(next);
		},
		[onChange],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" || e.key === ",") {
				e.preventDefault();
				addTag(input);
			}
			if (e.key === "Backspace" && input === "" && tagsRef.current.length > 0) {
				removeTag(tagsRef.current.length - 1);
			}
		},
		[input, addTag, removeTag],
	);

	return (
		<div>
			{!minimal && (
				<label className="text-sm font-medium leading-none mb-1.5 block">
					{label}
					{required && <span className="text-destructive ml-0.5">*</span>}
				</label>
			)}

			<div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-1.5 min-h-[2.25rem]">
				{tags.map((tag, i) => (
					<span
						key={`${tag}-${i}`}
						className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-sm"
					>
						{tag}
						<button
							type="button"
							className="inline-flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 cursor-pointer bg-transparent border-none p-0 text-xs leading-none"
							onClick={() => removeTag(i)}
							aria-label={`Remove ${tag}`}
						>
							&times;
						</button>
					</span>
				))}

				{!atLimit && (
					<input
						type="text"
						className="flex-1 min-w-[8rem] bg-transparent border-none outline-none text-sm p-1 placeholder:text-muted-foreground"
						value={input}
						placeholder={tags.length === 0 ? placeholder : ""}
						list={suggestions.length > 0 ? datalistId : undefined}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={() => {
							if (input.trim()) addTag(input);
						}}
					/>
				)}
			</div>

			{suggestions.length > 0 && (
				<datalist id={datalistId}>
					{suggestions
						.filter((s) => !tags.includes(s))
						.map((s) => (
							<option key={s} value={s} />
						))}
				</datalist>
			)}

			{helpText && (
				<p className="mt-1.5 text-xs text-muted-foreground">{helpText}</p>
			)}

			{max !== undefined && (
				<p className="mt-1 text-xs text-muted-foreground">
					{tags.length}/{max}
				</p>
			)}
		</div>
	);
}
