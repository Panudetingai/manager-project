import { Toaster } from "@/components/ui/sonner";
import { generateRootMetadata } from "@/lib/meta-data";
import QueryProvider from "@/lib/providers/query-provider";
// @ts-expect-error: CSS import without typings
import "./globals.css";
import ClientSSR from "@/lib/providers/clinet-ssr";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProvider>
          <ClientSSR>{children}</ClientSSR>
        </QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

export const generateMetadata = generateRootMetadata;
