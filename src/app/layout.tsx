import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import { AppLayout } from "@/components/layout/app-layout";
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
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {/* Bungkus children dengan AppLayout */}
          <AppLayout>
            {children}
          </AppLayout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}