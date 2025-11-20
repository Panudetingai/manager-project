import { generateRootMetadata } from "@/lib/meta-data";
import ClientSSR from "@/lib/providers/clinet-ssr";
import QueryProvider from "@/lib/providers/query-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "sonner";
import Appnotifyupdate from "./app-notify-update";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ClientSSR>{children}</ClientSSR>
          </QueryProvider>
          <Toaster position="top-right" />
          <Appnotifyupdate />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const generateMetadata = generateRootMetadata;
