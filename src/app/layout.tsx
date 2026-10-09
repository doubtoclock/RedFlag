import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Alex_Brush } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppLinkRouter } from "@/components/AppLinkRouter";
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
  title: "Red Flag",
  description: "A relationship-scenario game for spotting red and green flags.",
  applicationName: "Red Flag",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Red Flag",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
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
        <AppLinkRouter />
        {children}
      </body>
    </html>
  );
}
