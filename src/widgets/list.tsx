import * as React from "react";
import type { FieldWidgetProps, SubFieldDef } from "../shared/types";
import { normalizeArray, normalizeObject, renderSummary } from "../shared/utils";
import { SubField } from "../shared/sub-field";

/**
 * List widget — ordered array editor with add/remove/reorder for json fields.
 *
 * Seed usage:
 *   {
 *     "slug": "ingredients",
 *     "type": "json",
 *     "widget": "field-kit:list",
 *     "options": {
 *       "itemLabel": "Ingredient",
 *       "min": 1,
 *       "max": 50,
 *       "sortable": true,
 *       "summary": "{{name}} — {{amount}}",
 *       "fields": [
 *         { "key": "name", "label": "Name", "type": "text" },
 *         { "key": "amount", "label": "Amount", "type": "text" },
 *         { "key": "optional", "label": "Optional", "type": "boolean" }
 *       ]
 *     }
 *   }
 *
 * Stored value: [{ "name": "Flour", "amount": "500g", "optional": false }, ...]
 */
export function List({
	value,
	onChange,
	label,
	required,
	options,
	minimal,
}: FieldWidgetProps) {
	const fields = (options?.fields as SubFieldDef[] | undefined) ?? [];
	const itemLabel = (options?.itemLabel as string | undefined) ?? "Item";
	const min = options?.min as number | undefined;
	const max = options?.max as number | undefined;
	const sortable = (options?.sortable as boolean | undefined) ?? true;
	const summaryTemplate = options?.summary as string | undefined;
	const helpText = options?.helpText as string | undefined;

	const items = normalizeArray(value).map((item) => normalizeObject(item, fields));
	const itemsRef = React.useRef(items);
	itemsRef.current = items;

	const [expandedIndex, setExpandedIndex] = React.useState<number | null>(
		items.length === 0 ? null : 0,
	);

	const canAdd = max === undefined || items.length < max;
	const canRemove = min === undefined || items.length > min;

	const updateItems = React.useCallback(
		(next: Record<string, unknown>[]) => {
			onChange(next);
		},
		[onChange],
	);

	const addItem = React.useCallback(() => {
		const newItem = normalizeObject(undefined, fields);
		const next = [...itemsRef.current, newItem];
		updateItems(next);
		setExpandedIndex(next.length - 1);
	}, [fields, updateItems]);

	const removeItem = React.useCallback(
		(index: number) => {
			const next = [...itemsRef.current];
			next.splice(index, 1);
			updateItems(next);
			if (expandedIndex === index) {
				setExpandedIndex(null);
			} else if (expandedIndex !== null && expandedIndex > index) {
				setExpandedIndex(expandedIndex - 1);
			}
		},
		[updateItems, expandedIndex],
	);

	const moveItem = React.useCallback(
		(index: number, direction: -1 | 1) => {
			const target = index + direction;
			if (target < 0 || target >= itemsRef.current.length) return;
			const next = [...itemsRef.current];
			[next[index], next[target]] = [next[target], next[index]];
			updateItems(next);
			if (expandedIndex === index) {
				setExpandedIndex(target);
			} else if (expandedIndex === target) {
				setExpandedIndex(index);
			}
		},
		[updateItems, expandedIndex],
	);

	const updateField = React.useCallback(
		(itemIndex: number, key: string, fieldValue: unknown) => {
			const next = itemsRef.current.map((item, i) =>
				i === itemIndex ? { ...item, [key]: fieldValue } : item,
			);
			updateItems(next);
		},
		[updateItems],
	);

	const getSummary = React.useCallback(
		(item: Record<string, unknown>, index: number): string => {
			if (summaryTemplate) {
				const rendered = renderSummary(summaryTemplate, item).trim();
				if (rendered) return rendered;
			}
			return `${itemLabel} ${index + 1}`;
		},
		[summaryTemplate, itemLabel],
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
				<label className="text-sm font-medium leading-none mb-1.5 block">
					{label}
					{required && <span className="text-destructive ml-0.5">*</span>}
					<span className="ml-1.5 text-xs text-muted-foreground font-normal">
						({items.length}{max !== undefined ? `/${max}` : ""})
					</span>
				</label>
			)}

			<div className="rounded border border-input">
				{items.length === 0 && (
					<div className="p-3 text-sm text-muted-foreground text-center">
						No items yet
					</div>
				)}

				{items.map((item, index) => {
					const isExpanded = expandedIndex === index;
					return (
						<div
							key={index}
							className={`border-b border-input last:border-b-0 ${
								isExpanded ? "bg-muted/20" : ""
							}`}
						>
							{/* Row header */}
							<div className="flex items-center gap-1 px-2 py-1.5">
								<button
									type="button"
									className="flex-1 flex items-center gap-1.5 text-sm text-left cursor-pointer bg-transparent border-none p-0"
									onClick={() =>
										setExpandedIndex(isExpanded ? null : index)
									}
								>
									<span
										className="inline-block transition-transform text-xs"
										style={{
											transform: isExpanded
												? "rotate(90deg)"
												: "rotate(0deg)",
										}}
									>
										&#9654;
									</span>
									<span className={isExpanded ? "font-medium" : ""}>
										{getSummary(item, index)}
									</span>
								</button>

								{sortable && (
									<>
										<button
											type="button"
											className="px-1 py-0.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none disabled:opacity-30 disabled:cursor-not-allowed"
											disabled={index === 0}
											onClick={() => moveItem(index, -1)}
											aria-label="Move up"
											title="Move up"
										>
											&#9650;
										</button>
										<button
											type="button"
											className="px-1 py-0.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none disabled:opacity-30 disabled:cursor-not-allowed"
											disabled={index === items.length - 1}
											onClick={() => moveItem(index, 1)}
											aria-label="Move down"
											title="Move down"
										>
											&#9660;
										</button>
									</>
								)}

								{canRemove && (
									<button
										type="button"
										className="px-1.5 py-0.5 text-xs text-muted-foreground hover:text-destructive cursor-pointer bg-transparent border-none"
										onClick={() => removeItem(index)}
										aria-label={`Remove ${itemLabel} ${index + 1}`}
										title="Remove"
									>
										&times;
									</button>
								)}
							</div>

							{/* Expanded sub-fields */}
							{isExpanded && (
								<div className="space-y-3 px-3 pb-3 pt-1 border-t border-input">
									{fields.map((field) => (
										<SubField
											key={field.key}
											def={field}
											value={item[field.key]}
											onChange={(v) =>
												updateField(index, field.key, v)
											}
										/>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{canAdd && (
				<button
					type="button"
					className="mt-2 inline-flex items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-muted/50"
					onClick={addItem}
				>
					+ Add {itemLabel}
				</button>
			)}

			{helpText && (
				<p className="mt-1.5 text-xs text-muted-foreground">{helpText}</p>
			)}
		</div>
	);
}
