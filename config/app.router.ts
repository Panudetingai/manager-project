import { z } from "zod";

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.string().min(1),
    signUp: z.string().min(1),
    verifyMfa: z.string().min(1),
    callback: z.string().min(1),
    passwordReset: z.string().min(1),
    passwordUpdate: z.string().min(1),
  }),
  app: z.object({
    dashboard: z.string().min(1),
    personalSettingsProfile: z.string().min(1),
    personalSettingsSecurity: z.string().min(1),
    personalBilling: z.string().min(1),
    personalBillingReturn: z.string().min(1),
    teamDashboard: z.string().min(1),
    teamMembers: z.string().min(1),
    teamSettingsGeneral: z.string().min(1),
    teamBilling: z.string().min(1),
    teamBillingReturn: z.string().min(1),
    join: z.string().min(1)
  }),
});

const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    verifyMfa: "/auth/verify",
    callback: "/auth/callback",
    passwordReset: "/auth/password-reset",
    passwordUpdate: "/update-password",
  },
  app: {
    dashboard: "/dashboard",
    personalSettingsProfile: "/dashboard/settings/profile",
    personalSettingsSecurity: "/dashboard/settings/security",
    personalBilling: "/dashboard/billing",
    personalBillingReturn: "/dashboard/billing/return",
    teamDashboard: "/dashboard/[team]",
    teamMembers: "/dashboard/[team]/members",
    teamSettingsGeneral: "/dashboard/[team]/settings/general",
    teamBilling: "/dashboard/[team]/billing",
    teamBillingReturn: "/dashboard/[team]/billing/return",
    join: "/join",
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;