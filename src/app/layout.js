import { Geist, Geist_Mono, Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import { RoleProvider } from "./context/RoleContext";
import ErrorBoundary from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Phyo Ai",
  description: "Influencer Marketing Platform",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Phyo Ai",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <ReduxProvider>
            <RoleProvider>
              <ThemeProvider>
                <LanguageProvider>
                  <AuthProvider>
                    {children}
                  </AuthProvider>
                </LanguageProvider>
              </ThemeProvider>
            </RoleProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Note: New dynamic route for influencer search results at /influencer-search-results/[query]
