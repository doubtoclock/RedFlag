import type { Metadata } from "next";
import { Inter, Outfit, Alex_Brush } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

const juana = localFont({
  src: [
    {
      path: "../../public/font/Fontspring-DEMO-juana-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-regularit.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-mediumit.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-semiboldit.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/Fontspring-DEMO-juana-boldit.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-juana",
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
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${juana.variable} ${alexBrush.variable} font-sans`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
