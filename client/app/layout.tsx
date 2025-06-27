import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Toaster } from "react-hot-toast";
import { CallIncomingNotification } from "@/components/shared/call-incoming-notification";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Real-time chat application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
        <CallIncomingNotification />
      </body>
    </html>
  );
}
