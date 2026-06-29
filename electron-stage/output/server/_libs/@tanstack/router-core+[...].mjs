import { D as createLRUCache, O as invariant, T as rootRouteId, _ as createInlineCssStyleAsset, g as createInlineCssPlaceholderAsset, h as TSR_SCRIPT_BARRIER_ID, k as decodePath, m as GLOBAL_TSR, v as getStylesheetHref, y as isInlinableStylesheet } from "./react-router+[...].mjs";
//#region node_modules/seroval/dist/esm/production/index.mjs
var L$1 = ((i) => (i[i.AggregateError = 1] = "AggregateError", i[i.ArrowFunction = 2] = "ArrowFunction", i[i.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i[i.ObjectAssign = 8] = "ObjectAssign", i[i.BigIntTypedArray = 16] = "BigIntTypedArray", i[i.RegExp = 32] = "RegExp", i))(L$1 || {});
var v$1 = Symbol.asyncIterator, mr = Symbol.hasInstance, R = Symbol.isConcatSpreadable, C = Symbol.iterator, pr = Symbol.match, dr = Symbol.matchAll, gr = Symbol.replace, yr = Symbol.search, Nr = Symbol.species, br = Symbol.split, vr = Symbol.toPrimitive, P$1 = Symbol.toStringTag, Cr = Symbol.unscopables;
var rt = {
	0: "Symbol.asyncIterator",
	1: "Symbol.hasInstance",
	2: "Symbol.isConcatSpreadable",
	3: "Symbol.iterator",
	4: "Symbol.match",
	5: "Symbol.matchAll",
	6: "Symbol.replace",
	7: "Symbol.search",
	8: "Symbol.species",
	9: "Symbol.split",
	10: "Symbol.toPrimitive",
	11: "Symbol.toStringTag",
	12: "Symbol.unscopables"
}, ve = {
	[v$1]: 0,
	[mr]: 1,
	[R]: 2,
	[C]: 3,
	[pr]: 4,
	[dr]: 5,
	[gr]: 6,
	[yr]: 7,
	[Nr]: 8,
	[br]: 9,
	[vr]: 10,
	[P$1]: 11,
	[Cr]: 12
}, tt = {
	0: v$1,
	1: mr,
	2: R,
	3: C,
	4: pr,
	5: dr,
	6: gr,
	7: yr,
	8: Nr,
	9: br,
	10: vr,
	11: P$1,
	12: Cr
}, nt = {
	2: "!0",
	3: "!1",
	1: "void 0",
	0: "null",
	4: "-0",
	5: "1/0",
	6: "-1/0",
	7: "0/0"
}, o$1 = void 0, ot = {
	2: !0,
	3: !1,
	1: o$1,
	0: null,
	4: -0,
	5: Number.POSITIVE_INFINITY,
	6: Number.NEGATIVE_INFINITY,
	7: NaN
};
var Ce = {
	0: "Error",
	1: "EvalError",
	2: "RangeError",
	3: "ReferenceError",
	4: "SyntaxError",
	5: "TypeError",
	6: "URIError"
}, at = {
	0: Error,
	1: EvalError,
	2: RangeError,
	3: ReferenceError,
	4: SyntaxError,
	5: TypeError,
	6: URIError
};
function c$1(e, r, t, n, a, s, i, u, l, g, S, d) {
	return {
		t: e,
		i: r,
		s: t,
		c: n,
		m: a,
		p: s,
		e: i,
		a: u,
		f: l,
		b: g,
		o: S,
		l: d
	};
}
function B$1(e) {
	return c$1(2, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
var J = B$1(2), Z = B$1(3), Ae = B$1(1), Ee = B$1(0), st = B$1(4), it = B$1(5), ut = B$1(6), lt = B$1(7);
function fn(e) {
	switch (e) {
		case "\"": return "\\\"";
		case "\\": return "\\\\";
		case `
`: return "\\n";
		case "\r": return "\\r";
		case "\b": return "\\b";
		case "	": return "\\t";
		case "\f": return "\\f";
		case "<": return "\\x3C";
		case "\u2028": return "\\u2028";
		case "\u2029": return "\\u2029";
		default: return o$1;
	}
}
function y$1(e) {
	let r = "", t = 0, n;
	for (let a = 0, s = e.length; a < s; a++) n = fn(e[a]), n && (r += e.slice(t, a) + n, t = a + 1);
	return t === 0 ? r = e : r += e.slice(t), r;
}
function Sn(e) {
	switch (e) {
		case "\\\\": return "\\";
		case "\\\"": return "\"";
		case "\\n": return `
`;
		case "\\r": return "\r";
		case "\\b": return "\b";
		case "\\t": return "	";
		case "\\f": return "\f";
		case "\\x3C": return "<";
		case "\\u2028": return "\u2028";
		case "\\u2029": return "\u2029";
		default: return e;
	}
}
function D$1(e) {
	return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, Sn);
}
var U = "__SEROVAL_REFS__", ce = "$R", Ie = `self.${ce}`;
function mn(e) {
	return e == null ? `${Ie}=${Ie}||[]` : `(${Ie}=${Ie}||{})["${y$1(e)}"]=[]`;
}
var Ar = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
function Er(e) {
	return Ar.has(e);
}
function dn(e) {
	return j.has(e);
}
function ct(e) {
	if (Er(e)) return Ar.get(e);
	throw new Re(e);
}
function ft(e) {
	if (dn(e)) return j.get(e);
	throw new Pe(e);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof window != "undefined" ? Object.defineProperty(window, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof self != "undefined" ? Object.defineProperty(self, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof global != "undefined" && Object.defineProperty(global, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
});
function xe(e) {
	return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function gn(e) {
	let r = Ce[xe(e)];
	return e.name !== r ? { name: e.name } : e.constructor.name !== r ? { name: e.constructor.name } : {};
}
function $$1(e, r) {
	let t = gn(e), n = Object.getOwnPropertyNames(e);
	for (let a = 0, s = n.length, i; a < s; a++) i = n[a], i !== "name" && i !== "message" && (i === "stack" ? r & 4 && (t = t || {}, t[i] = e[i]) : (t = t || {}, t[i] = e[i]));
	return t;
}
function Oe(e) {
	return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function Te(e) {
	switch (e) {
		case Number.POSITIVE_INFINITY: return it;
		case Number.NEGATIVE_INFINITY: return ut;
	}
	return e !== e ? lt : Object.is(e, -0) ? st : c$1(0, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function X(e) {
	return c$1(1, o$1, y$1(e), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function we(e) {
	return c$1(3, o$1, "" + e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function mt(e) {
	return c$1(4, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function he(e, r) {
	let t = r.valueOf();
	return c$1(5, e, t !== t ? "" : r.toISOString(), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function ze(e, r) {
	return c$1(6, e, o$1, y$1(r.source), r.flags, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function pt(e, r) {
	return c$1(17, e, ve[r], o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function dt(e, r) {
	return c$1(18, e, y$1(ct(r)), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function fe$1(e, r, t) {
	return c$1(25, e, t, y$1(r), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function _e(e, r, t) {
	return c$1(9, e, o$1, o$1, o$1, o$1, o$1, t, o$1, o$1, Oe(r), o$1);
}
function ke(e, r) {
	return c$1(21, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function De(e, r, t) {
	return c$1(15, e, o$1, r.constructor.name, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.length);
}
function Fe(e, r, t) {
	return c$1(16, e, o$1, r.constructor.name, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.byteLength);
}
function Be(e, r, t) {
	return c$1(20, e, o$1, o$1, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.byteLength);
}
function Ve(e, r, t) {
	return c$1(13, e, xe(r), o$1, y$1(r.message), t, o$1, o$1, o$1, o$1, o$1, o$1);
}
function Me(e, r, t) {
	return c$1(14, e, xe(r), o$1, y$1(r.message), t, o$1, o$1, o$1, o$1, o$1, o$1);
}
function Le(e, r) {
	return c$1(7, e, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1, o$1);
}
function Ue(e, r) {
	return c$1(28, o$1, o$1, o$1, o$1, o$1, o$1, [e, r], o$1, o$1, o$1, o$1);
}
function je(e, r) {
	return c$1(30, o$1, o$1, o$1, o$1, o$1, o$1, [e, r], o$1, o$1, o$1, o$1);
}
function Ye(e, r, t) {
	return c$1(31, e, o$1, o$1, o$1, o$1, o$1, t, r, o$1, o$1, o$1);
}
function qe(e, r) {
	return c$1(32, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function We(e, r) {
	return c$1(33, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Ge(e, r) {
	return c$1(34, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Ke(e, r, t, n) {
	return c$1(35, e, t, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1, n);
}
var { toString: ys } = Object.prototype;
var yn = {
	parsing: 1,
	serialization: 2,
	deserialization: 3
};
function Nn(e) {
	return `Seroval Error (step: ${yn[e]})`;
}
var bn = (e, r) => Nn(e), Se = class extends Error {
	constructor(t, n) {
		super(bn(t, n));
		this.cause = n;
	}
}, z = class extends Se {
	constructor(r) {
		super("parsing", r);
	}
}, He = class extends Se {
	constructor(r) {
		super("deserialization", r);
	}
};
function _(e) {
	return `Seroval Error (specific: ${e})`;
}
var x$1 = class extends Error {
	constructor(t) {
		super(_(1));
		this.value = t;
	}
}, w$1 = class extends Error {
	constructor(r) {
		super(_(2));
	}
}, Q = class extends Error {
	constructor(r) {
		super(_(3));
	}
}, V = class extends Error {
	constructor(r) {
		super(_(4));
	}
}, Re = class extends Error {
	constructor(t) {
		super(_(5));
		this.value = t;
	}
}, Pe = class extends Error {
	constructor(r) {
		super(_(6));
	}
}, Je = class extends Error {
	constructor(r) {
		super(_(7));
	}
}, h$1 = class extends Error {
	constructor(r) {
		super(_(8));
	}
}, ee = class extends Error {
	constructor(r) {
		super(_(9));
	}
};
var Y$1 = class {
	constructor(r, t) {
		this.value = r;
		this.replacement = t;
	}
};
var re = () => {
	let e = {
		p: 0,
		s: 0,
		f: 0
	};
	return e.p = new Promise((r, t) => {
		e.s = r, e.f = t;
	}), e;
}, vn = (e, r) => {
	e.s(r), e.p.s = 1, e.p.v = r;
}, Cn = (e, r) => {
	e.f(r), e.p.s = 2, e.p.v = r;
}, yt = re.toString(), Nt = vn.toString(), bt = Cn.toString(), Rr = () => {
	let e = [], r = [], t = !0, n = !1, a = 0, s = (l, g, S) => {
		for (S = 0; S < a; S++) r[S] && r[S][g](l);
	}, i = (l, g, S, d) => {
		for (g = 0, S = e.length; g < S; g++) d = e[g], !t && g === S - 1 ? l[n ? "return" : "throw"](d) : l.next(d);
	}, u = (l, g) => (t && (g = a++, r[g] = l), i(l), () => {
		t && (r[g] = r[a], r[a--] = void 0);
	});
	return {
		__SEROVAL_STREAM__: !0,
		on: (l) => u(l),
		next: (l) => {
			t && (e.push(l), s(l, "next"));
		},
		throw: (l) => {
			t && (e.push(l), s(l, "throw"), t = !1, n = !1, r.length = 0);
		},
		return: (l) => {
			t && (e.push(l), s(l, "return"), t = !1, n = !0, r.length = 0);
		}
	};
}, vt = Rr.toString(), Pr = (e) => (r) => () => {
	let t = 0, n = {
		[e]: () => n,
		next: () => {
			if (t > r.d) return {
				done: !0,
				value: void 0
			};
			let a = t++, s = r.v[a];
			if (a === r.t) throw s;
			return {
				done: a === r.d,
				value: s
			};
		}
	};
	return n;
}, Ct = Pr.toString(), xr = (e, r) => (t) => () => {
	let n = 0, a = -1, s = !1, i = [], u = [], l = (S = 0, d = u.length) => {
		for (; S < d; S++) u[S].s({
			done: !0,
			value: void 0
		});
	};
	t.on({
		next: (S) => {
			let d = u.shift();
			d && d.s({
				done: !1,
				value: S
			}), i.push(S);
		},
		throw: (S) => {
			let d = u.shift();
			d && d.f(S), l(), a = i.length, s = !0, i.push(S);
		},
		return: (S) => {
			let d = u.shift();
			d && d.s({
				done: !0,
				value: S
			}), l(), a = i.length, i.push(S);
		}
	});
	let g = {
		[e]: () => g,
		next: () => {
			if (a === -1) {
				let K = n++;
				if (K >= i.length) {
					let et = r();
					return u.push(et), et.p;
				}
				return {
					done: !1,
					value: i[K]
				};
			}
			if (n > a) return {
				done: !0,
				value: void 0
			};
			let S = n++, d = i[S];
			if (S !== a) return {
				done: !1,
				value: d
			};
			if (s) throw d;
			return {
				done: !0,
				value: d
			};
		}
	};
	return g;
}, At = xr.toString(), Or = (e) => {
	let r = atob(e), t = r.length, n = new Uint8Array(t);
	for (let a = 0; a < t; a++) n[a] = r.charCodeAt(a);
	return n.buffer;
}, Et = Or.toString();
function Ze(e) {
	return "__SEROVAL_SEQUENCE__" in e;
}
function Tr(e, r, t) {
	return {
		__SEROVAL_SEQUENCE__: !0,
		v: e,
		t: r,
		d: t
	};
}
function $e(e) {
	let r = [], t = -1, n = -1, a = e[C]();
	for (;;) try {
		let s = a.next();
		if (r.push(s.value), s.done) {
			n = r.length - 1;
			break;
		}
	} catch (s) {
		t = r.length, r.push(s);
	}
	return Tr(r, t, n);
}
var An = Pr(C);
function It(e) {
	return An(e);
}
var Rt = {}, Pt = {};
var xt = {
	0: {},
	1: {},
	2: {},
	3: {},
	4: {},
	5: {}
}, Ot = {
	0: "[]",
	1: yt,
	2: Nt,
	3: bt,
	4: vt,
	5: Et
};
function M(e) {
	return "__SEROVAL_STREAM__" in e;
}
function te$1() {
	return Rr();
}
function Xe(e) {
	let r = te$1(), t = e[v$1]();
	async function n() {
		try {
			let a = await t.next();
			a.done ? r.return(a.value) : (r.next(a.value), await n());
		} catch (a) {
			r.throw(a);
		}
	}
	return n().catch(() => {}), r;
}
var En = xr(v$1, re);
function Tt(e) {
	return En(e);
}
async function wr(e) {
	try {
		return [1, await e];
	} catch (r) {
		return [0, r];
	}
}
function pe$1(e, r) {
	return {
		plugins: r.plugins,
		mode: e,
		marked: /* @__PURE__ */ new Set(),
		features: 63 ^ (r.disabledFeatures || 0),
		refs: r.refs || /* @__PURE__ */ new Map(),
		depthLimit: r.depthLimit || 1e3
	};
}
function de(e, r) {
	e.marked.add(r);
}
function hr(e, r) {
	let t = e.refs.size;
	return e.refs.set(r, t), t;
}
function Qe(e, r) {
	let t = e.refs.get(r);
	return t != null ? (de(e, t), {
		type: 1,
		value: mt(t)
	}) : {
		type: 0,
		value: hr(e, r)
	};
}
function q$1(e, r) {
	let t = Qe(e, r);
	return t.type === 1 ? t : Er(r) ? {
		type: 2,
		value: dt(t.value, r)
	} : t;
}
function I(e, r) {
	let t = q$1(e, r);
	if (t.type !== 0) return t.value;
	if (r in ve) return pt(t.value, r);
	throw new x$1(r);
}
function k(e, r) {
	let t = Qe(e, xt[r]);
	return t.type === 1 ? t.value : c$1(26, t.value, r, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function er(e) {
	let r = Qe(e, Rt);
	return r.type === 1 ? r.value : c$1(27, r.value, o$1, o$1, o$1, o$1, o$1, o$1, I(e, C), o$1, o$1, o$1);
}
function rr(e) {
	let r = Qe(e, Pt);
	return r.type === 1 ? r.value : c$1(29, r.value, o$1, o$1, o$1, o$1, o$1, [k(e, 1), I(e, v$1)], o$1, o$1, o$1, o$1);
}
function tr(e, r, t, n) {
	return c$1(t ? 11 : 10, e, o$1, o$1, o$1, n, o$1, o$1, o$1, o$1, Oe(r), o$1);
}
function nr(e, r, t, n) {
	return c$1(8, r, o$1, o$1, o$1, o$1, {
		k: t,
		v: n
	}, o$1, k(e, 0), o$1, o$1, o$1);
}
function ht(e, r, t) {
	return c$1(22, r, t, o$1, o$1, o$1, o$1, o$1, k(e, 1), o$1, o$1, o$1);
}
function or(e, r, t) {
	let n = new Uint8Array(t), a = "";
	for (let s = 0, i = n.length; s < i; s++) a += String.fromCharCode(n[s]);
	return c$1(19, r, y$1(btoa(a)), o$1, o$1, o$1, o$1, o$1, k(e, 5), o$1, o$1, o$1);
}
function ne$1(e, r) {
	return {
		base: pe$1(e, r),
		child: void 0
	};
}
var _r = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return N$1(this._p, this.depth, r);
	}
};
async function Rn(e, r, t) {
	let n = [];
	for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = await N$1(e, r, t[a]) : n[a] = 0;
	return n;
}
async function Pn(e, r, t, n) {
	return _e(t, n, await Rn(e, r, n));
}
async function kr(e, r, t) {
	let n = Object.entries(t), a = [], s = [];
	for (let i = 0, u = n.length; i < u; i++) a.push(y$1(n[i][0])), s.push(await N$1(e, r, n[i][1]));
	return C in t && (a.push(I(e.base, C)), s.push(Ue(er(e.base), await N$1(e, r, $e(t))))), v$1 in t && (a.push(I(e.base, v$1)), s.push(je(rr(e.base), await N$1(e, r, Xe(t))))), P$1 in t && (a.push(I(e.base, P$1)), s.push(X(t[P$1]))), R in t && (a.push(I(e.base, R)), s.push(t[R] ? J : Z)), {
		k: a,
		v: s
	};
}
async function zr(e, r, t, n, a) {
	return tr(t, n, a, await kr(e, r, n));
}
async function xn(e, r, t, n) {
	return ke(t, await N$1(e, r, n.valueOf()));
}
async function On(e, r, t, n) {
	return De(t, n, await N$1(e, r, n.buffer));
}
async function Tn(e, r, t, n) {
	return Fe(t, n, await N$1(e, r, n.buffer));
}
async function wn(e, r, t, n) {
	return Be(t, n, await N$1(e, r, n.buffer));
}
async function zt(e, r, t, n) {
	let a = $$1(n, e.base.features);
	return Ve(t, n, a ? await kr(e, r, a) : o$1);
}
async function hn(e, r, t, n) {
	let a = $$1(n, e.base.features);
	return Me(t, n, a ? await kr(e, r, a) : o$1);
}
async function zn(e, r, t, n) {
	let a = [], s = [];
	for (let [i, u] of n.entries()) a.push(await N$1(e, r, i)), s.push(await N$1(e, r, u));
	return nr(e.base, t, a, s);
}
async function _n(e, r, t, n) {
	let a = [];
	for (let s of n.keys()) a.push(await N$1(e, r, s));
	return Le(t, a);
}
async function _t(e, r, t, n) {
	let a = e.base.plugins;
	if (a) for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.async && u.test(n)) return fe$1(t, u.tag, await u.parse.async(n, new _r(e, r), { id: t }));
	}
	return o$1;
}
async function kn(e, r, t, n) {
	let [a, s] = await wr(n);
	return c$1(12, t, a, o$1, o$1, o$1, o$1, o$1, await N$1(e, r, s), o$1, o$1, o$1);
}
function Dn(e, r, t, n, a) {
	let s = [], i = t.on({
		next: (u) => {
			de(this.base, r), N$1(this, e, u).then((l) => {
				s.push(qe(r, l));
			}, (l) => {
				a(l), i();
			});
		},
		throw: (u) => {
			de(this.base, r), N$1(this, e, u).then((l) => {
				s.push(We(r, l)), n(s), i();
			}, (l) => {
				a(l), i();
			});
		},
		return: (u) => {
			de(this.base, r), N$1(this, e, u).then((l) => {
				s.push(Ge(r, l)), n(s), i();
			}, (l) => {
				a(l), i();
			});
		}
	});
}
async function Fn(e, r, t, n) {
	return Ye(t, k(e.base, 4), await new Promise(Dn.bind(e, r, t, n)));
}
async function Bn(e, r, t, n) {
	let a = [];
	for (let s = 0, i = n.v.length; s < i; s++) a[s] = await N$1(e, r, n.v[s]);
	return Ke(t, a, n.t, n.d);
}
async function Vn(e, r, t, n) {
	if (Array.isArray(n)) return Pn(e, r, t, n);
	if (M(n)) return Fn(e, r, t, n);
	if (Ze(n)) return Bn(e, r, t, n);
	let a = n.constructor;
	if (a === Y$1) return N$1(e, r, n.replacement);
	let s = await _t(e, r, t, n);
	if (s) return s;
	switch (a) {
		case Object: return zr(e, r, t, n, !1);
		case o$1: return zr(e, r, t, n, !0);
		case Date: return he(t, n);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return zt(e, r, t, n);
		case Number:
		case Boolean:
		case String:
		case BigInt: return xn(e, r, t, n);
		case ArrayBuffer: return or(e.base, t, n);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return On(e, r, t, n);
		case DataView: return wn(e, r, t, n);
		case Map: return zn(e, r, t, n);
		case Set: return _n(e, r, t, n);
		default: break;
	}
	if (a === Promise || n instanceof Promise) return kn(e, r, t, n);
	let i = e.base.features;
	if (i & 32 && a === RegExp) return ze(t, n);
	if (i & 16) switch (a) {
		case BigInt64Array:
		case BigUint64Array: return Tn(e, r, t, n);
		default: break;
	}
	if (i & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return hn(e, r, t, n);
	if (n instanceof Error) return zt(e, r, t, n);
	if (C in n || v$1 in n) return zr(e, r, t, n, !!a);
	throw new x$1(n);
}
async function Mn(e, r, t) {
	let n = q$1(e.base, t);
	if (n.type !== 0) return n.value;
	let a = await _t(e, r, n.value, t);
	if (a) return a;
	throw new x$1(t);
}
async function N$1(e, r, t) {
	switch (typeof t) {
		case "boolean": return t ? J : Z;
		case "undefined": return Ae;
		case "string": return X(t);
		case "number": return Te(t);
		case "bigint": return we(t);
		case "object":
			if (t) {
				let n = q$1(e.base, t);
				return n.type === 0 ? await Vn(e, r + 1, n.value, t) : n.value;
			}
			return Ee;
		case "symbol": return I(e.base, t);
		case "function": return Mn(e, r, t);
		default: throw new x$1(t);
	}
}
async function oe(e, r) {
	try {
		return await N$1(e, 0, r);
	} catch (t) {
		throw t instanceof z ? t : new z(t);
	}
}
var ae = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(ae || {});
function ni(e) {
	return e;
}
function kt(e, r) {
	for (let t = 0, n = r.length; t < n; t++) {
		let a = r[t];
		e.has(a) || (e.add(a), a.extends && kt(e, a.extends));
	}
}
function A(e) {
	if (e) {
		let r = /* @__PURE__ */ new Set();
		return kt(r, e), [...r];
	}
}
function Dt(e) {
	switch (e) {
		case "Int8Array": return Int8Array;
		case "Int16Array": return Int16Array;
		case "Int32Array": return Int32Array;
		case "Uint8Array": return Uint8Array;
		case "Uint16Array": return Uint16Array;
		case "Uint32Array": return Uint32Array;
		case "Uint8ClampedArray": return Uint8ClampedArray;
		case "Float32Array": return Float32Array;
		case "Float64Array": return Float64Array;
		case "BigInt64Array": return BigInt64Array;
		case "BigUint64Array": return BigUint64Array;
		default: throw new Je(e);
	}
}
var Ln = 1e6, Un = 1e4, jn = 2e4;
function Bt(e, r) {
	switch (r) {
		case 3: return Object.freeze(e);
		case 1: return Object.preventExtensions(e);
		case 2: return Object.seal(e);
		default: return e;
	}
}
var Yn = 1e3;
function Vt(e, r) {
	var t;
	return {
		mode: e,
		plugins: r.plugins,
		refs: r.refs || /* @__PURE__ */ new Map(),
		features: (t = r.features) != null ? t : 63 ^ (r.disabledFeatures || 0),
		depthLimit: r.depthLimit || Yn
	};
}
function Mt(e) {
	return {
		mode: 1,
		base: Vt(1, e),
		child: o$1,
		state: { marked: new Set(e.markedRefs) }
	};
}
var Dr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	deserialize(r) {
		return p$1(this._p, this.depth, r);
	}
};
function Ut(e, r) {
	if (r < 0 || !Number.isFinite(r) || !Number.isInteger(r)) throw new h$1({
		t: 4,
		i: r
	});
	if (e.refs.has(r)) throw new Error("Conflicted ref id: " + r);
}
function qn(e, r, t) {
	return Ut(e.base, r), e.state.marked.has(r) && e.base.refs.set(r, t), t;
}
function Wn(e, r, t) {
	return Ut(e.base, r), e.base.refs.set(r, t), t;
}
function b(e, r, t) {
	return e.mode === 1 ? qn(e, r, t) : Wn(e, r, t);
}
function Fr(e, r, t) {
	if (Object.hasOwn(r, t)) return r[t];
	throw new h$1(e);
}
function Gn(e, r) {
	return b(e, r.i, ft(D$1(r.s)));
}
function Kn(e, r, t) {
	let n = t.a, a = n.length, s = b(e, t.i, new Array(a));
	for (let i = 0, u; i < a; i++) u = n[i], u && (s[i] = p$1(e, r, u));
	return Bt(s, t.o), s;
}
function Hn(e) {
	switch (e) {
		case "constructor":
		case "__proto__":
		case "prototype":
		case "__defineGetter__":
		case "__defineSetter__":
		case "__lookupGetter__":
		case "__lookupSetter__": return !1;
		default: return !0;
	}
}
function Jn(e) {
	switch (e) {
		case v$1:
		case R:
		case P$1:
		case C: return !0;
		default: return !1;
	}
}
function Ft(e, r, t) {
	Hn(r) ? e[r] = t : Object.defineProperty(e, r, {
		value: t,
		configurable: !0,
		enumerable: !0,
		writable: !0
	});
}
function Zn(e, r, t, n, a) {
	if (typeof n == "string") Ft(t, D$1(n), p$1(e, r, a));
	else {
		let s = p$1(e, r, n);
		switch (typeof s) {
			case "string":
				Ft(t, s, p$1(e, r, a));
				break;
			case "symbol":
				Jn(s) && (t[s] = p$1(e, r, a));
				break;
			default: throw new h$1(n);
		}
	}
}
function jt(e, r, t, n) {
	let a = t.k;
	if (a.length > 0) for (let i = 0, u = t.v, l = a.length; i < l; i++) Zn(e, r, n, a[i], u[i]);
	return n;
}
function $n(e, r, t) {
	let n = b(e, t.i, t.t === 10 ? {} : Object.create(null));
	return jt(e, r, t.p, n), Bt(n, t.o), n;
}
function Xn(e, r) {
	return b(e, r.i, new Date(r.s));
}
function Qn(e, r) {
	if (e.base.features & 32) {
		let t = D$1(r.c);
		if (t.length > jn) throw new h$1(r);
		return b(e, r.i, new RegExp(t, r.m));
	}
	throw new w$1(r);
}
function eo(e, r, t) {
	let n = b(e, t.i, /* @__PURE__ */ new Set());
	for (let a = 0, s = t.a, i = s.length; a < i; a++) n.add(p$1(e, r, s[a]));
	return n;
}
function ro(e, r, t) {
	let n = b(e, t.i, /* @__PURE__ */ new Map());
	for (let a = 0, s = t.e.k, i = t.e.v, u = s.length; a < u; a++) n.set(p$1(e, r, s[a]), p$1(e, r, i[a]));
	return n;
}
function to(e, r) {
	if (r.s.length > Ln) throw new h$1(r);
	return b(e, r.i, Or(D$1(r.s)));
}
function no(e, r, t) {
	var u;
	let n = Dt(t.c), a = p$1(e, r, t.f), s = (u = t.b) != null ? u : 0;
	if (s < 0 || s > a.byteLength) throw new h$1(t);
	return b(e, t.i, new n(a, s, t.l));
}
function oo(e, r, t) {
	var i;
	let n = p$1(e, r, t.f), a = (i = t.b) != null ? i : 0;
	if (a < 0 || a > n.byteLength) throw new h$1(t);
	return b(e, t.i, new DataView(n, a, t.l));
}
function Yt(e, r, t, n) {
	if (t.p) {
		let a = jt(e, r, t.p, {});
		Object.defineProperties(n, Object.getOwnPropertyDescriptors(a));
	}
	return n;
}
function ao(e, r, t) {
	return Yt(e, r, t, b(e, t.i, new AggregateError([], D$1(t.m))));
}
function so(e, r, t) {
	let n = Fr(t, at, t.s);
	return Yt(e, r, t, b(e, t.i, new n(D$1(t.m))));
}
function io(e, r, t) {
	let n = re(), a = b(e, t.i, n.p), s = p$1(e, r, t.f);
	return t.s ? n.s(s) : n.f(s), a;
}
function uo(e, r, t) {
	return b(e, t.i, Object(p$1(e, r, t.f)));
}
function lo(e, r, t) {
	let n = e.base.plugins;
	if (n) {
		let a = D$1(t.c);
		for (let s = 0, i = n.length; s < i; s++) {
			let u = n[s];
			if (u.tag === a) return b(e, t.i, u.deserialize(t.s, new Dr(e, r), { id: t.i }));
		}
	}
	throw new Q(t.c);
}
function co(e, r) {
	return b(e, r.i, b(e, r.s, re()).p);
}
function fo(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return n.s(p$1(e, r, t.a[1])), o$1;
	throw new V("Promise");
}
function So(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return n.f(p$1(e, r, t.a[1])), o$1;
	throw new V("Promise");
}
function mo(e, r, t) {
	p$1(e, r, t.a[0]);
	return It(p$1(e, r, t.a[1]));
}
function po(e, r, t) {
	p$1(e, r, t.a[0]);
	return Tt(p$1(e, r, t.a[1]));
}
function go(e, r, t) {
	let n = b(e, t.i, te$1()), a = t.a, s = a.length;
	if (s) for (let i = 0; i < s; i++) p$1(e, r, a[i]);
	return n;
}
function yo(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n && M(n)) return n.next(p$1(e, r, t.f)), o$1;
	throw new V("Stream");
}
function No(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n && M(n)) return n.throw(p$1(e, r, t.f)), o$1;
	throw new V("Stream");
}
function bo(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n && M(n)) return n.return(p$1(e, r, t.f)), o$1;
	throw new V("Stream");
}
function vo(e, r, t) {
	return p$1(e, r, t.f), o$1;
}
function Co(e, r, t) {
	return p$1(e, r, t.a[1]), o$1;
}
function Ao(e, r, t) {
	let n = b(e, t.i, Tr([], t.s, t.l));
	for (let a = 0, s = t.a.length; a < s; a++) n.v[a] = p$1(e, r, t.a[a]);
	return n;
}
function p$1(e, r, t) {
	if (r > e.base.depthLimit) throw new ee(e.base.depthLimit);
	switch (r += 1, t.t) {
		case 2: return Fr(t, ot, t.s);
		case 0: return Number(t.s);
		case 1: return D$1(String(t.s));
		case 3:
			if (String(t.s).length > Un) throw new h$1(t);
			return BigInt(t.s);
		case 4: return e.base.refs.get(t.i);
		case 18: return Gn(e, t);
		case 9: return Kn(e, r, t);
		case 10:
		case 11: return $n(e, r, t);
		case 5: return Xn(e, t);
		case 6: return Qn(e, t);
		case 7: return eo(e, r, t);
		case 8: return ro(e, r, t);
		case 19: return to(e, t);
		case 16:
		case 15: return no(e, r, t);
		case 20: return oo(e, r, t);
		case 14: return ao(e, r, t);
		case 13: return so(e, r, t);
		case 12: return io(e, r, t);
		case 17: return Fr(t, tt, t.s);
		case 21: return uo(e, r, t);
		case 25: return lo(e, r, t);
		case 22: return co(e, t);
		case 23: return fo(e, r, t);
		case 24: return So(e, r, t);
		case 28: return mo(e, r, t);
		case 30: return po(e, r, t);
		case 31: return go(e, r, t);
		case 32: return yo(e, r, t);
		case 33: return No(e, r, t);
		case 34: return bo(e, r, t);
		case 27: return vo(e, r, t);
		case 29: return Co(e, r, t);
		case 35: return Ao(e, r, t);
		default: throw new w$1(t);
	}
}
function ar(e, r) {
	try {
		return p$1(e, 0, r);
	} catch (t) {
		throw new He(t);
	}
}
var Eo = () => T, Io = Eo.toString(), qt = /=>/.test(Io);
function sr(e, r) {
	return qt ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function Wt(e, r) {
	return qt ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var Ht = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", Gt = Ht.length, Jt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", Kt = Jt.length;
function Br(e) {
	let r = e % Gt, t = Ht[r];
	for (e = (e - r) / Gt; e > 0;) r = e % Kt, t += Jt[r], e = (e - r) / Kt;
	return t;
}
var Ro = /^[$A-Z_][0-9A-Z_$]*$/i;
function Vr(e) {
	let r = e[0];
	return (r === "$" || r === "_" || r >= "A" && r <= "Z" || r >= "a" && r <= "z") && Ro.test(e);
}
function ye(e) {
	switch (e.t) {
		case 0: return e.s + "=" + e.v;
		case 2: return e.s + ".set(" + e.k + "," + e.v + ")";
		case 1: return e.s + ".add(" + e.v + ")";
		case 3: return e.s + ".delete(" + e.k + ")";
	}
}
function Po(e) {
	let r = [], t = e[0];
	for (let n = 1, a = e.length, s, i = t; n < a; n++) s = e[n], s.t === 0 && s.v === i.v ? t = {
		t: 0,
		s: s.s,
		k: o$1,
		v: ye(t)
	} : s.t === 2 && s.s === i.s ? t = {
		t: 2,
		s: ye(t),
		k: s.k,
		v: s.v
	} : s.t === 1 && s.s === i.s ? t = {
		t: 1,
		s: ye(t),
		k: o$1,
		v: s.v
	} : s.t === 3 && s.s === i.s ? t = {
		t: 3,
		s: ye(t),
		k: s.k,
		v: o$1
	} : (r.push(t), t = s), i = s;
	return r.push(t), r;
}
function tn(e) {
	if (e.length) {
		let r = "", t = Po(e);
		for (let n = 0, a = t.length; n < a; n++) r += ye(t[n]) + ",";
		return r;
	}
	return o$1;
}
var xo = "Object.create(null)", Oo = "new Set", To = "new Map", wo = "Promise.resolve", ho = "Promise.reject", zo = {
	3: "Object.freeze",
	2: "Object.seal",
	1: "Object.preventExtensions",
	0: o$1
};
function nn(e, r) {
	return {
		mode: e,
		plugins: r.plugins,
		features: r.features,
		marked: new Set(r.markedRefs),
		stack: [],
		flags: [],
		assignments: []
	};
}
function ur(e) {
	return {
		mode: 2,
		base: nn(2, e),
		state: e,
		child: o$1
	};
}
var Mr = class {
	constructor(r) {
		this._p = r;
	}
	serialize(r) {
		return f$1(this._p, r);
	}
};
function ko(e, r) {
	let t = e.valid.get(r);
	t ?? (t = e.valid.size, e.valid.set(r, t));
	let n = e.vars[t];
	return n ?? (n = Br(t), e.vars[t] = n), n;
}
function Do(e) {
	return ce + "[" + e + "]";
}
function m$1(e, r) {
	return e.mode === 1 ? ko(e.state, r) : Do(r);
}
function O$1(e, r) {
	e.marked.add(r);
}
function Lr(e, r) {
	return e.marked.has(r);
}
function jr(e, r, t) {
	r !== 0 && (O$1(e.base, t), e.base.flags.push({
		type: r,
		value: m$1(e, t)
	}));
}
function Fo(e) {
	let r = "";
	for (let t = 0, n = e.flags, a = n.length; t < a; t++) {
		let s = n[t];
		r += zo[s.type] + "(" + s.value + "),";
	}
	return r;
}
function on(e) {
	let r = tn(e.assignments), t = Fo(e);
	return r ? t ? r + t : r : t;
}
function Yr(e, r, t) {
	e.assignments.push({
		t: 0,
		s: r,
		k: o$1,
		v: t
	});
}
function Bo(e, r, t) {
	e.base.assignments.push({
		t: 1,
		s: m$1(e, r),
		k: o$1,
		v: t
	});
}
function ge(e, r, t, n) {
	e.base.assignments.push({
		t: 2,
		s: m$1(e, r),
		k: t,
		v: n
	});
}
function Zt(e, r, t) {
	e.base.assignments.push({
		t: 3,
		s: m$1(e, r),
		k: t,
		v: o$1
	});
}
function Ne(e, r, t, n) {
	Yr(e.base, m$1(e, r) + "[" + t + "]", n);
}
function Ur(e, r, t, n) {
	Yr(e.base, m$1(e, r) + "." + t, n);
}
function Vo(e, r, t, n) {
	Yr(e.base, m$1(e, r) + ".v[" + t + "]", n);
}
function F(e, r) {
	return r.t === 4 && e.stack.includes(r.i);
}
function se(e, r, t) {
	return e.mode === 1 && !Lr(e.base, r) ? t : m$1(e, r) + "=" + t;
}
function Mo(e) {
	return U + ".get(\"" + e.s + "\")";
}
function $t(e, r, t, n) {
	return t ? F(e.base, t) ? (O$1(e.base, r), Ne(e, r, n, m$1(e, t.i)), "") : f$1(e, t) : "";
}
function Lo(e, r) {
	let t = r.i, n = r.a, a = n.length;
	if (a > 0) {
		e.base.stack.push(t);
		let s = $t(e, t, n[0], 0), i = s === "";
		for (let u = 1, l; u < a; u++) l = $t(e, t, n[u], u), s += "," + l, i = l === "";
		return e.base.stack.pop(), jr(e, r.o, r.i), "[" + s + (i ? ",]" : "]");
	}
	return "[]";
}
function Xt(e, r, t, n) {
	if (typeof t == "string") {
		let a = Number(t), s = a >= 0 && a.toString() === t || Vr(t);
		if (F(e.base, n)) {
			let i = m$1(e, n.i);
			return O$1(e.base, r.i), s && a !== a ? Ur(e, r.i, t, i) : Ne(e, r.i, s ? t : "\"" + t + "\"", i), "";
		}
		return (s ? t : "\"" + t + "\"") + ":" + f$1(e, n);
	}
	return "[" + f$1(e, t) + "]:" + f$1(e, n);
}
function an(e, r, t) {
	let n = t.k, a = n.length;
	if (a > 0) {
		let s = t.v;
		e.base.stack.push(r.i);
		let i = Xt(e, r, n[0], s[0]);
		for (let u = 1, l = i; u < a; u++) l = Xt(e, r, n[u], s[u]), i += (l && i && ",") + l;
		return e.base.stack.pop(), "{" + i + "}";
	}
	return "{}";
}
function Uo(e, r) {
	return jr(e, r.o, r.i), an(e, r, r.p);
}
function jo(e, r, t, n) {
	let a = an(e, r, t);
	return a !== "{}" ? "Object.assign(" + n + "," + a + ")" : n;
}
function Yo(e, r, t, n, a) {
	let s = e.base, i = f$1(e, a), u = Number(n), l = u >= 0 && u.toString() === n || Vr(n);
	if (F(s, a)) l && u !== u ? Ur(e, r.i, n, i) : Ne(e, r.i, l ? n : "\"" + n + "\"", i);
	else {
		let g = s.assignments;
		s.assignments = t, l && u !== u ? Ur(e, r.i, n, i) : Ne(e, r.i, l ? n : "\"" + n + "\"", i), s.assignments = g;
	}
}
function qo(e, r, t, n, a) {
	if (typeof n == "string") Yo(e, r, t, n, a);
	else {
		let s = e.base, i = s.stack;
		s.stack = [];
		let u = f$1(e, a);
		s.stack = i;
		let l = s.assignments;
		s.assignments = t, Ne(e, r.i, f$1(e, n), u), s.assignments = l;
	}
}
function Wo(e, r, t) {
	let n = t.k, a = n.length;
	if (a > 0) {
		let s = [], i = t.v;
		e.base.stack.push(r.i);
		for (let u = 0; u < a; u++) qo(e, r, s, n[u], i[u]);
		return e.base.stack.pop(), tn(s);
	}
	return o$1;
}
function qr(e, r, t) {
	if (r.p) {
		let n = e.base;
		if (n.features & 8) t = jo(e, r, r.p, t);
		else {
			O$1(n, r.i);
			let a = Wo(e, r, r.p);
			if (a) return "(" + se(e, r.i, t) + "," + a + m$1(e, r.i) + ")";
		}
	}
	return t;
}
function Go(e, r) {
	return jr(e, r.o, r.i), qr(e, r, xo);
}
function Ko(e) {
	return "new Date(\"" + e.s + "\")";
}
function Ho(e, r) {
	if (e.base.features & 32) return "/" + r.c + "/" + r.m;
	throw new w$1(r);
}
function Qt(e, r, t) {
	let n = e.base;
	return F(n, t) ? (O$1(n, r), Bo(e, r, m$1(e, t.i)), "") : f$1(e, t);
}
function Jo(e, r) {
	let t = Oo, n = r.a, a = n.length, s = r.i;
	if (a > 0) {
		e.base.stack.push(s);
		let i = Qt(e, s, n[0]);
		for (let u = 1, l = i; u < a; u++) l = Qt(e, s, n[u]), i += (l && i && ",") + l;
		e.base.stack.pop(), i && (t += "([" + i + "])");
	}
	return t;
}
function en(e, r, t, n, a) {
	let s = e.base;
	if (F(s, t)) {
		let i = m$1(e, t.i);
		if (O$1(s, r), F(s, n)) return ge(e, r, i, m$1(e, n.i)), "";
		if (n.t !== 4 && n.i != null && Lr(s, n.i)) {
			let l = "(" + f$1(e, n) + ",[" + a + "," + a + "])";
			return ge(e, r, i, m$1(e, n.i)), Zt(e, r, a), l;
		}
		let u = s.stack;
		return s.stack = [], ge(e, r, i, f$1(e, n)), s.stack = u, "";
	}
	if (F(s, n)) {
		let i = m$1(e, n.i);
		if (O$1(s, r), t.t !== 4 && t.i != null && Lr(s, t.i)) {
			let l = "(" + f$1(e, t) + ",[" + a + "," + a + "])";
			return ge(e, r, m$1(e, t.i), i), Zt(e, r, a), l;
		}
		let u = s.stack;
		return s.stack = [], ge(e, r, f$1(e, t), i), s.stack = u, "";
	}
	return "[" + f$1(e, t) + "," + f$1(e, n) + "]";
}
function Zo(e, r) {
	let t = To, n = r.e.k, a = n.length, s = r.i, i = r.f, u = m$1(e, i.i), l = e.base;
	if (a > 0) {
		let g = r.e.v;
		l.stack.push(s);
		let S = en(e, s, n[0], g[0], u);
		for (let d = 1, K = S; d < a; d++) K = en(e, s, n[d], g[d], u), S += (K && S && ",") + K;
		l.stack.pop(), S && (t += "([" + S + "])");
	}
	return i.t === 26 && (O$1(l, i.i), t = "(" + f$1(e, i) + "," + t + ")"), t;
}
function $o(e, r) {
	return W(e, r.f) + "(\"" + r.s + "\")";
}
function Xo(e, r) {
	return "new " + r.c + "(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function Qo(e, r) {
	return "new DataView(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function ea(e, r) {
	let t = r.i;
	e.base.stack.push(t);
	let n = qr(e, r, "new AggregateError([],\"" + r.m + "\")");
	return e.base.stack.pop(), n;
}
function ra(e, r) {
	return qr(e, r, "new " + Ce[r.s] + "(\"" + r.m + "\")");
}
function ta(e, r) {
	let t, n = r.f, a = r.i, s = r.s ? wo : ho, i = e.base;
	if (F(i, n)) {
		let u = m$1(e, n.i);
		t = s + (r.s ? "().then(" + sr([], u) + ")" : "().catch(" + Wt([], "throw " + u) + ")");
	} else {
		i.stack.push(a);
		let u = f$1(e, n);
		i.stack.pop(), t = s + "(" + u + ")";
	}
	return t;
}
function na(e, r) {
	return "Object(" + f$1(e, r.f) + ")";
}
function W(e, r) {
	let t = f$1(e, r);
	return r.t === 4 ? t : "(" + t + ")";
}
function oa(e, r) {
	if (e.mode === 1) throw new w$1(r);
	return "(" + se(e, r.s, W(e, r.f) + "()") + ").p";
}
function aa(e, r) {
	if (e.mode === 1) throw new w$1(r);
	return W(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function sa(e, r) {
	if (e.mode === 1) throw new w$1(r);
	return W(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function ia(e, r) {
	let t = e.base.plugins;
	if (t) for (let n = 0, a = t.length; n < a; n++) {
		let s = t[n];
		if (s.tag === r.c) return e.child ??= new Mr(e), s.serialize(r.s, e.child, { id: r.i });
	}
	throw new Q(r.c);
}
function ua(e, r) {
	let t = "", n = !1;
	return r.f.t !== 4 && (O$1(e.base, r.f.i), t = "(" + f$1(e, r.f) + ",", n = !0), t += se(e, r.i, "(" + Ct + ")(" + m$1(e, r.f.i) + ")"), n && (t += ")"), t;
}
function la(e, r) {
	return W(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function ca(e, r) {
	let t = r.a[0], n = r.a[1], a = e.base, s = "";
	t.t !== 4 && (O$1(a, t.i), s += "(" + f$1(e, t)), n.t !== 4 && (O$1(a, n.i), s += (s ? "," : "(") + f$1(e, n)), s && (s += ",");
	let i = se(e, r.i, "(" + At + ")(" + m$1(e, n.i) + "," + m$1(e, t.i) + ")");
	return s ? s + i + ")" : i;
}
function fa(e, r) {
	return W(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function Sa(e, r) {
	let t = se(e, r.i, W(e, r.f) + "()"), n = r.a.length;
	if (n) {
		let a = f$1(e, r.a[0]);
		for (let s = 1; s < n; s++) a += "," + f$1(e, r.a[s]);
		return "(" + t + "," + a + "," + m$1(e, r.i) + ")";
	}
	return t;
}
function ma(e, r) {
	return m$1(e, r.i) + ".next(" + f$1(e, r.f) + ")";
}
function pa(e, r) {
	return m$1(e, r.i) + ".throw(" + f$1(e, r.f) + ")";
}
function da(e, r) {
	return m$1(e, r.i) + ".return(" + f$1(e, r.f) + ")";
}
function rn(e, r, t, n) {
	let a = e.base;
	return F(a, n) ? (O$1(a, r), Vo(e, r, t, m$1(e, n.i)), "") : f$1(e, n);
}
function ga(e, r) {
	let t = r.a, n = t.length, a = r.i;
	if (n > 0) {
		e.base.stack.push(a);
		let s = rn(e, a, 0, t[0]);
		for (let i = 1, u = s; i < n; i++) u = rn(e, a, i, t[i]), s += (u && s && ",") + u;
		if (e.base.stack.pop(), s) return "{__SEROVAL_SEQUENCE__:!0,v:[" + s + "],t:" + r.s + ",d:" + r.l + "}";
	}
	return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function ya(e, r) {
	switch (r.t) {
		case 17: return rt[r.s];
		case 18: return Mo(r);
		case 9: return Lo(e, r);
		case 10: return Uo(e, r);
		case 11: return Go(e, r);
		case 5: return Ko(r);
		case 6: return Ho(e, r);
		case 7: return Jo(e, r);
		case 8: return Zo(e, r);
		case 19: return $o(e, r);
		case 16:
		case 15: return Xo(e, r);
		case 20: return Qo(e, r);
		case 14: return ea(e, r);
		case 13: return ra(e, r);
		case 12: return ta(e, r);
		case 21: return na(e, r);
		case 22: return oa(e, r);
		case 25: return ia(e, r);
		case 26: return Ot[r.s];
		case 35: return ga(e, r);
		default: throw new w$1(r);
	}
}
function f$1(e, r) {
	switch (r.t) {
		case 2: return nt[r.s];
		case 0: return "" + r.s;
		case 1: return "\"" + r.s + "\"";
		case 3: return r.s + "n";
		case 4: return m$1(e, r.i);
		case 23: return aa(e, r);
		case 24: return sa(e, r);
		case 27: return ua(e, r);
		case 28: return la(e, r);
		case 29: return ca(e, r);
		case 30: return fa(e, r);
		case 31: return Sa(e, r);
		case 32: return ma(e, r);
		case 33: return pa(e, r);
		case 34: return da(e, r);
		default: return se(e, r.i, ya(e, r));
	}
}
function cr(e, r) {
	let t = f$1(e, r), n = r.i;
	if (n == null) return t;
	let a = on(e.base), s = m$1(e, n), i = e.state.scopeId, u = i == null ? "" : ce, l = a ? "(" + t + "," + a + s + ")" : t;
	if (u === "") return r.t === 10 && !a ? "(" + l + ")" : l;
	let g = i == null ? "()" : "(" + ce + "[\"" + y$1(i) + "\"])";
	return "(" + sr([u], l) + ")" + g;
}
var Gr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return E$1(this._p, this.depth, r);
	}
}, Kr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return E$1(this._p, this.depth, r);
	}
	parseWithError(r) {
		return G(this._p, this.depth, r);
	}
	isAlive() {
		return this._p.state.alive;
	}
	pushPendingState() {
		Xr(this._p);
	}
	popPendingState() {
		be(this._p);
	}
	onParse(r) {
		ie(this._p, r);
	}
	onError(r) {
		Zr(this._p, r);
	}
};
function Na(e) {
	return {
		alive: !0,
		pending: 0,
		initial: !0,
		buffer: [],
		onParse: e.onParse,
		onError: e.onError,
		onDone: e.onDone
	};
}
function Hr(e) {
	return {
		type: 2,
		base: pe$1(2, e),
		state: Na(e)
	};
}
function ba(e, r, t) {
	let n = [];
	for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = E$1(e, r, t[a]) : n[a] = 0;
	return n;
}
function va(e, r, t, n) {
	return _e(t, n, ba(e, r, n));
}
function Jr(e, r, t) {
	let n = Object.entries(t), a = [], s = [];
	for (let i = 0, u = n.length; i < u; i++) a.push(y$1(n[i][0])), s.push(E$1(e, r, n[i][1]));
	return C in t && (a.push(I(e.base, C)), s.push(Ue(er(e.base), E$1(e, r, $e(t))))), v$1 in t && (a.push(I(e.base, v$1)), s.push(je(rr(e.base), E$1(e, r, e.type === 1 ? te$1() : Xe(t))))), P$1 in t && (a.push(I(e.base, P$1)), s.push(X(t[P$1]))), R in t && (a.push(I(e.base, R)), s.push(t[R] ? J : Z)), {
		k: a,
		v: s
	};
}
function Wr(e, r, t, n, a) {
	return tr(t, n, a, Jr(e, r, n));
}
function Ca(e, r, t, n) {
	return ke(t, E$1(e, r, n.valueOf()));
}
function Aa(e, r, t, n) {
	return De(t, n, E$1(e, r, n.buffer));
}
function Ea(e, r, t, n) {
	return Fe(t, n, E$1(e, r, n.buffer));
}
function Ia(e, r, t, n) {
	return Be(t, n, E$1(e, r, n.buffer));
}
function sn(e, r, t, n) {
	let a = $$1(n, e.base.features);
	return Ve(t, n, a ? Jr(e, r, a) : o$1);
}
function Ra(e, r, t, n) {
	let a = $$1(n, e.base.features);
	return Me(t, n, a ? Jr(e, r, a) : o$1);
}
function Pa(e, r, t, n) {
	let a = [], s = [];
	for (let [i, u] of n.entries()) a.push(E$1(e, r, i)), s.push(E$1(e, r, u));
	return nr(e.base, t, a, s);
}
function xa(e, r, t, n) {
	let a = [];
	for (let s of n.keys()) a.push(E$1(e, r, s));
	return Le(t, a);
}
function Oa(e, r, t, n) {
	let a = Ye(t, k(e.base, 4), []);
	return e.type === 1 || (Xr(e), n.on({
		next: (s) => {
			if (e.state.alive) {
				let i = G(e, r, s);
				i && ie(e, qe(t, i));
			}
		},
		throw: (s) => {
			if (e.state.alive) {
				let i = G(e, r, s);
				i && ie(e, We(t, i));
			}
			be(e);
		},
		return: (s) => {
			if (e.state.alive) {
				let i = G(e, r, s);
				i && ie(e, Ge(t, i));
			}
			be(e);
		}
	})), a;
}
function Ta(e, r, t) {
	if (this.state.alive) {
		let n = G(this, r, t);
		n && ie(this, c$1(23, e, o$1, o$1, o$1, o$1, o$1, [k(this.base, 2), n], o$1, o$1, o$1, o$1)), be(this);
	}
}
function wa(e, r, t) {
	if (this.state.alive) {
		let n = G(this, r, t);
		n && ie(this, c$1(24, e, o$1, o$1, o$1, o$1, o$1, [k(this.base, 3), n], o$1, o$1, o$1, o$1));
	}
	be(this);
}
function ha(e, r, t, n) {
	let a = hr(e.base, {});
	return e.type === 2 && (Xr(e), n.then(Ta.bind(e, a, r), wa.bind(e, a, r))), ht(e.base, t, a);
}
function za(e, r, t, n, a) {
	for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.sync && u.test(n)) return fe$1(t, u.tag, u.parse.sync(n, new Gr(e, r), { id: t }));
	}
	return o$1;
}
function _a(e, r, t, n, a) {
	for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.stream && u.test(n)) return fe$1(t, u.tag, u.parse.stream(n, new Kr(e, r), { id: t }));
	}
	return o$1;
}
function un(e, r, t, n) {
	let a = e.base.plugins;
	return a ? e.type === 1 ? za(e, r, t, n, a) : _a(e, r, t, n, a) : o$1;
}
function ka(e, r, t, n) {
	let a = [];
	for (let s = 0, i = n.v.length; s < i; s++) a[s] = E$1(e, r, n.v[s]);
	return Ke(t, a, n.t, n.d);
}
function Da(e, r, t, n, a) {
	switch (a) {
		case Object: return Wr(e, r, t, n, !1);
		case o$1: return Wr(e, r, t, n, !0);
		case Date: return he(t, n);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return sn(e, r, t, n);
		case Number:
		case Boolean:
		case String:
		case BigInt: return Ca(e, r, t, n);
		case ArrayBuffer: return or(e.base, t, n);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return Aa(e, r, t, n);
		case DataView: return Ia(e, r, t, n);
		case Map: return Pa(e, r, t, n);
		case Set: return xa(e, r, t, n);
		default: break;
	}
	if (a === Promise || n instanceof Promise) return ha(e, r, t, n);
	let s = e.base.features;
	if (s & 32 && a === RegExp) return ze(t, n);
	if (s & 16) switch (a) {
		case BigInt64Array:
		case BigUint64Array: return Ea(e, r, t, n);
		default: break;
	}
	if (s & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return Ra(e, r, t, n);
	if (n instanceof Error) return sn(e, r, t, n);
	if (C in n || v$1 in n) return Wr(e, r, t, n, !!a);
	throw new x$1(n);
}
function Fa(e, r, t, n) {
	if (Array.isArray(n)) return va(e, r, t, n);
	if (M(n)) return Oa(e, r, t, n);
	if (Ze(n)) return ka(e, r, t, n);
	let a = n.constructor;
	if (a === Y$1) return E$1(e, r, n.replacement);
	return un(e, r, t, n) || Da(e, r, t, n, a);
}
function Ba(e, r, t) {
	let n = q$1(e.base, t);
	if (n.type !== 0) return n.value;
	let a = un(e, r, n.value, t);
	if (a) return a;
	throw new x$1(t);
}
function E$1(e, r, t) {
	if (r >= e.base.depthLimit) throw new ee(e.base.depthLimit);
	switch (typeof t) {
		case "boolean": return t ? J : Z;
		case "undefined": return Ae;
		case "string": return X(t);
		case "number": return Te(t);
		case "bigint": return we(t);
		case "object":
			if (t) {
				let n = q$1(e.base, t);
				return n.type === 0 ? Fa(e, r + 1, n.value, t) : n.value;
			}
			return Ee;
		case "symbol": return I(e.base, t);
		case "function": return Ba(e, r, t);
		default: throw new x$1(t);
	}
}
function ie(e, r) {
	e.state.initial ? e.state.buffer.push(r) : $r(e, r, !1);
}
function Zr(e, r) {
	if (e.state.onError) e.state.onError(r);
	else throw r instanceof z ? r : new z(r);
}
function ln(e) {
	e.state.onDone && e.state.onDone();
}
function $r(e, r, t) {
	try {
		e.state.onParse(r, t);
	} catch (n) {
		Zr(e, n);
	}
}
function Xr(e) {
	e.state.pending++;
}
function be(e) {
	--e.state.pending <= 0 && ln(e);
}
function G(e, r, t) {
	try {
		return E$1(e, r, t);
	} catch (n) {
		return Zr(e, n), o$1;
	}
}
function Qr(e, r) {
	let t = G(e, 0, r);
	t && ($r(e, t, !0), e.state.initial = !1, Va(e, e.state), e.state.pending <= 0 && fr(e));
}
function Va(e, r) {
	for (let t = 0, n = r.buffer.length; t < n; t++) $r(e, r.buffer[t], !1);
}
function fr(e) {
	e.state.alive && (ln(e), e.state.alive = !1);
}
async function ou(e, r = {}) {
	return await oe(ne$1(2, {
		plugins: A(r.plugins),
		disabledFeatures: r.disabledFeatures,
		refs: r.refs
	}), e);
}
function cn(e, r) {
	let t = A(r.plugins), n = Hr({
		plugins: t,
		refs: r.refs,
		disabledFeatures: r.disabledFeatures,
		onParse(a, s) {
			let i = ur({
				plugins: t,
				features: n.base.features,
				scopeId: r.scopeId,
				markedRefs: n.base.marked
			}), u;
			try {
				u = cr(i, a);
			} catch (l) {
				r.onError && r.onError(l);
				return;
			}
			r.onSerialize(u, s);
		},
		onError: r.onError,
		onDone: r.onDone
	});
	return Qr(n, e), fr.bind(null, n);
}
function au(e, r) {
	let n = Hr({
		plugins: A(r.plugins),
		refs: r.refs,
		disabledFeatures: r.disabledFeatures,
		depthLimit: r.depthLimit,
		onParse: r.onParse,
		onError: r.onError,
		onDone: r.onDone
	});
	return Qr(n, e), fr.bind(null, n);
}
function Iu(e, r = {}) {
	var i;
	let t = A(r.plugins), n = r.disabledFeatures || 0, a = (i = e.f) != null ? i : 63;
	return ar(Mt({
		plugins: t,
		markedRefs: e.m,
		features: a & ~n,
		disabledFeatures: n
	}), e.t);
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/serializer/transformer.js
/**
* Create a strongly-typed serialization adapter for SSR hydration.
* Use to register custom types with the router serializer.
*/
function createSerializationAdapter(opts) {
	return opts;
}
/** Create a Seroval plugin for server-side serialization only. */
/* @__NO_SIDE_EFFECTS__ */
function makeSsrSerovalPlugin(serializationAdapter, options) {
	return /* @__PURE__ */ ni({
		tag: "$TSR/t/" + serializationAdapter.key,
		test: serializationAdapter.test,
		parse: { stream(value, ctx, _data) {
			return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
		} },
		serialize(node, ctx, _data) {
			options.didRun = true;
			return GLOBAL_TSR + ".t.get(\"" + serializationAdapter.key + "\")(" + ctx.serialize(node.v) + ")";
		},
		deserialize: void 0
	});
}
/** Create a Seroval plugin for client/server symmetric (de)serialization. */
/* @__NO_SIDE_EFFECTS__ */
function makeSerovalPlugin(serializationAdapter) {
	return /* @__PURE__ */ ni({
		tag: "$TSR/t/" + serializationAdapter.key,
		test: serializationAdapter.test,
		parse: {
			sync(value, ctx, _data) {
				return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
			},
			async async(value, ctx, _data) {
				return { v: await ctx.parse(serializationAdapter.toSerializable(value)) };
			},
			stream(value, ctx, _data) {
				return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
			}
		},
		serialize: void 0,
		deserialize(node, ctx, _data) {
			return serializationAdapter.fromSerializable(ctx.deserialize(node.v));
		}
	});
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/serializer/RawStream.js
/**
* Marker class for ReadableStream<Uint8Array> that should be serialized
* with base64 encoding (SSR) or binary framing (server functions).
*
* Wrap your binary streams with this to get efficient serialization:
* ```ts
* // For binary data (files, images, etc.)
* return { data: new RawStream(file.stream()) }
*
* // For text-heavy data (RSC payloads, etc.)
* return { data: new RawStream(rscStream, { hint: 'text' }) }
* ```
*/
var RawStream = class {
	constructor(stream, options) {
		this.stream = stream;
		this.hint = options?.hint ?? "binary";
	}
};
var BufferCtor = globalThis.Buffer;
var hasNodeBuffer = !!BufferCtor && typeof BufferCtor.from === "function";
function uint8ArrayToBase64(bytes) {
	if (bytes.length === 0) return "";
	if (hasNodeBuffer) return BufferCtor.from(bytes).toString("base64");
	const CHUNK_SIZE = 32768;
	const chunks = [];
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		const chunk = bytes.subarray(i, i + CHUNK_SIZE);
		chunks.push(String.fromCharCode.apply(null, chunk));
	}
	return btoa(chunks.join(""));
}
function base64ToUint8Array(base64) {
	if (base64.length === 0) return new Uint8Array(0);
	if (hasNodeBuffer) {
		const buf = BufferCtor.from(base64, "base64");
		return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	}
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
var RAW_STREAM_FACTORY_BINARY = Object.create(null);
var RAW_STREAM_FACTORY_TEXT = Object.create(null);
var RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY = (stream) => new ReadableStream({ start(controller) {
	stream.on({
		next(base64) {
			try {
				controller.enqueue(base64ToUint8Array(base64));
			} catch {}
		},
		throw(error) {
			controller.error(error);
		},
		return() {
			try {
				controller.close();
			} catch {}
		}
	});
} });
var textEncoderForFactory = new TextEncoder();
var RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT = (stream) => {
	return new ReadableStream({ start(controller) {
		stream.on({
			next(value) {
				try {
					if (typeof value === "string") controller.enqueue(textEncoderForFactory.encode(value));
					else controller.enqueue(base64ToUint8Array(value.$b64));
				} catch {}
			},
			throw(error) {
				controller.error(error);
			},
			return() {
				try {
					controller.close();
				} catch {}
			}
		});
	} });
};
var FACTORY_BINARY = `(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))`;
var FACTORY_TEXT = `(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})`;
function toBinaryStream(readable) {
	const stream = te$1();
	const reader = readable.getReader();
	(async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					stream.return(void 0);
					break;
				}
				stream.next(uint8ArrayToBase64(value));
			}
		} catch (error) {
			stream.throw(error);
		} finally {
			reader.releaseLock();
		}
	})();
	return stream;
}
function toTextStream(readable) {
	const stream = te$1();
	const reader = readable.getReader();
	const decoder = new TextDecoder("utf-8", { fatal: true });
	(async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					try {
						const remaining = decoder.decode();
						if (remaining.length > 0) stream.next(remaining);
					} catch {}
					stream.return(void 0);
					break;
				}
				try {
					const text = decoder.decode(value, { stream: true });
					if (text.length > 0) stream.next(text);
				} catch {
					stream.next({ $b64: uint8ArrayToBase64(value) });
				}
			}
		} catch (error) {
			stream.throw(error);
		} finally {
			reader.releaseLock();
		}
	})();
	return stream;
}
/**
* SSR Plugin - uses base64 or UTF-8+base64 encoding for chunks, delegates to seroval's stream mechanism.
* Used during SSR when serializing to JavaScript code for HTML injection.
*
* Supports two modes based on RawStream hint:
* - 'binary': Always base64 encode (default)
* - 'text': Try UTF-8 first, fallback to base64 for invalid UTF-8
*/
var RawStreamSSRPlugin = /* @__PURE__ */ ni({
	tag: "tss/RawStream",
	extends: [/* @__PURE__ */ ni({
		tag: "tss/RawStreamFactory",
		test(value) {
			return value === RAW_STREAM_FACTORY_BINARY;
		},
		parse: {
			sync(_value, _ctx, _data) {
				return {};
			},
			async async(_value, _ctx, _data) {
				return {};
			},
			stream(_value, _ctx, _data) {
				return {};
			}
		},
		serialize(_node, _ctx, _data) {
			return FACTORY_BINARY;
		},
		deserialize(_node, _ctx, _data) {
			return RAW_STREAM_FACTORY_BINARY;
		}
	}), /* @__PURE__ */ ni({
		tag: "tss/RawStreamFactoryText",
		test(value) {
			return value === RAW_STREAM_FACTORY_TEXT;
		},
		parse: {
			sync(_value, _ctx, _data) {
				return {};
			},
			async async(_value, _ctx, _data) {
				return {};
			},
			stream(_value, _ctx, _data) {
				return {};
			}
		},
		serialize(_node, _ctx, _data) {
			return FACTORY_TEXT;
		},
		deserialize(_node, _ctx, _data) {
			return RAW_STREAM_FACTORY_TEXT;
		}
	})],
	test(value) {
		return value instanceof RawStream;
	},
	parse: {
		sync(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			return {
				hint: ctx.parse(value.hint),
				factory: ctx.parse(factory),
				stream: ctx.parse(te$1())
			};
		},
		async async(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
			return {
				hint: await ctx.parse(value.hint),
				factory: await ctx.parse(factory),
				stream: await ctx.parse(encodedStream)
			};
		},
		stream(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
			return {
				hint: ctx.parse(value.hint),
				factory: ctx.parse(factory),
				stream: ctx.parse(encodedStream)
			};
		}
	},
	serialize(node, ctx, _data) {
		return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
	},
	deserialize(node, ctx, _data) {
		const stream = ctx.deserialize(node.stream);
		return ctx.deserialize(node.hint) === "text" ? RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT(stream) : RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY(stream);
	}
});
/**
* Creates an RPC plugin instance that registers raw streams with a multiplexer.
* Used for server function responses where we want binary framing.
* Note: RPC always uses binary framing regardless of hint.
*
* @param onRawStream Callback invoked when a RawStream is encountered during serialization
*/
/* @__NO_SIDE_EFFECTS__ */
function createRawStreamRPCPlugin(onRawStream) {
	let nextStreamId = 1;
	return /* @__PURE__ */ ni({
		tag: "tss/RawStream",
		test(value) {
			return value instanceof RawStream;
		},
		parse: {
			async async(value, ctx, _data) {
				const streamId = nextStreamId++;
				onRawStream(streamId, value.stream);
				return { streamId: await ctx.parse(streamId) };
			},
			stream(value, ctx, _data) {
				const streamId = nextStreamId++;
				onRawStream(streamId, value.stream);
				return { streamId: ctx.parse(streamId) };
			}
		},
		serialize() {
			throw new Error("RawStreamRPCPlugin.serialize should not be called. RPC uses JSON serialization, not JS code generation.");
		},
		deserialize() {
			throw new Error("RawStreamRPCPlugin.deserialize should not be called. Use createRawStreamDeserializePlugin on client.");
		}
	});
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/serializer/ShallowErrorPlugin.js
/**
* this plugin serializes only the `message` part of an Error
* this helps with serializing e.g. a ZodError which has functions attached that cannot be serialized
*/
var ShallowErrorPlugin = /* @__PURE__ */ ni({
	tag: "$TSR/Error",
	test(value) {
		return value instanceof Error;
	},
	parse: {
		sync(value, ctx) {
			return { message: ctx.parse(value.message) };
		},
		async async(value, ctx) {
			return { message: await ctx.parse(value.message) };
		},
		stream(value, ctx) {
			return { message: ctx.parse(value.message) };
		}
	},
	serialize(node, ctx) {
		return "new Error(" + ctx.serialize(node.message) + ")";
	},
	deserialize(node, ctx) {
		return new Error(ctx.deserialize(node.message));
	}
});
var n = {}, P = (e) => new ReadableStream({ start: (r) => {
	e.on({
		next: (a) => {
			try {
				r.enqueue(a);
			} catch (t) {}
		},
		throw: (a) => {
			r.error(a);
		},
		return: () => {
			try {
				r.close();
			} catch (a) {}
		}
	});
} }), x = ni({
	tag: "seroval-plugins/web/ReadableStreamFactory",
	test(e) {
		return e === n;
	},
	parse: {
		sync() {
			return n;
		},
		async async() {
			return await Promise.resolve(n);
		},
		stream() {
			return n;
		}
	},
	serialize() {
		return P.toString();
	},
	deserialize() {
		return n;
	}
});
function w(e) {
	let r = te$1(), a = e.getReader();
	async function t() {
		try {
			let s = await a.read();
			s.done ? r.return(s.value) : (r.next(s.value), await t());
		} catch (s) {
			r.throw(s);
		}
	}
	return t().catch(() => {}), r;
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/serializer/seroval-plugins.js
var defaultSerovalPlugins = [
	ShallowErrorPlugin,
	RawStreamSSRPlugin,
	ni({
		tag: "seroval/plugins/web/ReadableStream",
		extends: [x],
		test(e) {
			return typeof ReadableStream == "undefined" ? !1 : e instanceof ReadableStream;
		},
		parse: {
			sync(e, r) {
				return {
					factory: r.parse(n),
					stream: r.parse(te$1())
				};
			},
			async async(e, r) {
				return {
					factory: await r.parse(n),
					stream: await r.parse(w(e))
				};
			},
			stream(e, r) {
				return {
					factory: r.parse(n),
					stream: r.parse(w(e))
				};
			}
		},
		serialize(e, r) {
			return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
		},
		deserialize(e, r) {
			return P(r.deserialize(e.stream));
		}
	})
];
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/ssr-match-id.js
function dehydrateSsrMatchId(id) {
	return id.replaceAll("/", "\0");
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/tsrScript.js
var tsrScript_default = "self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]}";
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/ssr-server.js
var SCOPE_ID = "tsr";
var TSR_PREFIX = GLOBAL_TSR + ".router=";
var P_PREFIX = GLOBAL_TSR + ".p(()=>";
var P_SUFFIX = ")";
function dehydrateMatch(match) {
	const dehydratedMatch = {
		i: dehydrateSsrMatchId(match.id),
		u: match.updatedAt,
		s: match.status
	};
	for (const [key, shorthand] of [
		["__beforeLoadContext", "b"],
		["loaderData", "l"],
		["error", "e"],
		["ssr", "ssr"]
	]) if (match[key] !== void 0) dehydratedMatch[shorthand] = match[key];
	if (match.globalNotFound) dehydratedMatch.g = true;
	return dehydratedMatch;
}
var INITIAL_SCRIPTS = [mn(SCOPE_ID), tsrScript_default];
var ScriptBuffer = class {
	constructor(router) {
		this._scriptBarrierLifted = false;
		this._cleanedUp = false;
		this._pendingMicrotask = false;
		this.router = router;
		this._queue = INITIAL_SCRIPTS.slice();
	}
	enqueue(script) {
		if (this._cleanedUp) return;
		this._queue.push(script);
		if (this._scriptBarrierLifted && !this._pendingMicrotask) {
			this._pendingMicrotask = true;
			queueMicrotask(() => {
				this._pendingMicrotask = false;
				this.injectBufferedScripts();
			});
		}
	}
	liftBarrier() {
		if (this._scriptBarrierLifted || this._cleanedUp) return;
		this._scriptBarrierLifted = true;
		if (this._queue.length > 0 && !this._pendingMicrotask) {
			this._pendingMicrotask = true;
			queueMicrotask(() => {
				this._pendingMicrotask = false;
				this.injectBufferedScripts();
			});
		}
	}
	/**
	* Flushes any pending scripts synchronously.
	* Call this before emitting onSerializationFinished to ensure all scripts are injected.
	*
	* IMPORTANT: Only injects if the barrier has been lifted. Before the barrier is lifted,
	* scripts should remain in the queue so takeBufferedScripts() can retrieve them
	*/
	flush() {
		if (!this._scriptBarrierLifted) return;
		if (this._cleanedUp) return;
		this._pendingMicrotask = false;
		const scriptsToInject = this.takeAll();
		if (scriptsToInject && this.router?.serverSsr) this.router.serverSsr.injectScript(scriptsToInject);
	}
	takeAll() {
		const bufferedScripts = this._queue;
		this._queue = [];
		if (bufferedScripts.length === 0) return;
		if (bufferedScripts.length === 1) return bufferedScripts[0] + ";document.currentScript.remove()";
		return bufferedScripts.join(";") + ";document.currentScript.remove()";
	}
	injectBufferedScripts() {
		if (this._cleanedUp) return;
		if (this._queue.length === 0) return;
		const scriptsToInject = this.takeAll();
		if (scriptsToInject && this.router?.serverSsr) this.router.serverSsr.injectScript(scriptsToInject);
	}
	cleanup() {
		this._cleanedUp = true;
		this._queue = [];
		this.router = void 0;
	}
};
var isProd = true;
var MANIFEST_CACHE_SIZE = 100;
var manifestCaches = /* @__PURE__ */ new WeakMap();
var inlineCssCaches = /* @__PURE__ */ new WeakMap();
function getManifestCache(manifest) {
	const cache = manifestCaches.get(manifest);
	if (cache) return cache;
	const newCache = createLRUCache(MANIFEST_CACHE_SIZE);
	manifestCaches.set(manifest, newCache);
	return newCache;
}
function getInlineCssCache(manifest) {
	const cache = inlineCssCaches.get(manifest);
	if (cache) return cache;
	const newCache = createLRUCache(MANIFEST_CACHE_SIZE);
	inlineCssCaches.set(manifest, newCache);
	return newCache;
}
function getInlineCssHrefsForMatches(manifest, matches) {
	const styles = manifest?.inlineCss?.styles;
	if (!styles) return [];
	const seen = /* @__PURE__ */ new Set();
	const hrefs = [];
	for (const match of matches) {
		const assets = manifest?.routes[match.routeId]?.assets ?? [];
		for (const asset of assets) {
			const href = getStylesheetHref(asset);
			if (!href || seen.has(href) || styles[href] === void 0) continue;
			seen.add(href);
			hrefs.push(href);
		}
	}
	return hrefs;
}
function getInlineCssForHrefs(manifest, hrefs) {
	const styles = manifest.inlineCss?.styles;
	if (!styles || hrefs.length === 0) return void 0;
	const cacheKey = hrefs.join("\0");
	if (isProd) {
		const cached = getInlineCssCache(manifest).get(cacheKey);
		if (cached !== void 0) return cached;
	}
	const css = hrefs.map((href) => styles[href]).join("");
	if (isProd) getInlineCssCache(manifest).set(cacheKey, css);
	return css;
}
function getInlineCssAssetForMatches(manifest, matches) {
	if (!manifest?.inlineCss) return void 0;
	const css = getInlineCssForHrefs(manifest, getInlineCssHrefsForMatches(manifest, matches));
	return css === void 0 ? void 0 : createInlineCssStyleAsset(css);
}
function stripInlinedStylesheetAssets(manifest, routes, matches) {
	if (!manifest.inlineCss) return routes;
	const nextRoutes = {};
	for (const [routeId, route] of Object.entries(routes)) {
		const assets = route.assets?.filter((asset) => !isInlinableStylesheet(manifest, asset));
		const nextRoute = { ...route };
		if (assets) if (assets.length > 0) nextRoute.assets = assets;
		else delete nextRoute.assets;
		nextRoutes[routeId] = nextRoute;
	}
	if (getInlineCssAssetForMatches(manifest, matches)) {
		const rootRoute = nextRoutes["__root__"] ?? {};
		nextRoutes[rootRouteId] = {
			...rootRoute,
			assets: [createInlineCssPlaceholderAsset(), ...rootRoute.assets ?? []]
		};
	}
	return nextRoutes;
}
function attachRouterServerSsrUtils({ router, manifest, getRequestAssets, includeUnmatchedRouteAssets = true }) {
	router.ssr = { get manifest() {
		const requestAssets = getRequestAssets?.();
		const inlineCssAsset = getInlineCssAssetForMatches(manifest, router.stores.matches.get());
		if (!requestAssets?.length && !inlineCssAsset) return manifest;
		return {
			...manifest,
			routes: {
				...manifest?.routes,
				[rootRouteId]: {
					...manifest?.routes?.[rootRouteId],
					assets: [
						...requestAssets ?? [],
						...inlineCssAsset ? [inlineCssAsset] : [],
						...manifest?.routes?.["__root__"]?.assets ?? []
					]
				}
			}
		};
	} };
	let _dehydrated = false;
	let _serializationFinished = false;
	const renderFinishedListeners = [];
	const serializationFinishedListeners = [];
	const scriptBuffer = new ScriptBuffer(router);
	let injectedHtmlBuffer = "";
	router.serverSsr = {
		injectHtml: (html) => {
			if (!html) return;
			injectedHtmlBuffer += html;
			router.emit({ type: "onInjectedHtml" });
		},
		injectScript: (script) => {
			if (!script) return;
			const html = `<script${router.options.ssr?.nonce ? ` nonce='${router.options.ssr.nonce}'` : ""}>${script}<\/script>`;
			router.serverSsr.injectHtml(html);
		},
		dehydrate: async (opts) => {
			if (_dehydrated) invariant();
			let matchesToDehydrate = router.stores.matches.get();
			if (router.isShell()) matchesToDehydrate = matchesToDehydrate.slice(0, 1);
			const matches = matchesToDehydrate.map(dehydrateMatch);
			let manifestToDehydrate = void 0;
			if (manifest) {
				const currentRouteIdsList = matchesToDehydrate.map((m) => m.routeId);
				const manifestCacheKey = `${currentRouteIdsList.join("\0")}\0includeUnmatchedRouteAssets=${includeUnmatchedRouteAssets}`;
				let filteredRoutes;
				if (isProd) filteredRoutes = getManifestCache(manifest).get(manifestCacheKey);
				if (!filteredRoutes) {
					const currentRouteIds = new Set(currentRouteIdsList);
					const nextFilteredRoutes = {};
					for (const routeId in manifest.routes) {
						const routeManifest = manifest.routes[routeId];
						if (currentRouteIds.has(routeId)) nextFilteredRoutes[routeId] = routeManifest;
						else if (includeUnmatchedRouteAssets && routeManifest.assets && routeManifest.assets.length > 0) nextFilteredRoutes[routeId] = { assets: routeManifest.assets };
					}
					filteredRoutes = stripInlinedStylesheetAssets(manifest, nextFilteredRoutes, matchesToDehydrate);
					if (isProd) getManifestCache(manifest).set(manifestCacheKey, filteredRoutes);
				}
				manifestToDehydrate = { routes: { ...filteredRoutes } };
				if (opts?.requestAssets?.length) {
					const existingRoot = manifestToDehydrate.routes[rootRouteId];
					manifestToDehydrate.routes[rootRouteId] = {
						...existingRoot,
						assets: [...opts.requestAssets, ...existingRoot?.assets ?? []]
					};
				}
			}
			const dehydratedRouter = {
				manifest: manifestToDehydrate,
				matches
			};
			const lastMatchId = matchesToDehydrate[matchesToDehydrate.length - 1]?.id;
			if (lastMatchId) dehydratedRouter.lastMatchId = dehydrateSsrMatchId(lastMatchId);
			const dehydratedData = await router.options.dehydrate?.();
			if (dehydratedData) dehydratedRouter.dehydratedData = dehydratedData;
			_dehydrated = true;
			const trackPlugins = { didRun: false };
			const serializationAdapters = router.options.serializationAdapters;
			const plugins = serializationAdapters ? serializationAdapters.map((t) => /* @__PURE__ */ makeSsrSerovalPlugin(t, trackPlugins)).concat(defaultSerovalPlugins) : defaultSerovalPlugins;
			const signalSerializationComplete = () => {
				_serializationFinished = true;
				try {
					serializationFinishedListeners.forEach((l) => l());
					router.emit({ type: "onSerializationFinished" });
				} catch (err) {
					console.error("Serialization listener error:", err);
				} finally {
					serializationFinishedListeners.length = 0;
					renderFinishedListeners.length = 0;
				}
			};
			cn(dehydratedRouter, {
				refs: /* @__PURE__ */ new Map(),
				plugins,
				onSerialize: (data, initial) => {
					let serialized = initial ? TSR_PREFIX + data : data;
					if (trackPlugins.didRun) serialized = P_PREFIX + serialized + P_SUFFIX;
					scriptBuffer.enqueue(serialized);
				},
				onError: (err) => {
					console.error("Serialization error:", err);
					if (err && err.stack) console.error(err.stack);
					signalSerializationComplete();
				},
				scopeId: SCOPE_ID,
				onDone: () => {
					scriptBuffer.enqueue(GLOBAL_TSR + ".e()");
					scriptBuffer.flush();
					signalSerializationComplete();
				}
			});
		},
		isDehydrated() {
			return _dehydrated;
		},
		isSerializationFinished() {
			return _serializationFinished;
		},
		onRenderFinished: (listener) => renderFinishedListeners.push(listener),
		onSerializationFinished: (listener) => serializationFinishedListeners.push(listener),
		setRenderFinished: () => {
			try {
				renderFinishedListeners.forEach((l) => l());
			} catch (err) {
				console.error("Error in render finished listener:", err);
			} finally {
				renderFinishedListeners.length = 0;
			}
			scriptBuffer.liftBarrier();
		},
		takeBufferedScripts() {
			const scripts = scriptBuffer.takeAll();
			return {
				tag: "script",
				attrs: {
					nonce: router.options.ssr?.nonce,
					className: "$tsr",
					id: TSR_SCRIPT_BARRIER_ID
				},
				children: scripts
			};
		},
		liftScriptBarrier() {
			scriptBuffer.liftBarrier();
		},
		takeBufferedHtml() {
			if (!injectedHtmlBuffer) return;
			const buffered = injectedHtmlBuffer;
			injectedHtmlBuffer = "";
			return buffered;
		},
		cleanup() {
			if (!router.serverSsr) return;
			renderFinishedListeners.length = 0;
			serializationFinishedListeners.length = 0;
			injectedHtmlBuffer = "";
			scriptBuffer.cleanup();
			router.serverSsr = void 0;
		}
	};
}
/**
* Get the origin for the request.
*
* SECURITY: We intentionally do NOT trust the Origin header for determining
* the router's origin. The Origin header can be spoofed by attackers, which
* could lead to SSRF-like vulnerabilities where redirects are constructed
* using a malicious origin (CVE-2024-34351).
*
* Instead, we derive the origin from request.url, which is typically set by
* the server infrastructure (not client-controlled headers).
*
* For applications behind proxies that need to trust forwarded headers,
* use the router's `origin` option to explicitly configure a trusted origin.
*/
function getOrigin(request) {
	try {
		return new URL(request.url).origin;
	} catch {}
	return "http://localhost";
}
function getNormalizedURL(url, base) {
	if (typeof url === "string") url = url.replace("\\", "%5C");
	const rawUrl = new URL(url, base);
	const { path: decodedPathname, handledProtocolRelativeURL } = decodePath(rawUrl.pathname);
	const searchParams = new URLSearchParams(rawUrl.search);
	const normalizedHref = decodedPathname + (searchParams.size > 0 ? "?" : "") + searchParams.toString() + rawUrl.hash;
	return {
		url: new URL(normalizedHref, rawUrl.origin),
		handledProtocolRelativeURL
	};
}
//#endregion
//#region node_modules/cookie-es/dist/index.mjs
function splitSetCookieString(cookiesString) {
	if (Array.isArray(cookiesString)) return cookiesString.flatMap((c) => splitSetCookieString(c));
	if (typeof cookiesString !== "string") return [];
	const cookiesStrings = [];
	let pos = 0;
	let start;
	let ch;
	let lastComma;
	let nextStart;
	let cookiesSeparatorFound;
	const skipWhitespace = () => {
		while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
		return pos < cookiesString.length;
	};
	const notSpecialChar = () => {
		ch = cookiesString.charAt(pos);
		return ch !== "=" && ch !== ";" && ch !== ",";
	};
	while (pos < cookiesString.length) {
		start = pos;
		cookiesSeparatorFound = false;
		while (skipWhitespace()) {
			ch = cookiesString.charAt(pos);
			if (ch === ",") {
				lastComma = pos;
				pos += 1;
				skipWhitespace();
				nextStart = pos;
				while (pos < cookiesString.length && notSpecialChar()) pos += 1;
				if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
					cookiesSeparatorFound = true;
					pos = nextStart;
					cookiesStrings.push(cookiesString.slice(start, lastComma));
					start = pos;
				} else pos = lastComma + 1;
			} else pos += 1;
		}
		if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.slice(start));
	}
	return cookiesStrings;
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/headers.js
function toHeadersInstance(init) {
	if (init instanceof Headers) return init;
	else if (Array.isArray(init)) return new Headers(init);
	else if (typeof init === "object") return new Headers(init);
	else return null;
}
function mergeHeaders(...headers) {
	return headers.reduce((acc, header) => {
		const headersInstance = toHeadersInstance(header);
		if (!headersInstance) return acc;
		for (const [key, value] of headersInstance.entries()) if (key === "set-cookie") splitSetCookieString(value).forEach((cookie) => acc.append("set-cookie", cookie));
		else acc.set(key, value);
		return acc;
	}, new Headers());
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/ssr/handlerCallback.js
function defineHandlerCallback(handler) {
	return handler;
}
//#endregion
export { getOrigin as a, createSerializationAdapter as c, au as d, ou as f, getNormalizedURL as i, makeSerovalPlugin as l, mergeHeaders as n, defaultSerovalPlugins as o, attachRouterServerSsrUtils as r, createRawStreamRPCPlugin as s, defineHandlerCallback as t, Iu as u };
