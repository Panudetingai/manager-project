import { Metadata } from "next";

import { headers } from "next/headers";
import appConfig from "../../config/app.config";


/**
 * @name generateRootMetadata
 * @description Generates the root metadata for the application
 */
export const generateRootMetadata = async (): Promise<Metadata> => {
  const headersStore = await headers();
  const csrfToken = headersStore.get("x-csrf-token") ?? "";

  return {
    title: appConfig.title,
    description: appConfig.description,
    metadataBase: new URL(appConfig.url),
    applicationName: appConfig.name,
    keywords: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Server Components",
      "SaaS",
      "Supabase",
      "Stripe",
    ],
    other: {
      "csrf-token": csrfToken,
    },
    openGraph: {
      url: appConfig.url,
      siteName: appConfig.name,
      title: appConfig.title,
      description: appConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title: appConfig.title,
      description: appConfig.description,
    },
    icons: {
      icon: {
        url: "/images/favicon/favicon.ico",
      },
    },
  };
};