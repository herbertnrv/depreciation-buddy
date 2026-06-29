import { c as lazyRouteComponent, l as createFileRoute } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, n as enumType, r as objectType, t as coerce } from "./_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.schedule-Be2WWpiQ.js
var searchSchema = objectType({
	year: coerce.number().int().min(1990).max(2100).catch((/* @__PURE__ */ new Date()).getFullYear()),
	sort: enumType([
		"asset_number",
		"description",
		"location",
		"purchase_date",
		"costPurchase",
		"openingNBV",
		"additions",
		"disposals",
		"yearDepreciation",
		"closingNBV",
		"rate",
		"monthly",
		"m1",
		"m2",
		"m3",
		"m4",
		"m5",
		"m6",
		"m7",
		"m8",
		"m9",
		"m10",
		"m11",
		"m12",
		"closingAccumulated"
	]).catch("purchase_date"),
	dir: enumType(["asc", "desc"]).catch("asc"),
	category: stringType().optional().catch(void 0),
	catDir: enumType(["asc", "desc"]).catch("asc")
});
var $$splitComponentImporter = () => import("./_app.schedule-CE4Ip_Ri.mjs");
var Route = createFileRoute("/_app/schedule")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
