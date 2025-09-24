import { SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";
import AppHeader from "@/modules/manager/components/app-header";
import { AppSidebar } from "@/modules/manager/components/app-sidebar";

export default function LayoutDashboardProject({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full rounded-sm">
          <AppHeader />
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
  );
}
