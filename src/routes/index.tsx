import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/schedule", search: { year: new Date().getFullYear() } });
  },
  component: () => <Outlet />,
});
