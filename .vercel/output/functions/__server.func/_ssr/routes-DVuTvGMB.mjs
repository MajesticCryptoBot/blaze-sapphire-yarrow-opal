import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Search } from "../_libs/lucide-react.mjs";
import { a as ARTICLES, o as CATEGORIES, r as cn, s as formatTime } from "./router-B73hrHL6.mjs";
import { t as TagBadge } from "./tag-badge-D3_joL8F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DVuTvGMB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArticleCard({ article, featured = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/n/$slug",
		params: { slug: article.slug },
		className: "group block rounded-lg border border-border bg-surface p-5 transition-[border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:border-ring/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagBadge, { tag: article.tag }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
					className: "font-mono text-[11px] tabular-nums text-subtle",
					children: formatTime(article.publishedAt)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: featured ? "mt-4 font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl" : "mt-3 font-display text-xl font-medium leading-snug text-foreground",
				children: article.headline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: article.dek
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
					children: article.category
				}), article.tickers.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted",
					children: t
				}, t))]
			})
		]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-[var(--motion-quick)] focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function Home() {
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const [lead, ...rest] = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return ARTICLES.filter((a) => {
			if (!(cat === "All" || a.category === cat)) return false;
			if (!query) return true;
			return a.headline.toLowerCase().includes(query) || a.dek.toLowerCase().includes(query) || a.tickers.some((t) => t.toLowerCase().includes(query)) || a.category.toLowerCase().includes(query);
		});
	}, [q, cat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.2em] text-subtle",
						children: "The wire · Telegram desk companion"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl font-display text-4xl font-medium sm:text-5xl",
						children: "The brief behind the headline."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-base text-muted",
						children: "Short Telegram captions stay on the wire. Open any story here for the full desk note, key facts, and a shareable link you can append to the forwarded message."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search tickers, names, themes",
						className: "pl-10",
						"aria-label": "Search the wire"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCat(c),
						className: cn("h-11 shrink-0 rounded-sm border px-3 text-xs font-medium", cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted hover:text-foreground"),
						children: c
					}, c))
				})]
			}),
			lead ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
						article: lead,
						featured: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "flex flex-col gap-4 lg:col-span-2",
					children: rest.slice(0, 2).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: a }, a.slug))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: "No stories match that filter."
			}),
			rest.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Latest on the wire"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-4 md:grid-cols-2",
					children: rest.slice(2).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article: a }, a.slug))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "desk",
				className: "mt-16 rounded-lg border border-border bg-surface p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.18em] text-subtle",
						children: "For the Telegram desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl",
						children: "How the link works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Open the story on this site after the rewrite is forwarded." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Use Copy article link on the story page." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Append that URL to the Telegram caption so readers can open the full brief without leaving the channel thread." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-mono text-xs text-subtle",
						children: "Example path · /n/warsh-hawkish-jackson-hole"
					})
				]
			})
		]
	});
}
//#endregion
export { Home as component };
