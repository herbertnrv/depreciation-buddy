import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { pathname } = useLocation();
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname.startsWith(to)
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Fixed Asset Register</h1>
            <p className="text-xs text-muted-foreground">
              Monthly straight-line depreciation · automatic year-end rollover
            </p>
          </div>
          <nav className="flex gap-2">
            {link("/schedule", "Depreciation Schedule")}
            {link("/assets", "Assets")}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
