import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider"; // <--- Import Provider Baru
import { AppLayout } from "@/components/layout/app-layout";
import NextTopLoader from "nextjs-toploader";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZooKeeper Core",
  description: "Zoo Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader color="#059669" showSpinner={false} height={4} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Bungkus children dengan AppLayout */}
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
