import {
    Activity,
    ChartNoAxesCombinedIcon,
    File,
    Folder,
    LayoutDashboard,
    LucideIcon,
    PlusCircle,
    Store,
    Users2Icon,
    WorkflowIcon,
} from "lucide-react";

type IconType = {
  name: string;
  icon: LucideIcon;
  value: string;
};
export const iconList: IconType[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    value: "Dashboard",
  },
  {
    name: "Activity",
    icon: Activity,
    value: "Activity",
  },
  {
    name: "File",
    icon: File,
    value: "File",
  },
  {
    name: "Folder",
    icon: Folder,
    value: "Folder",
  },
  {
    name: "PlusCircle",
    icon: PlusCircle,
    value: "PlusCircle",
  },
  {
    name: "WorkflowIcon",
    icon: WorkflowIcon,
    value: "WorkflowIcon",
  },
  {
    name: "Analytics",
    icon: ChartNoAxesCombinedIcon,
    value: "ChartNoAxesCombinedIcon",
  },
  {
    name: "Person",
    icon: Users2Icon,
    value: "Users2Icon",
  },
  {
    name: "ShopStore",
    icon: Store,
    value: "Store",
  },
];
