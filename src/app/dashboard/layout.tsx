import { SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";
import { getUserRoleServer } from "@/lib/supabase/getUser-server";
import AppHeader from "@/modules/manager/components/app-header";
import { AppSidebar } from "@/modules/manager/components/app-sidebar";

export default async function LayoutDashboardProject({
  children,
}: {
  children: React.ReactNode;
}) {

  const userRole = await getUserRoleServer();

  return (
      <SidebarProvider>
        <AppSidebar role={userRole || "guest"} />
        <main className="w-full rounded-sm">
          <AppHeader />
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
  );
}
