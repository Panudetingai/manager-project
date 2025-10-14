import {
  LayoutDashboard,
  LucideIcon,
  Settings,
  Users,
  Workflow
} from "lucide-react";

type SidebarItem = {
  labelGroup: string;
  items: {
    label: string;
    icon: LucideIcon;
    subItems?: {
      label: string;
      icon: LucideIcon;
      onclick?: () => void;
    }[];
    onclick?: () => void;
  }[];
};

export const AppSidebarItems = () => {
  const sidebarItems: SidebarItem[] = [
    {
      labelGroup: "Application",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          onclick: () => {
            console.log("Dashboard clicked");
          },
        },
        {
          label: "Projects",
          icon: Users,
          onclick: () => {
            console.log("Projects clicked");
          },
        },
      ],
    },
  ];

  return sidebarItems;
};

type AccountSidebarItem = {
  labelGroup: string;
  items: {
    label: string;
    icon: LucideIcon;
    subItems?: {
      label: string;
      icon: LucideIcon;
      onclick?: () => void;
    }[];
    onclick?: () => void;
  }[];
};

export const AccountSidebarItems = () => {
  const sidebarItems: AccountSidebarItem[] = [
    {
      labelGroup: "Account",
      items: [
        {
          label: "Profile",
          icon: Users,
          onclick: () => {
            console.log("Profile clicked");
          },
        },
      ],
    },
    {
      labelGroup: "Settings",
      items: [
        {
          label: "Settings",
          icon: Settings,
          onclick: () => {
            console.log("Switch Workspace clicked");
          },
        },
        {
            label: "Workspace",
            icon: Workflow,
            onclick: () => {
                console.log("Setup Workspace clicked");
            },
        },
      ],
    },
  ];

  return sidebarItems;
};
