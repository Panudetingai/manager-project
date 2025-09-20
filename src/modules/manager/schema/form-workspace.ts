import z from "zod";

export const FormWorkspaceSchema = z.object({
    workspacename: z.string().min(2).max(50),
    icon: z.string(),
})

export type FormWorkspaceType = z.infer<typeof FormWorkspaceSchema>