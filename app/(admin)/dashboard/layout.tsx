import { AdminThemeProvider } from "@/components/admin-theme-provider";
import DashboardShell from "./dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
        <link rel="admin-manifest" href="/admin-manifest.json" />
        <meta name="theme-color" content="#1e293b" />
      <DashboardShell>{children}</DashboardShell>
    </AdminThemeProvider>
  );
}