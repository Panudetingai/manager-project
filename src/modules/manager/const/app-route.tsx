import { CreditCard, LayoutDashboard, LucideIcon, Settings2, Users2 } from "lucide-react";
import z from "zod";
import pathsConfig from "../../../../config/app.router";

const approuter = z.object({
  labelgroup: z.string(),
  items: z.array(
    z.object({
      label: z.string(),
      path: z.string(),
      icon: z.custom<LucideIcon>(),
      role: z.enum(["user", "admin", "owner", "guest"]),
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
    items: [
      {
        label: "Overview",
        path: pathsConfig.app.workspaceDashboard,
        icon: LayoutDashboard,
        role: "user",
        submenu: [],
      },
      {
        label: "Members",
        path: "",
        icon: Users2,
        role: "owner",
        submenu: [
          {
            label: "Team Members",
            path: pathsConfig.app.workspaceMembers,
            icon: Users2,
          },
        ],
      },
      {
        label: "Settings",
        path: pathsConfig.app.workspaceSettingsGeneral,
        icon: Settings2,
        role: "owner",
        submenu: [],
      },
      {
        label: "Billing",
        path: pathsConfig.app.workspaceBilling,
        icon: CreditCard,
        role: "owner",
        submenu: [],
      }
    ],
  },
  {
    labelgroup: "Management",
    items: [
      {
        label: "Personal Settings",
        path: pathsConfig.app.workspaceSettingsGeneral,
        icon: Settings2,
        role: "owner",
        submenu: [],
      }
    ],
  }
];
const appRoutesSchema = z.array(approuter);
appRoutesSchema.parse(APP_ROUTE);
