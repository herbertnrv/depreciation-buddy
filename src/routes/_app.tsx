import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { SettingsProvider, useSettings } from '@/lib/settings-context';
import { useT } from '@/lib/i18n';
import { SettingsDialog } from '@/components/register/settings-dialog';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: () => <SettingsProvider><AppLayout/></SettingsProvider>,
});

function AppLayout() {
  const { pathname } = useLocation();
  const {settings,update}=useSettings(); const t=useT();
  useEffect(()=>{document.documentElement.lang=settings.language.toLowerCase();},[settings.language]);
  const overdue=!settings.lastManualBackup || Date.now()-Date.parse(settings.lastManualBackup)>7*86400000;
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname.startsWith(to)
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent"
      }`}
    >
      {t(label)}
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">GastronoAssets</h1>
            <p className="text-xs text-muted-foreground">
              Hotel & Gastro Service · Offline Fixed Asset Register
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {link("/schedule", "Depreciation Schedule")}
            {link("/assets", "Assets")}
            <SettingsDialog/>
            <Button variant="outline" size="sm" aria-label="Language EN/DE" onClick={async()=>{await update({...settings,language:settings.language==='EN'?'DE':'EN'});}}>{settings.language} / {settings.language==='EN'?'DE':'EN'}</Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-6 py-6">
        {overdue&&<p className="text-sm border-l-2 border-destructive pl-3 mb-4 text-muted-foreground">{t('Manual backup overdue')} — {t('Download a manual backup at least every 7 days.')}</p>}
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
