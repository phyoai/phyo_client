import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import AuthCookieSyncer from "@/components/AuthCookieSyncer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Phyo Ai - Influencer Marketing Platform",
  description: "Connect with top influencers and run successful marketing campaigns on Phyo Ai",
  keywords: "influencer marketing, campaigns, brand collaboration, social media",
  authors: [{ name: "Phyo Team" }],
  ogImage: "https://phyo.ai/og-image.png",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ReduxProvider>
          <AuthCookieSyncer />
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <SocketProvider>
                  {children}
                </SocketProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

// Note: New dynamic route for influencer search results at /influencer-search-results/[query]
