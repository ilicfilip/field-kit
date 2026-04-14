import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";

const PLUGIN_ID = "field-kit";
const PLUGIN_VERSION = "0.1.0";

export function fieldKitPlugin(): PluginDescriptor {
	return {
		id: PLUGIN_ID,
		version: PLUGIN_VERSION,
		format: "native",
		entrypoint: new URL("./index.ts", import.meta.url).pathname,
		adminEntry: new URL("./admin.tsx", import.meta.url).pathname,
		options: {},
	};
}

export function createPlugin() {
	return definePlugin({
		id: PLUGIN_ID,
		version: PLUGIN_VERSION,
		admin: {
			fieldWidgets: [
				{ name: "object-form", label: "Object form", fieldTypes: ["json"] },
				{ name: "list", label: "List", fieldTypes: ["json"] },
				{ name: "grid", label: "Grid", fieldTypes: ["json"] },
				{ name: "tags", label: "Tags input", fieldTypes: ["json"] },
			],
		},
	});
}

export default createPlugin;
