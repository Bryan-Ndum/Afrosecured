import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Afrosecured — Global Scam Awareness & Protection",
  description:
    "Afrosecured helps you detect scams, verify links, and protect your online life with real-time intelligence and transparent reporting.",
  keywords:
    "cybersecurity, scam detection, phishing, online safety, link checker, fraud prevention, digital trust, Africa tech",
  authors: [{ name: "Afrosecured" }],
  openGraph: {
    title: "Afrosecured — Global Scam Awareness & Protection",
    description:
      "Afrosecured helps you detect scams, verify links, and protect your online life with real-time intelligence and transparent reporting.",
    url: "https://www.afrosecured.com",
    siteName: "Afrosecured",
    images: [
      {
        url: "https://www.afrosecured.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afrosecured — Global Scam Awareness & Protection",
    description: "Where safety meets trust — Afrosecured helps you stay protected from online scams.",
    images: ["https://www.afrosecured.com/og-image.jpg"],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Afrosecured",
              url: "https://www.afrosecured.com",
              logo: "https://www.afrosecured.com/logo.png",
              sameAs: ["https://twitter.com/afrosecured", "https://linkedin.com/company/afrosecured"],
              description:
                "Afrosecured helps users detect scams, verify links, and protect their digital lives through transparency, education, and real-time threat intelligence.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                email: "support@afrosecured.com",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable} ${poppins.variable} antialiased`}>
        <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  )
}
