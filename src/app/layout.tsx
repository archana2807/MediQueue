import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatWidget from "@/components/chat/chat-widget";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediQueue",
  description: "%s | MediQueue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider delayDuration={0}>
        <AuthProvider>
                  

            {children}
            <ChatWidget />
  </AuthProvider>

  <Toaster
    position="top-right"
    closeButton
    theme="light"
  />
        </TooltipProvider>

      </body>
    </html>
  );
}