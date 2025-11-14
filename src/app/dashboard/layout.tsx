import { SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";
import { SocketProvider } from "@/lib/providers/socket-provider";
import { getUserRoleServer, getUserServer } from "@/lib/supabase/getUser-server";
import AppHeader from "@/modules/manager/components/app-header";
import { AppSidebar } from "@/modules/manager/components/app-sidebar";

export default async function LayoutDashboardProject({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getUserRoleServer();
  const user = await getUserServer();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return (
    <SidebarProvider>
      <AppSidebar role={userRole || "guest"} />
      <main className="w-full rounded-sm">
        <SocketProvider userId={user.id}>
          <AppHeader />
          <div className="p-4 relative">{children}</div>
        </SocketProvider>
      </main>
    </SidebarProvider>
  );
}
