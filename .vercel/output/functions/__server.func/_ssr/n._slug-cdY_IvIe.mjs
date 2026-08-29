import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowLeft, i as Check, r as Link2 } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as getRelated, l as telegramCaption, n as Route, r as cn, s as formatTime } from "./router-B73hrHL6.mjs";
import { t as TagBadge } from "./tag-badge-D3_joL8F.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/n._slug-cdY_IvIe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			outline: "border border-border bg-transparent text-foreground hover:bg-surface",
			ghost: "text-muted hover:bg-surface hover:text-foreground",
			signal: "bg-signal text-signal-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function CopyLink({ path, label = "Copy article link" }) {
	const [done, setDone] = (0, import_react.useState)(false);
	async function copy() {
		const url = `${window.location.origin}${path}`;
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			const el = document.createElement("textarea");
			el.value = url;
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
		}
		setDone(true);
		window.setTimeout(() => setDone(false), 1800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		size: "sm",
		onClick: copy,
		children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), done ? "Copied" : label]
	});
}
function ArticlePage() {
	const { article } = Route.useLoaderData();
	const related = getRelated(article);
	const path = `/n/${article.slug}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to the wire"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagBadge, { tag: article.tag }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
							children: article.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
							className: "font-mono text-[11px] tabular-nums text-subtle",
							children: [formatTime(article.publishedAt), " UTC"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl font-medium sm:text-4xl",
					children: article.headline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-lg leading-relaxed text-muted",
					children: article.dek
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyLink, { path }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyLink, {
						path,
						label: "Copy for Telegram"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-md border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Telegram caption"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-foreground",
						children: telegramCaption(article)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 space-y-5 text-[17px] leading-7 text-foreground/92",
					children: article.body.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
							children: "Key facts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-4 space-y-3",
							children: article.keyFacts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-subtle",
									children: f.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-sm tabular-nums",
									children: f.value
								})]
							}, f.label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
							children: "Tickers"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: article.tickers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-sm border border-border px-2 py-1 font-mono text-xs",
								children: t
							}, t))
						})]
					}),
					related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
						children: "Related"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/n/$slug",
							params: { slug: r.slug },
							className: "block text-sm leading-snug text-muted hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagBadge, { tag: r.tag }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block",
								children: r.headline
							})]
						}) }, r.slug))
					})] }) : null
				]
			})]
		})]
	});
}
//#endregion
export { ArticlePage as component };
