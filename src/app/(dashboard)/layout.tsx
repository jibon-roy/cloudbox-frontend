import Sidebar from "@/src/components/pages/dashboardLayout/sidebar";
import TopNav from "@/src/components/pages/dashboardLayout/top-nav";
import DashboardAccessGate from "@/src/components/pages/dashboardLayout/DashboardAccessGate";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAccessGate>
      <div className="flex h-screen overflow-hidden bg-app-bg text-app-text">
        <Sidebar />
        <div className="flex min-w-0 w-full flex-1 flex-col overflow-hidden lg:pl-0">
          <header className="h-16 shrink-0 overflow-hidden border-b border-border-subtle bg-surface/90 backdrop-blur">
            <TopNav />
          </header>
          <main className="min-h-0 flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </DashboardAccessGate>
  );
}
