import { LayoutDashboard, LucideIcon, Settings2, Users2 } from "lucide-react";
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
        path: "/dashboard/[workspace]",
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
        path: "/settings/[workspace]",
        icon: Settings2,
        role: "owner",
        submenu: [],
      },
    ],
  },
];

export const getAppRouteIsActive = (pathname: string, path: string) => {
  if (!path) return false;

  // ตัด dynamic segment ออก เช่น /dashboard/[workspace]
  const dynamicMatch = path.match(/^(\/dashboard\/)\[([^\]]+)\](.*)$/);
  if (dynamicMatch) {
    // ส่วนหลัง dynamic เช่น /member, /team
    let afterDynamic = dynamicMatch[3] || "";
    // ให้แน่ใจว่ามี / นำหน้า
    if (afterDynamic && !afterDynamic.startsWith("/")) afterDynamic = "/" + afterDynamic;
    // ตัด /dashboard/xxx ออกจาก pathname
    const afterProject = pathname.replace(/^\/dashboard\/[^/]+/, "");
    // เทียบเฉพาะส่วนหลัง dynamic
    return (
      afterProject === afterDynamic ||
      afterProject.startsWith(afterDynamic + "/")
    );
  }

  // Static paths: exact match or nested paths count as active
  const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
  const normPathname = normalize(pathname);
  const normPath = normalize(path);
  return normPathname === normPath || normPathname.startsWith(`${normPath}/`);
};

const appRoutesSchema = z.array(approuter);
appRoutesSchema.parse(APP_ROUTE);
