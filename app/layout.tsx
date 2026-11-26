import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { COMPANY, IMG } from '@/lib/site'
import { PREVIEW_COOKIE } from '@/lib/site-content/site-content'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutralive.com').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NutraLive | Herbal Extracts, Amino Acids & Functional Ingredients Supplier',
    template: '%s | NutraLive',
  },
  description:
    'Nutralive Co.,Ltd (NutraLive) supplies standardized herbal extracts, amino acids, functional ingredients and USDA NOP organic ingredients, plus custom granulation, premixes, tablets and hard capsules, to global nutrition, food, cosmetic and pharmaceutical manufacturers from Nanjing, China.',
  keywords: [
    'herbal extracts supplier',
    'amino acids manufacturer',
    'functional ingredients',
    'organic ingredients USDA NOP',
    'nutraceutical raw materials',
    'custom granulation',
    'hard capsule OEM',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'NutraLive | Where Health Lives',
    description:
      'Standardized botanical extracts, amino acids, functional and organic ingredients with custom processing for global manufacturers.',
    type: 'website',
    url: SITE_URL,
    siteName: 'NutraLive',
    images: [{ url: IMG.banner1, width: 1408, height: 768, alt: 'NutraLive standardized botanical extracts and functional ingredients' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutraLive | Where Health Lives',
    description:
      'Standardized botanical extracts, amino acids, functional and organic ingredients with custom processing.',
    images: [IMG.banner1],
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: COMPANY.legalName,
      alternateName: COMPANY.brand,
      url: SITE_URL,
      logo: IMG.logo,
      foundingDate: String(COMPANY.founded),
      email: COMPANY.email,
      telephone: COMPANY.phones[0].label,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Unit 2 (Fudi Center), No. 89 Kazimen, Qinhuai District',
        addressLocality: 'Nanjing',
        addressRegion: 'Jiangsu',
        addressCountry: 'CN',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${COMPANY.brand} — ${COMPANY.tagline}`,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies()
  const isPreview = cookieStore.has(PREVIEW_COOKIE)

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        {isPreview && (
          <div className="flex items-center justify-between gap-4 bg-forest px-4 py-2 text-xs text-white">
            <span>Site Content Preview Mode — draft changes are visible only in this session.</span>
            <form action="/api/site-content/exit-preview" method="post">
              <button
                type="submit"
                className="rounded border border-white/40 px-2.5 py-1 font-semibold hover:bg-white/15"
              >
                Exit Preview
              </button>
            </form>
          </div>
        )}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {!isPreview && process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          async
          src={`https://admin.globle-trade.com/api/public/analytics.js?tenantId=${encodeURIComponent(process.env.NEXT_PUBLIC_TENANT_ID || "9a34602d-2259-4314-99bd-428d72634344")}`}
        />
      </body>
    </html>
  )
}
