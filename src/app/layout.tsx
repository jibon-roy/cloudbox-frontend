import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ReduxStoreProvider from "@/src/redux/ReduxStoreProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  // Basic Info
  title: {
    default: "CloudBox | Policy-Driven File Storage & Management Platform",
    template: "%s | CloudBox",
  },
  description:
    "CloudBox — Enterprise-grade file storage platform with policy-driven subscription controls. Manage files like Google Drive, enforce limits like SaaS. Real-time validation, admin dashboards, and multi-tier plans.",

  // Canonical & International URLs
  alternates: {
    canonical: "https://cloudbox.app",
    languages: {
      "en-US": "https://cloudbox.app/en",
    },
  },

  // Application Data
  applicationName: "CloudBox",
  generator: "Next.js 16",
  referrer: "origin-when-cross-origin",
  keywords: [
    "file storage",
    "cloud storage",
    "file management",
    "subscription tiers",
    "policy-driven storage",
    "enterprise file management",
    "SaaS storage",
    "policy enforcement",
    "folder management",
    "file hosting",
  ],
  authors: [{ name: "CloudBox Team", url: "https://cloudbox.app/about" }],
  creator: "CloudBox",
  publisher: "CloudBox",
  category: "File Management / Cloud Storage",
  classification: "SaaS Application",

  // Open Graph (for Facebook, LinkedIn, etc.)
  openGraph: {
    title: "CloudBox | Enterprise File Storage with Policy-Driven Controls",
    description:
      "Manage files with Google Drive-like simplicity, enforce business limits like enterprise SaaS. CloudBox brings policy-driven storage to your team.",
    url: "https://cloudbox.app",
    siteName: "CloudBox",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon/512x512.png",
        width: 1200,
        height: 630,
        alt: "CloudBox - File Management Platform",
      },
    ],
  },

  // Twitter Meta (for social sharing)
  twitter: {
    card: "summary_large_image",
    title: "CloudBox | Policy-Driven File Storage Platform",
    description:
      "Enterprise file management with subscription tiers, real-time policy validation, and admin dashboards. Control your data like never before.",
    creator: "@cloudbox_app",
    site: "@cloudbox_app",
    images: ["/icon/512x512.png"],
  },

  // Robots (for search engines)
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Viewport & Display
  // Manifest
  manifest: "/site.webmanifest",

  // Icons (all formats + Apple)
  icons: {
    icon: [
      { url: "/icon/192x192.png", sizes: "any" },
      { url: "/icon/192x192.png", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon/180x180.png", sizes: "180x180" },
      { url: "/icon/192x192.png", sizes: "192x192" },
    ],
    shortcut: ["/icon/192x192.png"],
  },

  // Apple Web App Config
  appleWebApp: {
    capable: true,
    title: "CloudBox",
    statusBarStyle: "black-translucent",
  },

  // Verification (for Search Console, Pinterest, etc.)
  verification: {
    google: "CLOUDBOX_GOOGLE_VERIFICATION",
    other: {
      me: ["https://cloudbox.app"],
    },
  },

  // Format Detection (for mobile UX)
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // Metadata versioning and experimental fields (optional)
  metadataBase: new URL("https://cloudbox.app"),
  archives: ["https://cloudbox.app/blog"],
  assets: ["https://cloudbox.app/assets"],
};

// Separate viewport export — Next.js recommends moving viewport, themeColor and colorScheme
// out of the main `metadata` export and into the `viewport` export.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`antialiased`}>
        <ReduxStoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <div className="bg-app-bg">{children}</div>
            <Toaster />
          </ThemeProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
