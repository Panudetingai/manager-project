import { z } from "zod";

const production = process.env.NODE_ENV === "production";

const AppConfigSchema = z
  .object({
    name: z
      .string({
        error: `Please provide the variable NEXT_PUBLIC_PRODUCT_NAME`,
      })
      .min(1)
      .describe(`This is the name of your SaaS. Ex. "Premadekit"`),
    title: z
      .string({
        error: `Please provide the variable NEXT_PUBLIC_APP_TITLE`,
      })
      .min(1)
      .describe(`This is the default title tag of your SaaS.`),
    description: z.string({
      error: `Please provide the variable NEXT_PUBLIC_APP_DESCRIPTION`,
    }).describe(`This is the default description of your SaaS.`),
    url: z
      .string({
        error: `Please provide the variable NEXT_PUBLIC_APP_URL`,
      })
      .url({
        message: `You are deploying a production build but have entered a NEXT_PUBLIC_APP_URL variable using http instead of https. It is very likely that you have set the incorrect URL. The build will now fail to prevent you from from deploying a faulty configuration. Please provide the variable NEXT_PUBLIC_APP_URL with a valid URL, such as: 'https://example.com'`,
      }),
    production: z.boolean(),
  })
  .refine(
    (schema) => {
      const isCI = process.env.NEXT_PUBLIC_CI;

      if (isCI ?? !schema.production) {
        return true;
      }

      return !schema.url.startsWith("http:");
    },
    {
      message: `Please provide a valid HTTPS URL. Set the variable NEXT_PUBLIC_APP_URL with a valid URL, such as: 'https://example.com'`,
      path: ["url"],
    }
  );

const appConfig = AppConfigSchema.parse({
  name: "ManageKit",
  title: "ManageKit - SaaS Starter Template",
  description:
    "A modern SaaS starter template built with Next.js, Supabase, and Stripe.",
  url: process.env.NEXT_PUBLIC_APP_URL,
  production,
});

export default appConfig;