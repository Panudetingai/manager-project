import { Toaster } from "@/components/ui/sonner";
import { generateRootMetadata } from "@/lib/meta-data";
import { default as ClientSSR, default as QueryProvider } from "@/lib/providers/query-provider";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <QueryProvider>
          <ClientSSR>{children}</ClientSSR>
        </QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

export const generateMetadata = generateRootMetadata;
