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
    workspaceDashboard: z.string().min(1),
    workspaceMembers: z.string().min(1),
    workspaceSettingsGeneral: z.string().min(1),
    workspaceMembersInvitations: z.string().min(1),
    workspaceMembersGroups: z.string().min(1),
    workspaceBilling: z.string().min(1),
    workspaceBillingReturn: z.string().min(1),
    onboarding: z.string().min(1),
    join: z.string().min(1)
  }),
  feature: z.object({
    aichat: z.string().min(1),
  }),
  join: z.object({
    menubarjoin: z.string().min(1),
  }),
  setting: z.object({
    workspaceSettingsSocialAccountsInstagram: z.string().min(1),
    workspaceSettingsSocialAccountsFacebook: z.string().min(1),
    workspaceSettingsSocialAccountsLineAPI: z.string().min(1),
  })
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
    workspaceDashboard: "/dashboard/[workspace]",
    workspaceMembers: "/dashboard/[workspace]/members",
    workspaceMembersInvitations: "/dashboard/[workspace]/members/invitations",
    workspaceMembersGroups: "/dashboard/[workspace]/members/groups",
    workspaceSettingsGeneral: "/dashboard/[workspace]/settings",
    workspaceBilling: "/dashboard/[workspace]/billing",
    workspaceBillingReturn: "/dashboard/[workspace]/billing/return",
    onboarding: "/onboarding",
    join: "/join",
  },
  join: {
    menubarjoin: "/dashboard/join/[workspace]",
  },
  feature: {
    aichat: "/dashboard/[workspace]/ai-chat",
  },
  setting: {
    workspaceSettingsSocialAccountsLineAPI: "/dashboard/[workspace]/settings/social-accounts/line",
    workspaceSettingsSocialAccountsFacebook: "/dashboard/[workspace]/settings/social-accounts/facebook",
    workspaceSettingsSocialAccountsInstagram: "/dashboard/[workspace]/settings/social-accounts/instagram",
  }
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;