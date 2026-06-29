import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Dexie } from "../_libs/dexie.mjs";
import { n as Slot, t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Portal, c as Trigger, i as Overlay, n as Content, o as Root$1, r as Description, s as Title, t as Close } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { d as ChevronUp, h as Check, m as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { a as ItemText, c as Root2, d as Separator, f as Trigger$1, i as ItemIndicator, l as ScrollDownButton, m as Viewport, n as Icon, o as Label$1, p as Value, r as Item, s as Portal$1, t as Content2, u as ScrollUpButton } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/select-DVDBbX78.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GastronoAssetsDB = class extends Dexie {
	fixed_assets;
	constructor() {
		super("gastrono_assets");
		this.version(1).stores({ fixed_assets: "id, category, purchase_date, asset_number, location" });
	}
};
var _db;
function db() {
	if (typeof window === "undefined") throw new Error("Local DB is browser-only");
	if (!_db) _db = new GastronoAssetsDB();
	return _db;
}
function uuid() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
var localAssets = {
	async list() {
		const rows = await db().fixed_assets.toArray();
		rows.sort((a, b) => {
			const c = a.category.localeCompare(b.category);
			if (c !== 0) return c;
			return a.purchase_date.localeCompare(b.purchase_date);
		});
		return rows;
	},
	async insert(items) {
		const arr = Array.isArray(items) ? items : [items];
		const ts = nowIso();
		const records = arr.map((a) => ({
			...a,
			id: uuid(),
			created_at: ts,
			updated_at: ts
		}));
		await db().fixed_assets.bulkAdd(records);
	},
	async update(id, patch) {
		await db().fixed_assets.update(id, {
			...patch,
			updated_at: nowIso()
		});
	},
	async remove(id) {
		await db().fixed_assets.delete(id);
	},
	async clear() {
		await db().fixed_assets.clear();
	},
	async exportJson() {
		const rows = await db().fixed_assets.toArray();
		return JSON.stringify({
			app: "GastronoAssets",
			version: 1,
			exported_at: nowIso(),
			fixed_assets: rows
		}, null, 2);
	},
	async importJson(json, mode = "merge") {
		const rows = JSON.parse(json).fixed_assets ?? [];
		if (mode === "replace") await db().fixed_assets.clear();
		const ts = nowIso();
		const recs = rows.map((r) => ({
			...r,
			id: r.id || uuid(),
			created_at: r.created_at || ts,
			updated_at: ts
		}));
		await db().fixed_assets.bulkPut(recs);
		return recs.length;
	}
};
var ASSETS_QUERY_KEY = ["fixed_assets"];
async function fetchAssets() {
	return localAssets.list();
}
function useAssets() {
	return useQuery({
		queryKey: ASSETS_QUERY_KEY,
		queryFn: fetchAssets,
		enabled: typeof window !== "undefined"
	});
}
var parseYMD = (s) => {
	const [y, m, d] = s.split("-").map(Number);
	return {
		year: y,
		month: m,
		day: d
	};
};
function monthsElapsed(purchaseYear, purchaseMonth, year, month) {
	const diff = (year - purchaseYear) * 12 + (month - purchaseMonth) + 1;
	return Math.max(0, diff);
}
function computeYearSchedule(asset, reportYear) {
	const p = parseYMD(asset.purchase_date);
	const disposal = asset.disposal_date ? parseYMD(asset.disposal_date) : null;
	const monthly = asset.purchase_price * asset.rate_per_year / 12;
	const usefulLifeMonths = asset.rate_per_year > 0 ? Math.round(12 / asset.rate_per_year) : 0;
	const accumulatedThrough = (year, month) => {
		let elapsed = monthsElapsed(p.year, p.month, year, month);
		if (disposal) {
			const lastDeprMonth = monthsElapsed(p.year, p.month, disposal.year, disposal.month) - 1;
			elapsed = Math.min(elapsed, Math.max(0, lastDeprMonth));
		}
		elapsed = Math.min(elapsed, usefulLifeMonths || elapsed);
		const acc = monthly * elapsed;
		return Math.min(acc, asset.purchase_price);
	};
	const acquiredInYear = p.year === reportYear;
	const disposedInYear = !!disposal && disposal.year === reportYear;
	const openingCost = p.year <= reportYear && p.year < reportYear ? asset.purchase_price : 0;
	const additions = acquiredInYear ? asset.purchase_price : 0;
	const disposals = disposedInYear ? asset.purchase_price : 0;
	const closingCost = openingCost + additions - disposals;
	const openingAccumulated = accumulatedThrough(reportYear - 1, 12);
	const months = [];
	let prevAcc = openingAccumulated;
	for (let m = 1; m <= 12; m++) {
		const acc = accumulatedThrough(reportYear, m);
		months.push(Math.max(0, acc - prevAcc));
		prevAcc = acc;
	}
	const yearDepreciation = months.reduce((s, v) => s + v, 0);
	const disposalAccumulatedRemoved = disposedInYear ? openingAccumulated + yearDepreciation : 0;
	const closingAccumulated = openingAccumulated + yearDepreciation - disposalAccumulatedRemoved;
	return {
		asset,
		monthlyDepreciation: monthly,
		usefulLifeMonths,
		months,
		openingCost,
		additions,
		disposals,
		closingCost,
		openingAccumulated,
		yearDepreciation,
		disposalAccumulatedRemoved,
		closingAccumulated,
		openingNBV: openingCost - openingAccumulated,
		closingNBV: closingCost - closingAccumulated
	};
}
var MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function formatMoney(n) {
	if (!n) return "—";
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(n);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Dialog = Root$1;
var DialogTrigger = Trigger;
var DialogPortal = Portal;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = Overlay.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = Title.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = Description.displayName;
var Select = Root2;
var SelectValue = Value;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = Trigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = Content2.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = Label$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemText, { children })]
}));
SelectItem.displayName = Item.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = Separator.displayName;
//#endregion
export { cn as _, DialogFooter as a, localAssets as b, DialogTrigger as c, MONTH_LABELS as d, Select as f, SelectValue as g, SelectTrigger as h, DialogContent as i, Input as l, SelectItem as m, Button as n, DialogHeader as o, SelectContent as p, Dialog as r, DialogTitle as s, ASSETS_QUERY_KEY as t, Label as u, computeYearSchedule as v, useAssets as x, formatMoney as y };
