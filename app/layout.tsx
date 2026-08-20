import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "StudyMatch — Get matched with a peer tutor",
  description:
    "Upload your stuck homework or describe it, and get classified + matched with the right kind of peer tutor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
