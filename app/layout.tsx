import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DataInitializer from "@/components/DataInitializer";

export const metadata: Metadata = {
  title: "CivicCare — Public Issue Reporting System",
  description:
    "Report and track public infrastructure issues in your community. CivicCare helps citizens connect local problems with the people who can fix them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <DataInitializer />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
