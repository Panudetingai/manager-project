import z from "zod";

export const onboardSchema = z.object({
  name: z.string().min(6, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(6, "Email must be at least 2 characters")
    .email("Invalid email address"),
  social: z.string().optional(),
  workspaceName: z
    .string()
    .min(3, "Workspace Name must be at least 3 characters"),
  companyDomain: z.string().optional(),
  teamSize: z.string().optional(),
  role: z.string().min(2, "Role must be at least 2 characters"),
  preferredLanguage: z
    .string()
    .min(2, "Preferred Language must be at least 2 characters"),
  primaryUseCase: z
    .string()
    .min(5, "Primary Use Case must be at least 5 characters"),
});

export type descriptiontype = z.infer<typeof onboardSchema>;