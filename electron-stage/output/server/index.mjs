globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as NodeResponse, i as defineLazyEventHandler, l as serve, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"27a-HWEkItQm+6alpgzGvXv+fybfac8\"",
		"mtime": "2026-06-29T04:41:15.344Z",
		"size": 634,
		"path": "../public/manifest.webmanifest"
	},
	"/assets/_app-BZiMChGf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78f-r2dTY0xvVViO9Xeh6uzueuGIXuw\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 1935,
		"path": "../public/assets/_app-BZiMChGf.js"
	},
	"/assets/_app.assets-g2EyNJDj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a3e-p/gDsZRnUz0aC2Og1FVwD+AuRWU\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 19006,
		"path": "../public/assets/_app.assets-g2EyNJDj.js"
	},
	"/assets/chunk-Bh1tDfsg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"237-RWMfWL++Hyx/oSoFmTJgBJkEveY\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 567,
		"path": "../public/assets/chunk-Bh1tDfsg.js"
	},
	"/assets/dist-BI6C27it.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f64-Boy1fQbiMhpkbMGHXM6KPfMPkVs\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 32612,
		"path": "../public/assets/dist-BI6C27it.js"
	},
	"/assets/index.es-BALEkBrv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f76-LiYXIVLggHKpj1GaWWStLoAm2Jc\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 151414,
		"path": "../public/assets/index.es-BALEkBrv.js"
	},
	"/assets/_app.schedule-CR8k7WKg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e704-WHQyEmsSwMWKKbwzHANE1z3moRA\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 452356,
		"path": "../public/assets/_app.schedule-CR8k7WKg.js"
	},
	"/assets/jsx-runtime-BVygFP0V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ed0-GCT+uEH6Tyc5S9hM7djzUeJKYv4\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 7888,
		"path": "../public/assets/jsx-runtime-BVygFP0V.js"
	},
	"/assets/purify.es-Bu4Grnl0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65fb-UUUgPD99pIfMSCpTHJ8CGM9NB7I\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 26107,
		"path": "../public/assets/purify.es-Bu4Grnl0.js"
	},
	"/assets/styles-DMbx_Bz4.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"12399-6aonx4F6aYcwskpRHWH/LOy4t+w\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 74649,
		"path": "../public/assets/styles-DMbx_Bz4.css"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 271,
		"path": "../public/assets/typeof-B5XbjTb1.js"
	},
	"/assets/react-dom-SkAHSzMq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dfb-na7o69U6Q//rzJPlcu7HEq96+xc\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 3579,
		"path": "../public/assets/react-dom-SkAHSzMq.js"
	},
	"/assets/useStore-lmgXrw0N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ffa-KMW7EBQH/TZlyJBD4pGTq++XGbQ\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 20474,
		"path": "../public/assets/useStore-lmgXrw0N.js"
	},
	"/assets/routes-GOYjy20P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-Rwl02o1RoEhERPbkWl6otEXq3xE\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 141,
		"path": "../public/assets/routes-GOYjy20P.js"
	},
	"/assets/html2canvas-BzFc_22V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b90-JEFgXzStFDCRTEEsYA2dyAqTnE8\"",
		"mtime": "2026-06-29T04:41:14.663Z",
		"size": 199568,
		"path": "../public/assets/html2canvas-BzFc_22V.js"
	},
	"/assets/index-CTtuj8_o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c61d-fT+JKKEXODeviR0j8Sd+Jqy1LhE\"",
		"mtime": "2026-06-29T04:41:14.662Z",
		"size": 575005,
		"path": "../public/assets/index-CTtuj8_o.js"
	},
	"/assets/xlsx-DVN-43Cj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9e198-UNwy/OcFgCwsH378QASAkqdbMoI\"",
		"mtime": "2026-06-29T04:41:14.664Z",
		"size": 647576,
		"path": "../public/assets/xlsx-DVN-43Cj.js"
	},
	"/icons/icon.png": {
		"type": "image/png",
		"etag": "\"14c21e-QzBxmjGpwfzZ01Cwz4fHwu39JMo\"",
		"mtime": "2026-06-29T04:41:15.345Z",
		"size": 1360414,
		"path": "../public/icons/icon.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_j21Qvj = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_j21Qvj
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
