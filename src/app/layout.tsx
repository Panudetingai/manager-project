import { Toaster } from "@/components/ui/sonner";
import { generateRootMetadata } from "@/lib/meta-data";
import { default as ClientSSR, default as QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";

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
