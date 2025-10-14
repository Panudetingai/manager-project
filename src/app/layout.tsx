import { generateRootMetadata } from "@/lib/meta-data";
import ClientSSR from "@/lib/providers/clinet-ssr";
import QueryProvider from "@/lib/providers/query-provider";
import { Toaster } from "sonner";
import Appnotifyupdate from "./app-notify-update";
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
        <Toaster position="top-right" />
        <Appnotifyupdate />
      </body>
    </html>
  );
}

export const generateMetadata = generateRootMetadata;
