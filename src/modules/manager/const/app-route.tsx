import { CirclePlus, CreditCard, LayoutDashboard, LucideIcon, Settings2, Users2, UsersRound } from "lucide-react";
import z from "zod";
import pathsConfig from "../../../../config/app.router";
import { Database } from "../../../../utils/supabase/database.types";


type Role = Database["public"]["Enums"]["user_roles"];

const approuter = z.object({
  labelgroup: z.string(),
  role: z.array(z.custom<Role>()).min(1),
  items: z.array(
    z.object({
      label: z.string(),
      path: z.string(),
      icon: z.custom<LucideIcon>(),
      role: z.array(z.custom<Role>()).min(1),
      submenu: z
        .array(
          z.object({
            label: z.string(),
            path: z.string(),
            icon: z.custom<LucideIcon>(),
          })
        )
        .optional(),
    })
  ),
});

type AppRoute = z.infer<typeof approuter>;

export const APP_ROUTE: AppRoute[] = [
  {
    labelgroup: "Application",
    role: ["user", "owner", "admin"],
    items: [
      {
        label: "Overview",
        path: pathsConfig.app.workspaceDashboard,
        icon: LayoutDashboard,
        role: ["user", "owner", "admin"],
        submenu: [],
      },
      {
        label: "Members",
        path: "",
        icon: Users2,
        role: ["owner", "admin"],
        submenu: [
          {
            label: "Team Members",
            path: pathsConfig.app.workspaceMembers,
            icon: Users2,
          },
          {
            label: "Invitations",
            path: pathsConfig.app.workspaceMembersInvitations,
            icon: CirclePlus,
          },
          {
            label: "Groups",
            path: pathsConfig.app.workspaceMembersGroups,
            icon: UsersRound,
          }
        ],
      },
      {
        label: "Settings",
        path: pathsConfig.app.workspaceSettingsGeneral,
        icon: Settings2,
        role: ["user", "owner", "admin"],
        submenu: [],
      },
      {
        label: "Billing",
        path: pathsConfig.app.workspaceBilling,
        icon: CreditCard,
        role: ["user", "owner", "admin"],
        submenu: [],
      }
    ],
  },
  {
    labelgroup: "Create New",
    role: ["owner"],
    items: [
      {
        label: "New Project",
        path: "dashboard",
        icon: LayoutDashboard,
        role: ["owner"],
      }
    ]
  },
  {
    labelgroup: "Management",
    role: ["owner", "admin"],
    items: [
      {
        label: "Personal Settings",
        path: pathsConfig.app.workspaceSettingsGeneral,
        icon: Settings2,
        role: ["owner", "admin"],
        submenu: [],
      }
    ],
  }
];
const appRoutesSchema = z.array(approuter);
appRoutesSchema.parse(APP_ROUTE);
