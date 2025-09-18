import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/manager/components/app-sidebar";

export default function LayoutDashboardProject({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className="m-6 w-full p-6 rounded-sm">
            {children}
        </main>
    </SidebarProvider>
  );
}
