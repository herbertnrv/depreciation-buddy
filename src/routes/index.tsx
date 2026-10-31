import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head:()=>({meta:[{title:'GastronoAssets | Offline register'},{name:'description',content:'Offline fixed asset register for hotel and gastronomy.'},{property:'og:title',content:'GastronoAssets | Offline register'},{property:'og:description',content:'Asset management and monthly depreciation.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  beforeLoad: () => {
    throw redirect({ to: "/schedule", search: { year: new Date().getFullYear() } });
  },
  component: () => <Outlet />,
});
