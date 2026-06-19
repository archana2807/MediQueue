import type { Metadata } from "next";
import { Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/providers/query-provider";
import { CartProvider } from "@/providers/cart-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ExamVerse - #1 E-Book Platform for Competitive Exams",
  description:
    "Quality e-books for UPSC, SSC, Banking, Railway, JEE, NEET, CAT & GATE preparation. Learn from the best authors and crack your dream exam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider delayDuration={0}>
          <QueryProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </QueryProvider>
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          closeButton
          richColors
          duration={3000}
          toastOptions={{
            className: "!bg-white !border !border-[#e8e8e8] !shadow-xl !rounded-xl !font-sans",
            style: {
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
