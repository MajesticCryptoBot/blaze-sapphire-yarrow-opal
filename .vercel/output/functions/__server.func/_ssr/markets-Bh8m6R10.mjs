import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TICKERS, r as cn } from "./router-B73hrHL6.mjs";
import { n as Area, r as ResponsiveContainer, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markets-Bh8m6R10.js
var import_jsx_runtime = require_jsx_runtime();
function Markets() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.2em] text-subtle",
				children: "Session snapshot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-medium",
				children: "Markets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted",
				children: "Desk reference tape used alongside the wire. Figures are illustrative session marks, not a live brokerage feed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface font-mono text-[11px] uppercase tracking-[0.12em] text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Symbol"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Last"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Change"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Trend"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: TICKERS.map((t) => {
						const up = t.change >= 0;
						const data = t.spark.map((v, i) => ({
							i,
							v
						}));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4 font-mono text-sm",
									children: t.symbol
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4 text-sm text-muted",
									children: t.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4 font-mono text-sm tabular-nums",
									children: t.price.toLocaleString("en-US", { maximumFractionDigits: 2 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: cn("px-4 py-4 font-mono text-sm tabular-nums", up ? "text-up" : "text-down"),
									children: [
										up ? "+" : "",
										t.change.toFixed(2),
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-28",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaChart, {
												data,
												margin: {
													top: 4,
													right: 0,
													left: 0,
													bottom: 0
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
													type: "monotone",
													dataKey: "v",
													stroke: up ? "#6aa84f" : "#c45c4a",
													fill: up ? "rgba(106,168,79,0.16)" : "rgba(196,92,74,0.16)",
													strokeWidth: 1.5,
													dot: false,
													isAnimationActive: false
												})
											})
										})
									})
								})
							]
						}, t.symbol);
					}) })]
				})
			})
		]
	});
}
//#endregion
export { Markets as component };
