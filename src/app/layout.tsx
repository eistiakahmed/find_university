import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Find Your Perfect University | University Search & Comparison",
  description: "Discover and compare top universities worldwide. Search by ranking, tuition fees, location, and more. Make informed decisions about your education.",
  keywords: ["university search", "college comparison", "university rankings", "tuition fees", "higher education"],
  authors: [{ name: "University Finder" }],
  openGraph: {
    title: "Find Your Perfect University",
    description: "Discover and compare top universities worldwide",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
