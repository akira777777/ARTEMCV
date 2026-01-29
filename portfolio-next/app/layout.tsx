import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const pjs = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ArtemCV | Full Stack Developer",
  description: "Full Stack Developer Portfolio - React, Next.js, Motion, AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pjs.variable} font-sans antialiased bg-[#0a0a0a] text-white selection:bg-purple-500/30`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
