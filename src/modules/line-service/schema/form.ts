import z from "zod";

export const FormSetup = z.object({
    channelId: z.string().min(1, {message: "Channel ID is required"}).max(32, {message: "Channel ID is Too long"}),
    channelSecret: z.string().min(1, {message: "Channel Secret is required"}).max(64, {message: "Channel Secret is Too long"}),
})

export type FormSetupType = z.infer<typeof FormSetup>;