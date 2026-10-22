import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Hub | Industrial SCADA & Engineering Portal",
  description: "Centralized management of industrial automation projects, network architectures, remote access, software credentials, and release versions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
