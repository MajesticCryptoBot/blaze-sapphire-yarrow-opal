import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./router-B73hrHL6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tag-badge-D3_joL8F.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]", {
	variants: { tone: {
		just: "bg-signal/15 text-signal",
		breaking: "bg-signal/15 text-signal",
		alert: "bg-warn/15 text-warn",
		new: "bg-info/15 text-info",
		mute: "bg-surface text-muted"
	} },
	defaultVariants: { tone: "mute" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
var TONE = {
	"JUST IN": "just",
	BREAKING: "breaking",
	ALERT: "alert",
	NEW: "new"
};
function TagBadge({ tag }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: TONE[tag],
		children: tag
	});
}
//#endregion
export { TagBadge as t };
