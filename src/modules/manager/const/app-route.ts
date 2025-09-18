import { Archive, LayoutDashboard, LucideIcon, Wrench } from "lucide-react";

type AppRoute = {
    label: string;
    path: string;
    icon: LucideIcon;
    role: | 'user' | 'admin' | 'owner' | 'guest';
    submenu?: AppRoute[];
}
export const APP_ROUTE: AppRoute[] = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        role: 'user',
        submenu: []
    },
    {
        label: 'Manage Tools',
        path: '/manage-tools',
        icon: Wrench,
        role: 'user',
        submenu: []
    },
    {
        label: 'Index',
        path: '/index',
        icon: Archive,
        role: 'user',
        submenu: []
    }
]