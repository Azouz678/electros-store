import { AdminThemeProvider } from "@/components/admin-theme-provider";
import DashboardShell from "./dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </AdminThemeProvider>
  );
}