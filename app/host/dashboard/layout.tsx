import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";

export default function HostDashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto space-y-6 py-6 pb-12 h-full">
      <DashboardBreadcrumb displayRootLevel="host" />
      {children}
    </main>
  );
}
