import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { i as useQueryClient, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { a as Pencil, i as Plus, l as Download, n as Upload, o as FolderUp, r as Trash2, u as CircleAlert } from "./_libs/lucide-react.mjs";
import { _ as cn, a as DialogFooter, b as localAssets, c as DialogTrigger, f as Select, g as SelectValue, h as SelectTrigger, i as DialogContent, l as Input, m as SelectItem, n as Button, o as DialogHeader, p as SelectContent, r as Dialog, s as DialogTitle, t as ASSETS_QUERY_KEY, u as Label, x as useAssets, y as formatMoney } from "./_ssr/select-DVDBbX78.mjs";
import { n as readSync, r as utils, t as SSF } from "./_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.assets-C8ELKSGh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var COL = {
	catCode: 1,
	desc: 2,
	location: 3,
	date: 4,
	price: 6,
	rate: 14
};
function toISODate(v) {
	if (!v) return null;
	if (v instanceof Date) return v.toISOString().slice(0, 10);
	if (typeof v === "number") {
		const d = SSF.parse_date_code(v);
		if (!d) return null;
		const mm = String(d.m).padStart(2, "0");
		const dd = String(d.d).padStart(2, "0");
		return `${d.y}-${mm}-${dd}`;
	}
	if (typeof v === "string") {
		const d = new Date(v);
		if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
	}
	return null;
}
function toNumber(v) {
	if (typeof v === "number" && isFinite(v)) return v;
	if (typeof v === "string") {
		const n = Number(v.replace(/[, ]/g, ""));
		if (isFinite(n)) return n;
	}
	return null;
}
function toRate(v) {
	const n = toNumber(v);
	if (n === null) return null;
	if (n <= 0) return null;
	return n > 1 ? n / 100 : n;
}
function parseAssetWorkbook(buffer) {
	const wb = readSync(buffer, {
		type: "array",
		cellDates: true
	});
	const sheetName = wb.SheetNames.find((n) => /schedule|summery|summary/i.test(n)) ?? wb.SheetNames[0];
	const ws = wb.Sheets[sheetName];
	const rows = utils.sheet_to_json(ws, {
		header: 1,
		blankrows: false,
		defval: null
	});
	const assets = [];
	let currentCategory = "Uncategorized";
	let skipped = 0;
	for (const row of rows) {
		const catCode = row[COL.catCode];
		const desc = row[COL.desc];
		const date = row[COL.date];
		const price = row[COL.price];
		if (catCode != null && catCode !== "" && typeof desc === "string" && desc.trim()) {
			currentCategory = desc.trim();
			continue;
		}
		if (!desc || typeof desc !== "string") continue;
		const iso = toISODate(date);
		const priceNum = toNumber(price);
		const rateNum = toRate(row[COL.rate]);
		if (!iso || priceNum == null || priceNum <= 0 || rateNum == null) {
			skipped++;
			continue;
		}
		const loc = row[COL.location];
		assets.push({
			asset_number: null,
			category: currentCategory,
			description: desc.trim(),
			location: typeof loc === "string" ? loc.trim() || null : null,
			purchase_date: iso,
			purchase_price: priceNum,
			rate_per_year: rateNum
		});
	}
	return {
		sheetName,
		assets,
		skipped
	};
}
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = import_react.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
function validateForm(form) {
	const errs = [];
	const price = Number(form.purchase_price);
	if (!form.purchase_price || isNaN(price) || price <= 0) errs.push("Purchase price must be greater than 0. Enter a positive number (e.g. 1500).");
	if (form.disposal_date) {
		const today = /* @__PURE__ */ new Date();
		today.setHours(23, 59, 59, 999);
		const d = new Date(form.disposal_date);
		if (isNaN(d.getTime())) errs.push("Disposal date is not a valid date.");
		else if (d.getTime() > today.getTime()) errs.push("Disposal date must be today or in the past — future dates are not allowed.");
		if (form.purchase_date) {
			const p = new Date(form.purchase_date);
			if (!isNaN(p.getTime()) && d.getTime() < p.getTime()) errs.push("Disposal date cannot be before the purchase date.");
		}
	}
	return errs;
}
var LIFE_OPTIONS = [
	{
		value: "1",
		label: "1 year (100%)",
		years: 1
	},
	{
		value: "2",
		label: "2 years (50%)",
		years: 2
	},
	{
		value: "5",
		label: "5 years (20%)",
		years: 5
	},
	{
		value: "10",
		label: "10 years (10%)",
		years: 10
	},
	{
		value: "20",
		label: "20 years (5%)",
		years: 20
	},
	{
		value: "forever",
		label: "No depreciation (e.g. Land)",
		years: null
	},
	{
		value: "custom",
		label: "Custom…",
		years: null
	}
];
var LAND_CATEGORIES = [
	"land",
	"grundstück",
	"grundstuck"
];
var isLandCategory = (c) => LAND_CATEGORIES.includes(c.trim().toLowerCase());
function lifeFromRate(ratePct) {
	if (ratePct === 0) return "forever";
	const years = Math.round(100 / ratePct);
	if ([
		1,
		2,
		5,
		10,
		20
	].includes(years) && Math.abs(100 / years - ratePct) < .01) return String(years);
	return "custom";
}
var blank = {
	asset_number: "",
	category: "Furniture",
	description: "",
	location: "",
	purchase_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	purchase_price: "",
	useful_life: "5",
	rate_per_year: "20",
	disposal_date: "",
	notes: ""
};
function AssetsPage() {
	const { data: assets, isLoading } = useAssets();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(blank);
	const errors = validateForm(form);
	const upsert = useMutation({
		mutationFn: async () => {
			const errs = validateForm(form);
			if (errs.length > 0) throw new Error(errs[0]);
			const payload = {
				asset_number: form.asset_number || null,
				category: form.category.trim(),
				description: form.description.trim(),
				location: form.location || null,
				purchase_date: form.purchase_date,
				purchase_price: Number(form.purchase_price),
				rate_per_year: Number(form.rate_per_year) / 100,
				disposal_date: form.disposal_date || null,
				notes: form.notes || null
			};
			if (editing) await localAssets.update(editing.id, payload);
			else await localAssets.insert(payload);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
			toast.success(editing ? "Asset updated" : "Asset added");
			setOpen(false);
			setEditing(null);
			setForm(blank);
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			await localAssets.remove(id);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
			toast.success("Asset removed");
		},
		onError: (e) => toast.error(e.message)
	});
	const startEdit = (a) => {
		setEditing(a);
		const ratePct = Math.round(a.rate_per_year * 1e3) / 10;
		setForm({
			asset_number: a.asset_number ?? "",
			category: a.category,
			description: a.description,
			location: a.location ?? "",
			purchase_date: a.purchase_date,
			purchase_price: String(a.purchase_price),
			useful_life: lifeFromRate(ratePct),
			rate_per_year: String(ratePct),
			disposal_date: a.disposal_date ?? "",
			notes: ""
		});
		setOpen(true);
	};
	const applyCategory = (v) => {
		if (isLandCategory(v)) setForm({
			...form,
			category: v,
			useful_life: "forever",
			rate_per_year: "0"
		});
		else setForm({
			...form,
			category: v
		});
	};
	const applyLife = (v) => {
		const opt = LIFE_OPTIONS.find((o) => o.value === v);
		if (!opt) return;
		if (v === "forever") setForm({
			...form,
			useful_life: v,
			rate_per_year: "0"
		});
		else if (v === "custom") setForm({
			...form,
			useful_life: v
		});
		else if (opt.years) setForm({
			...form,
			useful_life: v,
			rate_per_year: String(100 / opt.years)
		});
	};
	const startNew = () => {
		setEditing(null);
		setForm(blank);
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold text-foreground",
					children: "Assets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Master data — changes flow into every year's schedule automatically."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupButton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestoreButton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportButton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: startNew,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Add asset"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
								className: "max-w-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit asset" : "New asset" }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Category",
												value: form.category,
												onChange: applyCategory
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Asset number",
												value: form.asset_number,
												onChange: (v) => setForm({
													...form,
													asset_number: v
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "col-span-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "Description",
													value: form.description,
													onChange: (v) => setForm({
														...form,
														description: v
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Location",
												value: form.location,
												onChange: (v) => setForm({
													...form,
													location: v
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Purchase date",
												type: "date",
												value: form.purchase_date,
												onChange: (v) => setForm({
													...form,
													purchase_date: v
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Purchase price",
												type: "number",
												value: form.purchase_price,
												onChange: (v) => setForm({
													...form,
													purchase_price: v
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "mb-2 block",
												children: "Useful life"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: form.useful_life,
												onValueChange: applyLife,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LIFE_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: o.value,
													children: o.label
												}, o.value)) })]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: form.useful_life === "custom" ? "Rate per year (%)" : "Rate per year (%) — auto",
												type: "number",
												value: form.rate_per_year,
												onChange: (v) => setForm({
													...form,
													rate_per_year: v,
													useful_life: "custom"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Disposal date (optional)",
												type: "date",
												max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
												value: form.disposal_date,
												onChange: (v) => setForm({
													...form,
													disposal_date: v
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "mb-2 block",
													children: "Notes"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: form.notes,
													onChange: (e) => setForm({
														...form,
														notes: e.target.value
													})
												})]
											})
										]
									}),
									errors.length > 0 && (form.purchase_price !== "" || form.disposal_date !== "") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
										variant: "destructive",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Please fix the following before saving" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "list-disc pl-5 space-y-1 mt-1",
												children: errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, i))
											}) })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setOpen(false),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => upsert.mutate(),
										disabled: upsert.isPending || !form.description || errors.length > 0,
										children: editing ? "Save changes" : "Add asset"
									})] })
								]
							})]
						})
					]
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Loading…"
			}),
			assets && assets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-dashed border-border p-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "No assets yet. Add your first one to get started."
				})
			}),
			assets && assets.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-card overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-muted-foreground text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-medium",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-medium",
									children: "Asset #"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-medium",
									children: "Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-medium",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-medium",
									children: "Purchased"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right p-3 font-medium",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right p-3 font-medium",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-3 font-medium",
									children: "Disposed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "text-right p-3 font-medium" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border hover:bg-muted/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: a.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs",
								children: a.asset_number ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-medium text-foreground",
								children: a.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: a.location ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs",
								children: a.purchase_date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right font-mono",
								children: formatMoney(a.purchase_price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 text-right font-mono",
								children: [(a.rate_per_year * 100).toFixed(1), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs",
								children: a.disposal_date ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => startEdit(a),
										"aria-label": "Edit",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => {
											if (confirm(`Delete "${a.description}"? This cannot be undone.`)) remove.mutate(a.id);
										},
										"aria-label": "Delete",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})]
								})
							})
						]
					}, a.id)) })]
				})
			})
		]
	});
}
function Field({ label, value, onChange, type = "text", max }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "mb-2 block",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		type,
		value,
		max,
		onChange: (e) => onChange(e.target.value)
	})] });
}
function ImportButton() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [parsed, setParsed] = (0, import_react.useState)([]);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [skipped, setSkipped] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const onFile = async (file) => {
		try {
			const res = parseAssetWorkbook(await file.arrayBuffer());
			setParsed(res.assets);
			setSkipped(res.skipped);
			setFileName(file.name);
			setOpen(true);
			if (res.assets.length === 0) toast.error("No importable rows found in this file.");
		} catch (e) {
			toast.error(e.message);
		}
	};
	const doImport = async () => {
		if (parsed.length === 0) return;
		setBusy(true);
		try {
			const records = parsed.map((a) => ({
				asset_number: a.asset_number,
				category: a.category,
				description: a.description,
				location: a.location,
				purchase_date: a.purchase_date,
				purchase_price: a.purchase_price,
				rate_per_year: a.rate_per_year,
				disposal_date: null,
				notes: null
			}));
			await localAssets.insert(records);
			await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
			toast.success(`Imported ${parsed.length} assets`);
			setOpen(false);
			setParsed([]);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "cursor-pointer",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }),
				" Import Excel",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: ".xlsx,.xls",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) onFile(f);
					}
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Import preview — ", fileName] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: [
						parsed.length,
						" asset(s) ready to import",
						skipped > 0 && ` · ${skipped} row(s) skipped (missing date / price / rate)`
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-96 overflow-auto rounded border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50 sticky top-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-2",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-2",
									children: "Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-2",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-2",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right p-2",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right p-2",
									children: "Rate"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: parsed.slice(0, 200).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-muted-foreground",
									children: a.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: a.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-muted-foreground",
									children: a.location ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 font-mono",
									children: a.purchase_date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right font-mono",
									children: a.purchase_price.toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2 text-right font-mono",
									children: [(a.rate_per_year * 100).toFixed(1), "%"]
								})
							]
						}, i)) })]
					}), parsed.length > 200 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 text-xs text-muted-foreground text-center",
						children: [
							"…and ",
							parsed.length - 200,
							" more"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					disabled: busy,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: doImport,
					disabled: busy || parsed.length === 0,
					children: busy ? "Importing…" : `Import ${parsed.length} assets`
				})] })
			]
		})
	})] });
}
function BackupButton() {
	const onClick = async () => {
		try {
			const json = await localAssets.exportJson();
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `gastronoassets-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Backup downloaded");
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Backup"]
	});
}
function RestoreButton() {
	const qc = useQueryClient();
	const onFile = async (file) => {
		try {
			const text = await file.text();
			const mode = confirm("OK = REPLACE all existing data with the backup\nCancel = MERGE backup into current data") ? "replace" : "merge";
			const n = await localAssets.importJson(text, mode);
			await qc.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
			toast.success(`Restored ${n} assets (${mode})`);
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "cursor-pointer",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderUp, { className: "h-4 w-4 mr-2" }),
				" Restore",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: ".json,application/json",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) onFile(f);
					}
				})
			]
		})
	});
}
//#endregion
export { AssetsPage as component };
