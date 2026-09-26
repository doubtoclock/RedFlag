import type { Metadata } from "next";
import { Inter, Outfit, Alex_Brush } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-alex-brush",
  subsets: ["latin"],
});

const sanggar = localFont({
  src: "../../public/font/sanggar/Sanggar.ttf",
  variable: "--font-sanggar",
});

export const metadata: Metadata = {
  title: "RedFlag | Premium AI Insights",
  description: "Discover actionable AI-powered insights with an elegant, responsive, and blazing fast interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${sanggar.variable} ${alexBrush.variable} font-sans`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
