import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { f as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { _ as ArrowUpDown, c as FileSpreadsheet, f as ChevronRight, g as ArrowUp, p as ChevronLeft, s as FileText, v as ArrowDown } from "./_libs/lucide-react.mjs";
import { a as DialogFooter, d as MONTH_LABELS, f as Select, g as SelectValue, h as SelectTrigger, i as DialogContent, l as Input, m as SelectItem, n as Button, o as DialogHeader, p as SelectContent, r as Dialog, s as DialogTitle, u as Label, v as computeYearSchedule, x as useAssets, y as formatMoney } from "./_ssr/select-DVDBbX78.mjs";
import { i as writeFileSync, r as utils } from "./_libs/xlsx.mjs";
import { t as Route } from "./_app.schedule-Be2WWpiQ.mjs";
import { t as require_jspdf_node_min } from "./_libs/jspdf.mjs";
import { t as autoTable } from "./_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.schedule-CE4Ip_Ri.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
function zeros() {
	return {
		costPurchase: 0,
		openingNBV: 0,
		additions: 0,
		disposals: 0,
		yearDepreciation: 0,
		closingNBV: 0,
		closingAccumulated: 0,
		months: Array(12).fill(0)
	};
}
function addInto(acc, s) {
	acc.costPurchase += s.asset.purchase_price;
	acc.openingNBV += s.openingNBV;
	acc.additions += s.additions;
	acc.disposals += s.disposals;
	acc.yearDepreciation += s.yearDepreciation;
	acc.closingNBV += s.closingNBV;
	acc.closingAccumulated += s.closingAccumulated;
	for (let i = 0; i < 12; i++) acc.months[i] += s.months[i];
}
function buildRows(groups) {
	const rows = [];
	const gtot = zeros();
	for (const [category, schedules] of groups) {
		const subtotal = zeros();
		for (const s of schedules) {
			rows.push({
				category,
				inv: s.asset.asset_number ?? "",
				description: s.asset.description,
				location: s.asset.location ?? "",
				purchase: s.asset.purchase_date,
				costPurchase: s.asset.purchase_price,
				openingNBV: s.openingNBV,
				additions: s.additions,
				disposals: s.disposals,
				yearDepreciation: s.yearDepreciation,
				closingNBV: s.closingNBV,
				rate: `${(s.asset.rate_per_year * 100).toFixed(1)}%`,
				monthly: s.monthlyDepreciation,
				months: s.months,
				closingAccumulated: s.closingAccumulated
			});
			addInto(subtotal, s);
			addInto(gtot, s);
		}
		rows.push({
			category,
			isSubtotal: true,
			inv: "",
			description: `Subtotal — ${category}`,
			location: "",
			purchase: "",
			rate: "",
			monthly: 0,
			...subtotal
		});
	}
	rows.push({
		category: "",
		isGrand: true,
		inv: "",
		description: "GRAND TOTAL",
		location: "",
		purchase: "",
		rate: "",
		monthly: 0,
		...gtot
	});
	return rows;
}
var HEADERS = [
	"Category",
	"Inv #",
	"Description",
	"Location",
	"Purchased",
	"Cost purchase",
	"NBV 01.01",
	"Additions",
	"Disposals",
	"Annual Depr.",
	"NBV 31.12",
	"Rate",
	"Monthly",
	...MONTH_LABELS,
	"Acc. Depr. 31.12"
];
var fmt = (n) => n ? Number(n.toFixed(2)) : 0;
function exportToExcel(groups, year) {
	const rows = buildRows(groups);
	const aoa = [HEADERS];
	for (const r of rows) aoa.push([
		r.isSubtotal || r.isGrand ? "" : r.category,
		r.inv,
		r.description,
		r.location,
		r.purchase,
		fmt(r.costPurchase),
		fmt(r.openingNBV),
		fmt(r.additions),
		fmt(r.disposals),
		fmt(r.yearDepreciation),
		fmt(r.closingNBV),
		r.rate,
		fmt(r.monthly),
		...r.months.map(fmt),
		fmt(r.closingAccumulated)
	]);
	const ws = utils.aoa_to_sheet(aoa);
	const wb = utils.book_new();
	utils.book_append_sheet(wb, ws, `Schedule ${year}`);
	writeFileSync(wb, `depreciation-schedule-${year}.xlsx`);
}
function exportToPDF(groups, year) {
	const rows = buildRows(groups);
	const doc = new import_jspdf_node_min.default({
		orientation: "landscape",
		unit: "pt",
		format: "a3"
	});
	doc.setFontSize(14);
	doc.text(`Depreciation Schedule — ${year}`, 40, 30);
	const body = rows.map((r) => [
		r.isSubtotal || r.isGrand ? "" : r.category,
		r.inv,
		r.description,
		r.location,
		r.purchase,
		fmtCell(r.costPurchase),
		fmtCell(r.openingNBV),
		fmtCell(r.additions),
		fmtCell(r.disposals),
		fmtCell(r.yearDepreciation),
		fmtCell(r.closingNBV),
		r.rate,
		fmtCell(r.monthly),
		...r.months.map(fmtCell),
		fmtCell(r.closingAccumulated)
	]);
	autoTable(doc, {
		head: [HEADERS],
		body,
		startY: 45,
		styles: {
			fontSize: 6,
			cellPadding: 2
		},
		headStyles: { fillColor: [
			60,
			60,
			60
		] },
		didParseCell: (data) => {
			const row = rows[data.row.index];
			if (!row) return;
			if (row.isGrand) {
				data.cell.styles.fontStyle = "bold";
				data.cell.styles.fillColor = [
					220,
					230,
					245
				];
			} else if (row.isSubtotal) {
				data.cell.styles.fontStyle = "bold";
				data.cell.styles.fillColor = [
					240,
					240,
					240
				];
			}
		}
	});
	doc.save(`depreciation-schedule-${year}.pdf`);
}
function fmtCell(n) {
	if (!n) return "";
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(n);
}
function exportSummaryPDF(groups, year, options = {}) {
	const companyName = options.companyName ?? "GastronoAssets — Hotel & Gastro Service";
	const place = options.place ?? "";
	const dateStr = options.date ?? "";
	const preparedBy = options.preparedBy ?? "";
	const approvedBy = options.approvedBy ?? "";
	const doc = new import_jspdf_node_min.default({
		orientation: "landscape",
		unit: "pt",
		format: "a4"
	});
	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();
	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.text(companyName, pageW - 40, 40, { align: "right" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.text(`As at 31.12.${year}`, pageW - 40, 55, { align: "right" });
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.text("Fixed Asset Register — Summary", 40, 45);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.text(`Financial year ${year}`, 40, 62);
	const rows = [];
	const g = {
		category: "Total",
		cost: 0,
		nbvOpen: 0,
		add: 0,
		disp: 0,
		depr: 0,
		nbvClose: 0
	};
	for (const [category, schedules] of groups) {
		const t = {
			category,
			cost: 0,
			nbvOpen: 0,
			add: 0,
			disp: 0,
			depr: 0,
			nbvClose: 0
		};
		for (const s of schedules) {
			t.cost += s.asset.purchase_price;
			t.nbvOpen += s.openingNBV;
			t.add += s.additions;
			t.disp += s.disposals;
			t.depr += s.yearDepreciation;
			t.nbvClose += s.closingNBV;
		}
		rows.push(t);
		g.cost += t.cost;
		g.nbvOpen += t.nbvOpen;
		g.add += t.add;
		g.disp += t.disp;
		g.depr += t.depr;
		g.nbvClose += t.nbvClose;
	}
	const HEAD = [[
		"Category",
		"Cost (purchase)",
		"NBV 01.01.",
		"Additions",
		"Disposals",
		"Depreciation",
		"NBV 31.12."
	]];
	const body = rows.map((r) => [
		r.category,
		fmtCell(r.cost),
		fmtCell(r.nbvOpen),
		fmtCell(r.add),
		fmtCell(r.disp),
		fmtCell(r.depr),
		fmtCell(r.nbvClose)
	]);
	body.push([
		"TOTAL",
		fmtCell(g.cost),
		fmtCell(g.nbvOpen),
		fmtCell(g.add),
		fmtCell(g.disp),
		fmtCell(g.depr),
		fmtCell(g.nbvClose)
	]);
	autoTable(doc, {
		head: HEAD,
		body,
		startY: 85,
		margin: {
			left: 40,
			right: 40
		},
		styles: {
			fontSize: 10,
			cellPadding: 6,
			halign: "right"
		},
		headStyles: {
			fillColor: [
				60,
				60,
				60
			],
			halign: "center",
			fontStyle: "bold"
		},
		columnStyles: { 0: {
			halign: "left",
			fontStyle: "bold"
		} },
		didParseCell: (data) => {
			if (data.row.index === body.length - 1) {
				data.cell.styles.fontStyle = "bold";
				data.cell.styles.fillColor = [
					220,
					230,
					245
				];
			}
		}
	});
	const boxY = (doc.lastAutoTable?.finalY ?? 200) + 18;
	doc.setFillColor(245, 247, 250);
	doc.setDrawColor(180);
	doc.roundedRect(40, boxY, pageW - 80, 36, 4, 4, "FD");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.text(`Total depreciation ${year}:`, 56, boxY + 23);
	doc.setFontSize(13);
	doc.text(fmtCell(g.depr), pageW - 56, boxY + 23, { align: "right" });
	const sigY = pageH - 90;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	const placeDateText = place || dateStr ? `Place, Date: ${place}${place && dateStr ? ", " : ""}${dateStr}` : "Place, Date: ____________________________";
	doc.text(placeDateText, 40, sigY);
	const colW = (pageW - 80) / 2;
	const line1X = 40;
	const line2X = 40 + colW;
	const lineY = sigY + 50;
	doc.line(line1X, lineY, line1X + colW - 30, lineY);
	doc.line(line2X, lineY, line2X + colW - 30, lineY);
	if (preparedBy) {
		doc.setFontSize(10);
		doc.text(preparedBy, line1X, lineY - 4);
	}
	if (approvedBy) {
		doc.setFontSize(10);
		doc.text(approvedBy, line2X, lineY - 4);
	}
	doc.setFontSize(9);
	doc.text("Signature — prepared by", line1X, lineY + 14);
	doc.text("Signature — approved by", line2X, lineY + 14);
	doc.save(`fixed-asset-summary-${year}.pdf`);
}
function computeSummaryTotals(groups) {
	const rows = [];
	const total = {
		category: "TOTAL",
		cost: 0,
		nbvOpen: 0,
		add: 0,
		disp: 0,
		depr: 0,
		nbvClose: 0
	};
	for (const [category, schedules] of groups) {
		const t = {
			category,
			cost: 0,
			nbvOpen: 0,
			add: 0,
			disp: 0,
			depr: 0,
			nbvClose: 0
		};
		for (const s of schedules) {
			t.cost += s.asset.purchase_price;
			t.nbvOpen += s.openingNBV;
			t.add += s.additions;
			t.disp += s.disposals;
			t.depr += s.yearDepreciation;
			t.nbvClose += s.closingNBV;
		}
		rows.push(t);
		total.cost += t.cost;
		total.nbvOpen += t.nbvOpen;
		total.add += t.add;
		total.disp += t.disp;
		total.depr += t.depr;
		total.nbvClose += t.nbvClose;
	}
	return {
		rows,
		total
	};
}
function valueFor(s, key) {
	switch (key) {
		case "asset_number": return s.asset.asset_number ?? "";
		case "description": return s.asset.description ?? "";
		case "location": return s.asset.location ?? "";
		case "purchase_date": return s.asset.purchase_date ?? "";
		case "costPurchase": return s.asset.purchase_price;
		case "openingNBV": return s.openingNBV;
		case "additions": return s.additions;
		case "disposals": return s.disposals;
		case "yearDepreciation": return s.yearDepreciation;
		case "closingNBV": return s.closingNBV;
		case "rate": return s.asset.rate_per_year;
		case "monthly": return s.monthlyDepreciation;
		case "closingAccumulated": return s.closingAccumulated;
		default:
			if (key.startsWith("m")) {
				const idx = Number(key.slice(1)) - 1;
				return s.months[idx] ?? 0;
			}
			return "";
	}
}
function compare(a, b, key, dir) {
	const av = valueFor(a, key);
	const bv = valueFor(b, key);
	let r;
	if (typeof av === "number" && typeof bv === "number") r = av - bv;
	else r = String(av).localeCompare(String(bv), void 0, {
		numeric: true,
		sensitivity: "base"
	});
	return dir === "asc" ? r : -r;
}
function SchedulePage() {
	const { year, sort, dir, category, catDir } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { data: assets, isLoading, error } = useAssets();
	const [summaryOpen, setSummaryOpen] = (0, import_react.useState)(false);
	const allSchedules = (0, import_react.useMemo)(() => {
		if (!assets) return [];
		return assets.map((a) => computeYearSchedule(a, year)).filter((s) => s.openingCost > 0 || s.additions > 0 || s.disposals > 0);
	}, [assets, year]);
	const categories = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const s of allSchedules) set.add(s.asset.category);
		return Array.from(set).sort((a, b) => a.localeCompare(b));
	}, [allSchedules]);
	const schedules = (0, import_react.useMemo)(() => category && category !== "__all__" ? allSchedules.filter((s) => s.asset.category === category) : allSchedules, [allSchedules, category]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of schedules) {
			const arr = map.get(s.asset.category) ?? [];
			arr.push(s);
			map.set(s.asset.category, arr);
		}
		const sorted = Array.from(map.entries()).sort(([a], [b]) => catDir === "asc" ? a.localeCompare(b) : b.localeCompare(a));
		for (const [, rows] of sorted) rows.sort((a, b) => compare(a, b, sort, dir));
		return sorted;
	}, [
		schedules,
		sort,
		dir,
		catDir
	]);
	const totals = (0, import_react.useMemo)(() => totalsOf(schedules), [schedules]);
	const monthlyTotals = (0, import_react.useMemo)(() => {
		const out = Array(12).fill(0);
		for (const s of schedules) for (let i = 0; i < 12; i++) out[i] += s.months[i];
		return out;
	}, [schedules]);
	const setYear = (delta) => navigate({ search: (prev) => ({
		...prev,
		year: prev.year + delta
	}) });
	const setCategory = (val) => navigate({ search: (prev) => ({
		...prev,
		category: val === "__all__" ? void 0 : val
	}) });
	const setCatDir = (val) => navigate({ search: (prev) => ({
		...prev,
		catDir: val
	}) });
	const toggleSort = (key) => navigate({ search: (prev) => {
		if (prev.sort === key) return {
			...prev,
			dir: prev.dir === "asc" ? "desc" : "asc"
		};
		return {
			...prev,
			sort: key,
			dir: "asc"
		};
	} });
	const SortHead = ({ k, children, align = "left", className = "" }) => {
		const active = sort === k;
		const Icon = active ? dir === "asc" ? ArrowUp : ArrowDown : ArrowUpDown;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
			className: `p-0 font-medium ${className}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => toggleSort(k),
				className: `w-full h-full px-2 py-2 flex items-center gap-1 hover:text-foreground transition-colors ${align === "right" ? "justify-end" : "justify-start"} ${active ? "text-foreground" : ""}`,
				title: `Sort by ${String(children)}`,
				children: [
					align === "right" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3 w-3 ${active ? "" : "opacity-40"}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children }),
					align === "left" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3 w-3 ${active ? "" : "opacity-40"}` })
				]
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-semibold text-foreground",
					children: ["Depreciation Schedule — ", year]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Click any column header to sort. Exports follow the current sort order."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: category ?? "__all__",
									onValueChange: setCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[200px] h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "__all__",
										children: "All categories"
									}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: catDir,
									onValueChange: (v) => setCatDir(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[120px] h-9",
										title: "Category order",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "asc",
										children: "A → Z"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "desc",
										children: "Z → A"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => exportToExcel(groups, year),
							disabled: schedules.length === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 mr-2" }), " Excel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => exportToPDF(groups, year),
							disabled: schedules.length === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), " PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setSummaryOpen(true),
							disabled: schedules.length === 0,
							title: "One-page A4 landscape summary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), " Summary"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => window.print(),
							disabled: schedules.length === 0,
							children: "Print"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 ml-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									onClick: () => setYear(-1),
									"aria-label": "Previous year",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-4 py-2 rounded-md border border-border bg-card font-mono text-sm min-w-[80px] text-center",
									children: year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									onClick: () => setYear(1),
									"aria-label": "Next year",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								})
							]
						})
					]
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Loading…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-destructive",
				children: "Failed to load assets."
			}),
			!isLoading && schedules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-dashed border-border p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: [
						"No assets active in ",
						year,
						"."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Add assets in the \"Assets\" tab to populate the schedule."
				})]
			}),
			schedules.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-card overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "asset_number",
									className: "sticky left-0 bg-muted/50 z-10 min-w-[80px]",
									children: "Inv #"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "description",
									className: "min-w-[180px]",
									children: "Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "location",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "purchase_date",
									children: "Purchased"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "costPurchase",
									align: "right",
									children: "Cost purchase"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "openingNBV",
									align: "right",
									className: "border-l border-border",
									children: "NBV 01.01"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "additions",
									align: "right",
									className: "text-emerald-600 dark:text-emerald-400",
									children: "Additions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "disposals",
									align: "right",
									className: "text-red-600 dark:text-red-400",
									children: "Disposals"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "yearDepreciation",
									align: "right",
									children: "Annual Depr."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "closingNBV",
									align: "right",
									className: "border-r border-border",
									children: "NBV 31.12"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "rate",
									align: "right",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "monthly",
									align: "right",
									children: "Monthly"
								}),
								MONTH_LABELS.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: `m${i + 1}`,
									align: "right",
									children: m
								}, m)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
									k: "closingAccumulated",
									align: "right",
									className: "border-l border-border",
									children: "Acc. Depr. 31.12"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [groups.map(([category, rows]) => {
						const sub = totalsOf(rows);
						const subMonthly = Array(12).fill(0);
						for (const r of rows) for (let i = 0; i < 12; i++) subMonthly[i] += r.months[i];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FragmentGroup, {
							category,
							children: [rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2 sticky left-0 bg-card z-10 font-mono text-[10px]",
										children: s.asset.asset_number ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2 font-medium text-foreground",
										children: s.asset.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2 text-muted-foreground",
										children: s.asset.location ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2 font-mono text-[10px]",
										children: [s.asset.purchase_date, s.asset.disposal_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground",
											children: ["disp. ", s.asset.disposal_date]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono",
										children: formatMoney(s.asset.purchase_price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono border-l border-border",
										children: formatMoney(s.openingNBV)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono text-emerald-600 dark:text-emerald-400",
										children: formatMoney(s.additions)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono text-red-600 dark:text-red-400",
										children: formatMoney(s.disposals)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono font-semibold",
										children: formatMoney(s.yearDepreciation)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono font-semibold border-r border-border",
										children: formatMoney(s.closingNBV)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-right p-2 font-mono text-muted-foreground",
										children: [(s.asset.rate_per_year * 100).toFixed(1), "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono text-muted-foreground",
										children: formatMoney(s.monthlyDepreciation)
									}),
									s.months.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono",
										children: formatMoney(m)
									}, i)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right p-2 font-mono border-l border-border",
										children: formatMoney(s.closingAccumulated)
									})
								]
							}, s.asset.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubtotalRow, {
								label: `Subtotal — ${category}`,
								totals: sub,
								monthly: subMonthly,
								tone: "muted"
							})]
						}, category);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubtotalRow, {
						label: "GRAND TOTAL",
						totals,
						monthly: monthlyTotals,
						tone: "grand"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryPreviewDialog, {
				open: summaryOpen,
				onOpenChange: setSummaryOpen,
				groups,
				year
			})
		]
	});
}
function SummaryPreviewDialog({ open, onOpenChange, groups, year }) {
	const { rows, total } = (0, import_react.useMemo)(() => computeSummaryTotals(groups), [groups]);
	const company = "GastronoAssets — Hotel & Gastro Service";
	const [place, setPlace] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [preparedBy, setPreparedBy] = (0, import_react.useState)("");
	const [approvedBy, setApprovedBy] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-5xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Summary preview — A4 landscape" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white text-black border border-border rounded-md shadow-sm mx-auto",
					style: {
						width: "100%",
						aspectRatio: "842 / 595"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-full w-full p-6 flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold",
									children: "Fixed Asset Register — Summary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-gray-600 mt-1",
									children: ["Financial year ", year]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-sm",
										children: company
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-gray-600",
										children: ["As at 31.12.", year]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-[11px] mt-4 border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-neutral-700 text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left p-2 font-semibold",
											children: "Category"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right p-2 font-semibold",
											children: "Cost (purchase)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right p-2 font-semibold",
											children: "NBV 01.01."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right p-2 font-semibold",
											children: "Additions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right p-2 font-semibold",
											children: "Disposals"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right p-2 font-semibold",
											children: "Depreciation"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right p-2 font-semibold",
											children: "NBV 31.12."
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-neutral-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 font-semibold",
											children: r.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(r.cost)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(r.nbvOpen)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(r.add)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(r.disp)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(r.depr)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(r.nbvClose)
										})
									]
								}, r.category)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-blue-50 font-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: "TOTAL"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(total.cost)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(total.nbvOpen)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(total.add)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(total.disp)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(total.depr)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-right p-2 font-mono",
											children: formatMoney(total.nbvClose)
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 border border-neutral-300 bg-neutral-50 rounded px-3 py-2 flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-sm",
									children: [
										"Total depreciation ",
										year,
										":"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-base font-mono",
									children: formatMoney(total.depr)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Place, Date:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [
											place || "____________",
											(place || date) && ", ",
											date || "____________"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-8 mt-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] mb-1 h-4",
											children: preparedBy
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-black" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] mt-1",
											children: "Signature — prepared by"
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] mb-1 h-4",
											children: approvedBy
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-black" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] mt-1",
											children: "Signature — approved by"
										})
									] })]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sum-place",
								children: "Place"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sum-place",
								value: place,
								onChange: (e) => setPlace(e.target.value),
								placeholder: "e.g. Berlin"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sum-date",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sum-date",
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sum-prep",
								children: "Prepared by"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sum-prep",
								value: preparedBy,
								onChange: (e) => setPreparedBy(e.target.value),
								placeholder: "Name"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sum-app",
								children: "Approved by"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sum-app",
								value: approvedBy,
								onChange: (e) => setApprovedBy(e.target.value),
								placeholder: "Name"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						exportSummaryPDF(groups, year, {
							place,
							date,
							preparedBy,
							approvedBy
						});
						onOpenChange(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), " Download PDF"]
				})] })
			]
		})
	});
}
function FragmentGroup({ category, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: "bg-secondary/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			colSpan: 25,
			className: "p-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground sticky left-0",
			children: category
		})
	}), children] });
}
function totalsOf(rows) {
	return rows.reduce((acc, r) => ({
		costPurchase: acc.costPurchase + r.asset.purchase_price,
		openingNBV: acc.openingNBV + r.openingNBV,
		additions: acc.additions + r.additions,
		disposals: acc.disposals + r.disposals,
		yearDepreciation: acc.yearDepreciation + r.yearDepreciation,
		closingNBV: acc.closingNBV + r.closingNBV,
		closingAccumulated: acc.closingAccumulated + r.closingAccumulated
	}), {
		costPurchase: 0,
		openingNBV: 0,
		additions: 0,
		disposals: 0,
		yearDepreciation: 0,
		closingNBV: 0,
		closingAccumulated: 0
	});
}
function SubtotalRow({ label, totals, monthly, tone }) {
	const bg = tone === "grand" ? "bg-primary/10 font-bold" : "bg-muted/40 font-semibold";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: `${bg} border-b border-border`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: `p-2 ${bg}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: `p-2 text-foreground ${bg}`,
				colSpan: 3,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono",
				children: formatMoney(totals.costPurchase)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono border-l border-border",
				children: formatMoney(totals.openingNBV)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono text-emerald-700 dark:text-emerald-300",
				children: formatMoney(totals.additions)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono text-red-700 dark:text-red-300",
				children: formatMoney(totals.disposals)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono",
				children: formatMoney(totals.yearDepreciation)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono border-r border-border",
				children: formatMoney(totals.closingNBV)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}),
			monthly.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono",
				children: formatMoney(m)
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "text-right p-2 font-mono border-l border-border",
				children: formatMoney(totals.closingAccumulated)
			})
		]
	});
}
//#endregion
export { SchedulePage as component };
